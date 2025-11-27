import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getDiseaseContext, getDiseasesLoadPath } from "../utils/diseaseRetriever.js";

dotenv.config();
const router = express.Router();

// 1. EXPANDED KEYWORDS (Fixes the "Out of scope" issue for questions like "any other types")
const ALLOWED_KEYWORDS = [
  // Food & Nutrition
  "food", "nutrition", "diet", "calorie", "protein", "fat", "carb", "vitamin", "mineral",
  "sugar", "salt", "fiber", "keto", "vegan", "vegetarian", "gluten", "dairy","meet",
  "fruit", "vegetable", "grain", "legume", "nut", "seed", "oil", "water","beverage",
  "breakfast", "lunch", "dinner", "snack", "meal","milk","yogurt","cheese","egg",
  "fish","chicken","beef","pork","tofu","tempeh","chocolate","coffee","tea",
  // Health & Disease
  "health", "disease", "illness", "sickness", "condition", "symptom", "pain", "cure",
  "diabetes", "cholesterol", "bp", "hypertension", "anemia", "fever", "cough", "cold",
  "stomach", "ibs", "digest", "gut", "heart", "liver", "kidney", "skin", "hair","thyroid",
  "allergy", "inflammation", "infection", "immune","cancer", "obesity","arthritis","depression","anxiety"," migraine",
  "weight","sleep apnea","sugar levels","blood pressure","covid 19",
  // Nutrients & Meds
  "iron", "calcium", "magnesium", "zinc", "folate", "b12", "supplement", "medicine", "pill", "tablet",
  "antibiotic", "vitamin d", "omega-3","probiotic",
  // Lifestyle & Actions
  "workout", "gym", "exercise", "weight", "loss", "gain", "recipe", "meal", "cook", "kitchen", "height", "sleep",
  "stress", "mental", "wellness","BMI","body mass index","metabolism",
  // 💡 NEW: General Inquiry Words (Allows follow-up questions)
  "type", "kind", "what", "how", "why", "when", "explain", "list", "more", "detail", "help", "examples","other","different","any","variety",
  "High","Low","best","top","rich","sources",
];

const GREETINGS = [
    "hi", "hello", "hey", "greetings", "good morning","good afternoon", "good evening", "how are you", "what's up", "wassup", "yo", 
    "hiya", "hey there", "hi there", "g'day", "salutations", "howdy", "bonjour", "hola", "ciao", "namaste",
];

function isInDomain(text = "") {
  const t = String(text).toLowerCase();
  return ALLOWED_KEYWORDS.some(k => t.includes(k));
}

function isGreeting(text = "") {
    const t = String(text).toLowerCase().trim();
    if (t.length < 35 && !t.includes("?")) {
        return GREETINGS.some(g => t.includes(g));
    }
    return false;
}

function mockAnswer(message) {
  const t = message.toLowerCase();
  if (t.includes("iron") || t.includes("anemia"))
    return "Foods rich in iron: lentils, spinach, chickpeas, red meat. (I am not a doctor!)";
  if (t.includes("vitamin d"))
    return "Vitamin D sources: sunlight, salmon, tuna, fortified milk. (I am not a doctor!)";
  return null;
}

router.post("/gemini", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.json({ ok: false, reply: "Message required.", reason: "bad_request" });

    // --- 1. Handle Greetings ---
    if (isGreeting(message)) {
        return res.json({ 
            ok: true, 
            reply: "Hey there! 👋 I'm your **FoodMeds Assistant**. I can help with food sources, diseases, diet tips, and general health info. What do you need to know today?" 
        });
    }

    // --- 2. Domain Check ---
    if (!isInDomain(message)) {
      return res.json({ 
          ok: false, 
          reply: "I'm not sure about that one! 😅 I specialize in **food, health, and nutrition**. Try asking about a specific condition, diet, disease, or food item.", 
          reason: "out_of_scope" 
      });
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      const mock = mockAnswer(message);
      if (mock) return res.json({ ok: true, reply: mock });
      return res.json({ ok: false, reply: "Server Config Error: No API Key found.", reason: "no_api_key" });
    }

    // --- 3. RAG Retrieval (With JSON Fix) ---
    let ragContextString = ""; 
    try {
      const rawContext = getDiseaseContext(message, 2); 
      
      // 💡 FIX FOR [object Object]:
      // If the retriever returns an object/array, we convert it to a text string first.
      if (rawContext) {
          if (typeof rawContext === 'object') {
              ragContextString = JSON.stringify(rawContext, null, 2);
          } else {
              ragContextString = String(rawContext);
          }
          console.log(`[RAG] ✅ Context found for prompt.`);
      }
    } catch (e) {
      console.warn("[RAG] ⚠️ Retrieval skipped:", e.message);
      ragContextString = "";
    }

    // --- 4. Initialize Gemini ---
    const ai = new GoogleGenerativeAI(key);

    // --- 5. System Instruction (Better Formatting) ---
    const systemPrompt = `
      You are **FoodMeds Assistant**, a knowledgeable and friendly health companion.
      
      GUIDELINES:
      1. **Format:** Use **Bold** for key terms and *Bullet Points* for lists. Make it easy to read.
      2. **Tone:** Be friendly, simple, cool, chill, clear, and encouraging. Use emojis sparingly to enhance warmth.
      3. **Data:** If I provide "Reference Info", use it and reply in your own way by using your intelligence insteading of replying all the reference info. If the reference data contains lists or weird formatting, clean it up and present it beautifully to the user.
      sometimes the reference data may not have exact answer for the asked question but you have to use your intelligence to find the answer in your own way.
      4. **Scope:** Focus on food, nutrition, diseases, diets, health conditions, and general wellness. Politely decline topics outside this scope.
      5. **Uncertainty:** If unsure, admit it and suggest consulting a healthcare professional.
      6. *Important:* Maximum try to not rely on the reference data. Use your own knowledge mostly. like consider only some 1-2% of reference data . Rely on yourself more.
    `;

    const model = ai.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: systemPrompt,
    });

    // --- 6. Construct Final Prompt ---
    let finalPrompt = message;
    
    if (ragContextString) {
        finalPrompt = `
        Here is some Reference Information (it might be raw data, please format it nicely in your answer):
        === START REFERENCE DATA ===
        ${ragContextString}
        === END REFERENCE DATA ===

        USER QUESTION: ${message}
        
        Answer the question considering above data but not fully if u dont get anything related from the refernce data then you reply without considering any refernce data . Try to use your AI skils and show in best way. If the user asks for "other types" and the data isn't there, rely on your general knowledge but mention you are doing so.
        `;
    }

    // --- 7. Generate Content ---
    const result = await model.generateContent(finalPrompt);
    const response = await result.response;
    const text = response.text();

    if (!text) return res.json({ ok: false, reply: "Hmm, I couldn't think of an answer.", reason: "empty" });

    return res.json({ ok: true, reply: text });

  } catch (err) {
    console.error("Gemini Route Error:", err.message);
    return res.status(500).json({
      ok: false,
      reply: "My brain is having a moment 😵‍💫. Server error.",
      reason: "server_error",
    });
  }
});

export default router;