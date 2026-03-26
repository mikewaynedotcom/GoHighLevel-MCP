import { DEFAULT_SYSTEM } from "./prompts";

const API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

export async function askClaude(prompt, system) {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("No API key set. Please enter your Anthropic API key.");
  }

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      system: system || DEFAULT_SYSTEM,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `API error ${res.status}`);
  }

  const data = await res.json();
  return data.content?.map((b) => b.text || "").join("\n") || "";
}

export function getApiKey() {
  return localStorage.getItem("anthropic_api_key") || "";
}

export function setApiKey(key) {
  localStorage.setItem("anthropic_api_key", key);
}
