// backend/server.js
// Single-file replacement — paste over your existing server.js

import "dotenv/config"; // ensure env vars are loaded before anything else
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";

// existing route imports (unchanged)
import authRoutes from "./routes/authRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import userRoutes from "./routes/user.js";
import geminiChatRoutes from "./routes/geminiChatRoutes.js";


// import User model to fetch demographics when userId provided
import User from "./models/User.js";

// Groq SDK (used to call the model)
import Groq from "groq-sdk";

// connect to MongoDB (your existing connection util)
connectDB();

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(bodyParser.json());

// mount existing app routes (unchanged)
app.use("/api/auth", authRoutes);
app.use("/api", foodRoutes);
app.use("/api/user", profileRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/images", express.static("public/images"));
app.use("/api/user", userRoutes);
app.use("/api/chat", geminiChatRoutes);

// List of known diseases for validation (kept from your original file)
const KNOWN_DISEASES = [
  "Diabetes", "Hypertension", "Heart Disease", "Asthma", "Obesity", "Thyroid",
  "Cholesterol", "Arthritis", "Kidney Disease", "Liver Disease", "Celiac Disease",
  "IBS", "GERD", "Anemia", "Osteoporosis", "High Blood Pressure", "Low Blood Pressure",
  "Metabolic Syndrome", "Gout", "Ulcer", "Eczema", "Migraine", "Depression", "Anxiety",
  "Polycystic Ovary Syndrome", "PCOS", "Crohn's Disease", "Psoriasis" , "Glaucoma",
  "Alzheimer's Disease", "Parkinson's Disease", "Multiple Sclerosis", "Epilepsy",
  "Alzheimer's", "Parkinson's", "Multiple Sclerosis", "Epilepsy", "Rheumatoid Arthritis",
  "Lupus", "Scleroderma", "Systemic Lupus Erythematosus", "Fibromyalgia", 
  "Chronic Fatigue Syndrome", "Chronic Obstructive Pulmonary Disease", "COPD", 
  "Bronchitis", "Pneumonia", "Pulmonary Fibrosis", "Pulmonary Hypertension", 
  "Bronchiectasis", "Bronchial Asthma", "Acute Myeloid Leukemia", "Acute Lymphoblastic Leukemia",
  "Chronic Lymphocytic Leukemia", "Multiple Myeloma", "Hodgkin Lymphoma", "Non-Hodgkin Lymphoma",
  "Melanoma", "Basal Cell Carcinoma", "Squamous Cell Carcinoma", "Colon Cancer", 
  "Colorectal Cancer", "Pancreatic Cancer", "Prostate Cancer", "Testicular Cancer", 
  "Breast Cancer", "Ovarian Cancer", "Endometrial Cancer", "Thyroid Cancer", 
  "Kidney Cancer", "Bladder Cancer", "Brain Tumor", "Stroke", "Transient Ischemic Attack",
  "Aneurysm", "Peripheral Artery Disease", "Deep Vein Thrombosis", "Pulmonary Embolism", 
  "Sepsis", "Septic Shock", "Chronic Kidney Disease", "Acute Kidney Injury", "Glomerulonephritis", 
  "Nephrotic Syndrome", "Hepatitis B", "Hepatitis C", "Cirrhosis", "Non-Alcoholic Fatty Liver Disease", 
  "Alcoholic Liver Disease", "Chronic Hepatitis", "Chronic Pancreatitis", "Gallstones", 
  "Appendicitis", "Diverticulitis", "Ulcerative Colitis", "Crohn's Disease", "Anorexia Nervosa", 
  "Bullimia Nervosa", "Schizophrenia", "Bipolar Disorder", "Post-Traumatic Stress Disorder",
  "Obsessive-Compulsive Disorder", "Attention Deficit Hyperactivity Disorder", 
  "Autism Spectrum Disorder", "Down Syndrome", "Cystic Fibrosis", "Sickle Cell Disease", 
  "Hemophilia", "Thalassemia", "Vitamin D Deficiency", "Vitamin B12 Deficiency", 
  "Iron Overload", "Hyperparathyroidism", "Hypoparathyroidism", "Addison's Disease", 
  "Cushing's Syndrome", "Hyperthyroidism", "Hypothyroidism", "Hyperlipidemia", 
  "Hypoglycemia", "Hyperuricemia", "Hypercalcemia", "Hypocalcemia", "Hypernatremia", 
  "Hyponatremia", "Hyperkalemia", "Hypokalemia", "Acid Reflux", "Barrett's Esophagus", 
  "Esophageal Cancer", "Stomach Ulcer", "Peptic Ulcer Disease", "Diverticulosis", 
  "Gallbladder Disease", "Pancreatitis", "Chronic Pain Syndrome", "Fibrosis", 
  "Degenerative Disc Disease", "Osteoarthritis", "Rickets", "Paget's Disease of Bone", 
  "Ankylosing Spondylitis", "Systemic Sclerosis", "Vasculitis", "Raynaud's Phenomenon", 
  "Peripheral Neuropathy", "Myasthenia Gravis", "Guillain-Barré Syndrome", "Lyme Disease", 
  "Malaria", "Tuberculosis", "HIV" , "AIDS", "COVID-19", "Influenza", "Measles", "Mumps", 
  "Rubella", "Varicella (Chickenpox)", "Herpes Zoster (Shingles)", "Ebola Virus Disease", 
  "Zika Virus Infection", "Dengue Fever", "Chikungunya", "Leukemia", "Melanoma", 
  "Carcinoid Tumor", "Neuroblastoma", "Retinoblastoma", "Wilms Tumor", "Acute Respiratory Distress Syndrome",
  "Pulmonary Hypertension", "Bronchiolitis", "Sinusitis", "Otitis Media", "Conjunctivitis",
  "Uveitis", "Macular Degeneration", "Cataract", "Retinitis Pigmentosa", "Retinal Detachment", 
  "Parkinsonism", "Essential Tremor", "Restless Legs Syndrome", "Sleep Apnea", "Insomnia", 
  "Narcolepsy", "Hyperhidrosis", "Anhidrosis", "Hypertrichosis", "Vitiligo", "Erythema Multiforme", 
  "Stevens-Johnson Syndrome", "Pemphigus Vulgaris", "Lichen Planus", "Contact Dermatitis", 
  "Scabies", "Pediculosis (Lice Infestation)", "Ringworm (Tinea)", "Onychomycosis", "Fungal Nail Infection", 
  "Parasitic Infection", "Helicobacter pylori Infection", "Chronic Fatigue Syndrome", "Fibromyalgia", 
  "Chronic Pain", "Autoimmune Hepatitis", "Primary Biliary Cholangitis", "Primary Sclerosing Cholangitis", 
  "Autoimmune Thyroiditis", "Hashimoto's Thyroiditis", "Graves' Disease", "Addisonian Crisis", "Hyperparathyroidism", 
  "Hypoparathyroidism", "Polymyositis", "Dermatomyositis", "Systemic Vasculitis", "Behçet's Disease", "Takayasu Arteritis", 
  "Temporal Artery (Giant Cell) Arteritis", "Granulomatosis with Polyangiitis (Wegener's)",
  "Eosinophilic Granulomatosis with Polyangiitis (Churg-Strauss)", "Polyarteritis Nodosa", "Microscopic Polyangiitis", 
  "Thrombotic Thrombocytopenic Purpura", "Immune Thrombocytopenic Purpura", "Hereditary Hemochromatosis", "Wilson's Disease", 
  "Alpha-1 Antitrypsin Deficiency", "Phenylketonuria (PKU)", "Maple Syrup Urine Disease", "Gaucher Disease", "Fabry Disease", 
  "Huntington's Disease", "Prion Disease", "Creutzfeldt-Jakob Disease", "Multiple System Atrophy", "Progressive Supranuclear Palsy", 
  "Spinocerebellar Ataxia", "Charcot-Marie-Tooth Disease", "Spinal Muscular Atrophy", "Congenital Muscular Dystrophy", "Muscular Dystrophy", 
  "Rheumatic Fever", "Endocarditis", "Myocarditis", "Pericarditis", "Cardiomyopathy", "Arrhythmia", "Atrial Fibrillation", "Ventricular Tachycardia",
  "Ventricular Fibrillation", "Heart Block", "Congenital Heart Defect", "Patent Foramen Ovale", "Mitral Valve Prolapse", "Valve Stenosis",
  "Valve Regurgitation", "Pulmonary Embolism", "Deep Vein Thrombosis", "Varicose Veins", "Chronic Venous Insufficiency", "Peripheral Arterial Disease",
  "Raynaud's Phenomenon", "Thromboangiitis Obliterans (Buerger's Disease", "Hyperemesis Gravidarum", "Ectopic Pregnancy", "Placenta Previa", "Preeclampsia",
  "Eclampsia", "Gestational Diabetes", "Miscarriage", "Infertility", "Polycystic Kidney Disease", "Polycystic Liver Disease", "Hydrocephalus", "Hydrocephalus",
  "Spina Bifida", "Anencephaly", "Down Syndrome", "Turner Syndrome", "Klinefelter Syndrome", "Marfan Syndrome", "Ehlers-Danlos Syndrome", "Neurofibromatosis Type 1", 
  "Neurofibromatosis Type 2", "Fragile X Syndrome", "Angelman Syndrome", "Prader-Willi Syndrome", "Rett Syndrome", "Congenital Heart Disease", 
  "Congenital Diaphragmatic Hernia", "Congenital Hip Dysplasia", "Congenital Muscular Torticollis", "Congenital Cataract", "Congenital Glaucoma", 
  "Congenital Hearing Loss", "Congenital Hypothyroidism", "Congenital Adrenal Hyperplasia", "Congenital Metabolic Disorder", 
  "Congenital Immunodeficiency", "Fever","Congenital Malformation", "Congenital Anomaly", "Congenital Defect"
];
// create Groq client using env var (NO hard-coded key)
const GROQ_KEY = process.env.GROQ_API_KEY;

if (!GROQ_KEY) {
  console.error("❌ GROQ_API_KEY is not set. Check your .env file.");
}

const groq = new Groq({ apiKey: GROQ_KEY });

// helper: few-shot examples to teach the model to output disease-specific meal plans
function fewShotExamples() {
  return `
EXAMPLE 1:
Input: Diabetes
Output (JSON only):
{
  "disease":"Diabetes",
  "summary":"Prioritize low-glycemic carbs, lean protein and high fiber to reduce blood sugar spikes.",
  "recommendedDiet":"Low GI, high fiber",
  "nutrients": { "calories":1400, "protein":"80 g", "fat":"45 g", "carbohydrates":"130 g", "fiber":"28 g" },
  "mealPlan": {
    "breakfast":[{"title":"Steel-cut oats with cinnamon & apple","description":"Low GI oats, fiber","recipeLink":""},{"title":"Boiled egg","description":"Protein to blunt glucose rise","recipeLink":""}],
    "lunch":[{"title":"Grilled chicken salad with quinoa","description":"Lean protein + fiber","recipeLink":""},{"title":"Steamed veggies","description":"Low GI sides","recipeLink":""}],
    "dinner":[{"title":"Baked white fish and cauliflower mash","description":"Low-carb dinner","recipeLink":""},{"title":"Mixed salad","description":"Fiber and volume","recipeLink":""}]
  },
  "motivation":"Consistent portions and fiber-rich foods help keep glucose stable."
}

EXAMPLE 2:
Input: Hypertension
Output (JSON only):
{
  "disease":"Hypertension",
  "summary":"Follow DASH-style eating: low sodium, more fruits/vegetables, lean protein and whole grains.",
  "recommendedDiet":"DASH (low sodium)",
  "nutrients": { "calories":1500, "protein":"85 g", "fat":"50 g", "carbohydrates":"140 g", "sodium_mg":1200 },
  "mealPlan": {
    "breakfast":[{"title":"Oatmeal with berries","description":"Potassium-rich, low sodium","recipeLink":""},{"title":"Low-fat yogurt","description":"Protein and calcium","recipeLink":""}],
    "lunch":[{"title":"Lentil soup (low salt) with salad","description":"Plant protein + veg","recipeLink":""},{"title":"Whole grain roll","description":"Moderate carb","recipeLink":""}],
    "dinner":[{"title":"Roasted salmon w steamed greens","description":"Omega-3s, low salt","recipeLink":""},{"title":"Quinoa (small)","description":"Whole grain side","recipeLink":""}]
  },
  "motivation":"Reduce salt, increase plants, protect your heart."
}
`;
}

// robust parse helper
function tryParseJsonFromText(text) {
  if (!text || typeof text !== "string") return null;
  try {
    return JSON.parse(text);
  } catch (e) {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (e2) {
        return null;
      }
    }
    return null;
  }
}

// build a strict prompt that insists on JSON-only and disease specificity
function buildPrompt({ disease, activityStatus, user }) {
  const demographics = user
    ? `Age: ${user.age ?? "unknown"}, Sex: ${user.sex ?? "unknown"}, Height(cm): ${user.height ?? "unknown"}, Weight(kg): ${user.weight ?? "unknown"}`
    : "No user demographics provided.";

  return `
You are a licensed clinical nutritionist. Use the patient demographics and health condition to produce a personalized meal plan.

Patient info:
${demographics}
Activity level: ${activityStatus || "not provided"}
Health condition: ${disease}

RULES to follow everytime:
1) Output ONLY valid JSON (no surrounding explanation). The JSON MUST include keys:
   "disease", "summary", "recommendedDiet", "nutrients", "mealPlan", "motivation".
2) mealPlan must include "breakfast", "lunch", "dinner" each as arrays of objects with keys "title", "description", "recipeLink".
3) Be disease-specific: tailor foods, prohibited items, and swaps relevant to the condition (e.g., for diabetes emphasize low-GI; for hypertension emphasize low-sodium).
4) Provide at least 2 distinct items per meal, and give a suggestion/swap in the description where helpful.
5) Provide realistic numeric estimates in "nutrients" (calories, protein, fat, carbs). Optionally include fiber and sodium where relevant.
6) Keep strings concise. No extra text, no markdown.
7) It must suggest unique meal plan to every disease/health condition.Same meal plan must be suggested whenever you give the same disease/health condition.It should not suggest same meal plan for every disease/health condition
8) Don't give grilled chicken for every disease that is asked for.
9) Don't give Baked cod for every disease that is asked for.
10) Don't give Avacado for every disease that is asked for.
11) Don't give Greek yogurt for every disease that is asked for.


Follow these EXAMPLES and then produce the JSON only:
${fewShotExamples()}

Produce the JSON now.
`;
}

// POST /api/nutrition — improved handler (keeps same path)
app.post("/api/nutrition", async (req, res) => {
  try {
    const { disease, activityStatus, userId } = req.body ?? {};

    if (!disease || !disease.toString().trim()) {
      return res.status(400).json({ error: "Please enter a disease or condition" });
    }

    const isDiseaseKnown = KNOWN_DISEASES.some(d => d.toLowerCase() === disease.toLowerCase());
    if (!isDiseaseKnown) {
      return res.status(400).json({
        error: "This disease is not available in our database. Please try another health condition."
      });
    }

    // fetch user demographics if userId provided
    let user = null;
    if (userId) {
      try {
        user = await User.findById(userId).lean();
      } catch (e) {
        console.warn("Warning: failed to fetch user for userId:", userId, e?.message ?? e);
        user = null;
      }
    }

    const prompt = buildPrompt({ disease: disease.trim(), activityStatus, user });

    // call Groq via SDK
    const callGroq = async (p, opts = {}) => {
      return await groq.chat.completions.create({
        model: opts.model || "llama-3.1-8b-instant",
        messages: [{ role: "user", content: p }],
        temperature: typeof opts.temperature === "number" ? opts.temperature : 0.8,
        max_tokens: opts.max_tokens || 1500,
      });
    };

    // first try
    const first = await callGroq(prompt, { temperature: 0.8, max_tokens: 1500 });
    console.log("GROQ FIRST RESPONSE SNIPPET:", JSON.stringify(first?.choices?.[0] ?? first).slice(0, 1800));
    const raw1 = first?.choices?.[0]?.message?.content ?? (typeof first === "string" ? first : JSON.stringify(first));
    let parsed = tryParseJsonFromText(raw1);

    // retry with stronger JSON-only emphasis if needed
    if (!parsed) {
      console.warn("First model response not parseable JSON. Retrying with stronger JSON requirement.");
      const retryPrompt = prompt + "\n\nIMPORTANT: Produce ONLY valid JSON (no text).";
      const second = await callGroq(retryPrompt, { temperature: 0.95, max_tokens: 1500 });
      console.log("GROQ RETRY RESPONSE SNIPPET:", JSON.stringify(second?.choices?.[0] ?? second).slice(0, 1800));
      const raw2 = second?.choices?.[0]?.message?.content ?? JSON.stringify(second);
      parsed = tryParseJsonFromText(raw2);

      if (!parsed) {
        // return helpful debug info (so frontend doesn't crash silently)
        return res.status(500).json({
          error: "AI returned non-JSON output after retry. See raw for debugging.",
          raw: (raw2 || raw1).slice(0, 3000),
        });
      }
    }

    // basic validation
    if (!parsed || !parsed.mealPlan || !parsed.summary || !parsed.nutrients) {
      console.error("Parsed JSON missing required keys:", Object.keys(parsed || {}));
      return res.status(500).json({
        error: "AI returned JSON but missing required keys (mealPlan, summary, nutrients).",
        parsedKeys: Object.keys(parsed || {}),
        parsed,
      });
    }

    // extra heuristic: ensure meals vary (not identical across diseases)
    // (We don't strictly block here, but we warn in logs if items are repeated)
    const mealArrays = Object.values(parsed.mealPlan).filter(a => Array.isArray(a));
    const allTitles = mealArrays.flatMap(arr => arr.map(it => (it?.title || JSON.stringify(it)).toString()));
    const titleCounts = {};
    for (const t of allTitles) titleCounts[t] = (titleCounts[t] || 0) + 1;
    const commonRepeats = Object.entries(titleCounts).filter(([k,v]) => v > 2);
    if (commonRepeats.length > 3) {
      console.warn("Detected many repeated items across meals (may indicate too-generic output):", commonRepeats.slice(0,10));
    }

    // success: return structured JSON
    return res.json(parsed);
  } catch (err) {
    console.error("Error generating plan:", err && (err.message ?? err));
    return res.status(500).json({ error: "Failed to generate plan. Please try again.", details: (err?.message ?? String(err)).slice(0, 500) });
  }
});

// simple health endpoints (unchanged)
app.get("/", (req, res) => res.send("Backend working ✅"));
app.get("/test", (req, res) => res.json({ message: "✅ Frontend is now connected to Backend!" }));

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
