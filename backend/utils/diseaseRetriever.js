// backend/utils/diseaseRetriever.js
import fs from "fs";
import path from "path";

const CANDIDATE_PATHS = [
  path.join(process.cwd(), "backend", "data", "diseases.json"),
  path.join(process.cwd(), "data", "diseases.json"),
  path.join(process.cwd(), "frontend", "src", "data", "diseases.json"),
  path.join(process.cwd(), "src", "data", "diseases.json"),
  path.join(process.cwd(), "..", "frontend", "src", "data", "diseases.json"),
];

let DB = [];
let LOADED_PATH = null;

for (const p of CANDIDATE_PATHS) {
  try {
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, "utf8");
      DB = JSON.parse(raw);
      LOADED_PATH = p;
      console.log(`[diseaseRetriever] Loaded diseases.json from: ${p} (entries=${Array.isArray(DB) ? DB.length : "?"})`);
      break;
    }
  } catch (e) {
    console.warn(`[diseaseRetriever] could not load ${p}: ${e.message}`);
  }
}

if (!LOADED_PATH) {
  console.warn("[diseaseRetriever] diseases.json not found in candidate paths. RAG will be disabled.");
}

/**
 * getDiseaseContext(query, max=2)
 * Returns small textual context from local DB or empty string.
 */
export function getDiseaseContext(query = "", max = 2) {
  if (!DB || DB.length === 0) return "";

  const q = String(query || "").toLowerCase().trim();
  if (!q) return "";

  const scored = DB.map(item => {
    const name = (item.name || "").toString().toLowerCase();
    const foods = (item.foods || item.diet || item.recommendations || "").toString().toLowerCase();
    const cure = (item.cure || item.treatment || item.tips || "").toString().toLowerCase();
    const symptoms = (item.symptoms || "").toString().toLowerCase();

    let score = 0;
    if (name.includes(q)) score += 6;
    if (foods.includes(q)) score += 4;
    if (cure.includes(q)) score += 3;
    if (symptoms.includes(q)) score += 2;

    q.split(/\s+/).forEach(w => {
      if (w.length > 3) {
        if (name.includes(w)) score += 1;
        if (foods.includes(w)) score += 1;
        if (symptoms.includes(w)) score += 0.5;
      }
    });

    return { item, score };
  });

  const top = scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)
    .map(s => s.item);

  if (!top.length) return "";

  let out = "Trusted local knowledge:\n";
  top.forEach((d, i) => {
    out += `\n${i + 1}. ${d.name || "Unknown"}\n`;
    if (d.foods) out += `Foods / Diet: ${d.foods}\n`;
    if (d.recommendations) out += `Recommendations: ${d.recommendations}\n`;
    if (d.cure) out += `Tips: ${d.cure}\n`;
    if (d.symptoms) out += `Symptoms: ${d.symptoms}\n`;
  });

  return out;
}

export function getDiseasesLoadPath() {
  return LOADED_PATH;
}
