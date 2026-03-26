import { askClaude } from "./claude";
import { PROMPTS, PLATFORMS } from "./prompts";

function parseVerdict(critique) {
  const upper = critique.toUpperCase();
  if (upper.includes("OVERALL VERDICT: REVISE")) return true;
  if (upper.includes("OVERALL VERDICT: APPROVED")) return false;
  const reviseCount = (upper.match(/\bREVISE\b/g) || []).length;
  const approvedCount = (upper.match(/\bAPPROVED\b/g) || []).length;
  return reviseCount > approvedCount;
}

export const STEP_LABELS = [
  "Extract Key Points",
  "Draft Platform Versions",
  "Self-Critique",
  "Revise or Approve",
];

export async function runPipeline(content, onStepUpdate) {
  // Step 1: Extract key points
  onStepUpdate({ step: 0, status: "active" });
  const keyPoints = await askClaude(PROMPTS.extract(content));
  onStepUpdate({ step: 0, status: "done", data: keyPoints });

  // Step 2: Draft per platform
  onStepUpdate({ step: 1, status: "active" });
  const drafts = {};
  for (const platform of PLATFORMS) {
    drafts[platform.name] = await askClaude(
      PROMPTS.draft(platform, keyPoints, content)
    );
  }
  onStepUpdate({ step: 1, status: "done", data: drafts });

  // Step 3: Self-critique
  onStepUpdate({ step: 2, status: "active" });
  const critique = await askClaude(PROMPTS.critique(drafts));
  const needsRevision = parseVerdict(critique);
  onStepUpdate({ step: 2, status: "done", data: { critique, needsRevision } });

  // Step 4: Revise if needed
  onStepUpdate({ step: 3, status: "active" });
  const finals = {};
  if (needsRevision) {
    for (const platform of PLATFORMS) {
      finals[platform.name] = await askClaude(
        PROMPTS.revise(platform.name, drafts[platform.name], critique)
      );
    }
  } else {
    Object.assign(finals, drafts);
  }
  onStepUpdate({ step: 3, status: "done", data: finals });

  return { keyPoints, drafts, critique, finals, revised: needsRevision };
}
