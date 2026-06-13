import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic } = await req.json();

    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Topic is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a creative social media caption writer. Given a topic, generate 5 unique, engaging captions suitable for Instagram or social media posts.

Rules:
1. Do NOT repeat the user's topic/prompt verbatim in the captions
2. Write natural, creative, and engaging language
3. Each caption should have a different tone/angle (funny, inspirational, chill, aesthetic, bold)
4. Include relevant emojis naturally within the text
5. End each caption with 2-4 relevant hashtags
6. Keep each caption between 10-25 words (excluding hashtags)
7. Make them feel authentic, not robotic

You MUST respond with ONLY a JSON array of strings, no markdown, no code blocks. Example:
["caption one here ✨ #Tag1 #Tag2", "caption two here 🌟 #Tag3"]`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Topic: ${topic.trim()}` },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No response from AI");
    }

    let captions: string[];
    try {
      const clean = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      captions = JSON.parse(clean);
    } catch {
      // Fallback: split by newlines if JSON parsing fails
      captions = content.split("\n").filter((l: string) => l.trim().length > 0).slice(0, 5);
    }

    return new Response(
      JSON.stringify({ captions }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("generate-captions error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
