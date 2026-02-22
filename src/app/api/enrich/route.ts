export const runtime = "nodejs";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL required" }, { status: 400 });
    }

    // 1. Fetch raw HTML
    const pageRes = await fetch(url);
    const html = await pageRes.text();

    // 2. Simple text cleanup
    const text = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // 3. Send to LLM
    const enriched = await generateEnrichment(text, url);

    return NextResponse.json(enriched);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Enrichment failed", details: JSON.stringify(error) },
      { status: 500 }
    );
  }
}

// ---------------------------
// AI Extraction Logic
// ---------------------------
async function generateEnrichment(text: string, sourceUrl: string) {
  const prompt = `
Given this text extracted from the company's public website, produce structured fields:

TEXT:
${text}

Return a JSON object with:
{
  "summary": "1-2 sentences",
  "bullets": ["3-6 points of what they do"],
  "keywords": ["5-10 keywords"],
  "signals": ["2-4 derived signals (e.g. careers page live, blog updated)"],
  "sources": [
    { "url": "${sourceUrl}", "timestamp": "${new Date().toISOString()}" }
  ]
}

Respond ONLY with the JSON object, no markdown code blocks or extra text.`;

  try {
    const client = new GoogleGenAI({});
    const response = await client.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const textOutput = response.text;
    console.log("Gemini response text:", textOutput);

    if (!textOutput) {
      console.error("Gemini returned empty text output");
      return { error: "Gemini returned empty response" };
    }

    // Remove markdown code blocks if present (just in case)
    let jsonStr = textOutput.trim();
    if (jsonStr.startsWith("```json")) {
      jsonStr = jsonStr.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    } else if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```\n?/, "").replace(/\n?```$/, "");
    }

    console.log("JSON string to parse:", jsonStr);
    const parsed = JSON.parse(jsonStr);
    console.log("Parsed successfully:", parsed);

    // Validate that we got expected fields
    if (!parsed.summary && !parsed.bullets && !parsed.keywords) {
      console.warn("Enrichment missing expected fields:", parsed);
      return { error: "Incomplete enrichment data" };
    }

    return parsed;
  } catch (err) {
    console.error("Gemini parsing error:", err);
    return { error: "Failed to parse enrichment", details: String(err) };
  }
}