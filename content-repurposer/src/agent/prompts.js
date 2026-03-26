export const DEFAULT_SYSTEM =
  "You are a direct, no-fluff content strategist. Plain English. Short sentences. No emojis. No corporate jargon. No hype language. No em dashes. Every word earns its spot.";

export const PLATFORMS = [
  {
    name: "LinkedIn",
    guide: `Write a LinkedIn post. 150-200 words.
Hook in the first line that stops the scroll.
Double-space between short punchy paragraphs.
End with a clear takeaway or a single question.
No hashtags. No emojis.`,
  },
  {
    name: "Short-Form Video Hook",
    guide: `Write a 15-second video hook script. Three lines max.
First line stops the scroll.
Second line builds tension or curiosity.
Third line delivers the payoff.
Written as spoken words, not stage directions.`,
  },
  {
    name: "X / Twitter",
    guide: `Write a single tweet. Under 280 characters.
Punchy and direct. No hashtags. No emojis.
Make every word earn its spot.`,
  },
];

export const PROMPTS = {
  extract(content) {
    return `Extract exactly 5 key points from this content.
Number them 1-5.
Each point is one specific, concrete sentence.
No filler. No summaries of summaries.

Content:
${content}`;
  },

  draft(platform, keyPoints, originalContent) {
    return `${platform.guide}

Use these key points as your source material:
${keyPoints}

Original content for reference:
${originalContent}`;
  },

  critique(drafts) {
    const formatted = Object.entries(drafts)
      .map(([name, text]) => `=== ${name} ===\n${text}`)
      .join("\n\n");

    return `You are a ruthless content editor. Review these social media drafts.
For each platform, state one thing that works and one that needs fixing.
Give a verdict on each: APPROVED or REVISE.
Be specific about what to fix.

${formatted}

End with:
OVERALL VERDICT: [APPROVED or REVISE]`;
  },

  revise(platformName, draft, critique) {
    return `Revise this ${platformName} draft based on the critique.
Fix only what was flagged. Keep the same format.
Return only the revised version, nothing else.

Draft:
${draft}

Critique:
${critique}`;
  },
};
