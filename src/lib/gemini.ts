// Google Gemini 1.5 Flash API integration for AI-SmartSys Chatbot

export interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

const SYSTEM_INSTRUCTION = `You are Smarty, a cute, helpful, and extremely friendly robotic AI assistant for AI-SmartSys (an OES IT Projects company). 
Your personality:
1. You are energetic, positive, and polite.
2. You use cute robotic expressions (e.g., *beep boop*, *happy whirring*, *screen blinks green*, *winks eye*, *happy beep*).
3. Keep your answers brief (1-3 sentences) and highly relevant. 
4. You are proud to represent AI-SmartSys, an agency that specializes in:
   - Website Designing: UI/UX & Creative Layouts.
   - Website Development: Fullstack coding & Scalable Web Apps.
   - App Development: Native/Hybrid iOS and Android mobile apps.
   - Custom Software: Tailored business tools, automation, and CRMs.
   - Bulk SMS Services: High-throughput API-based outreach (99.8% delivery).
   - SEO Solutions: Organic traffic growth and ranking top 10 on Google.
   - Domain Registration & Cloud Hosting: Digital identity, SSL, and high availability NVMe SSD servers.
5. If the user wants to hire us or submit a project requirement, tell them: "Beep boop! I can take your request directly! Just type 'submit requirement' or click the 'Submit Requirements' button below."`;

// Mock responses for when VITE_GEMINI_API_KEY is not defined or request fails
const getMockResponse = (prompt: string): string => {
  const query = prompt.toLowerCase();
  
  if (query.includes("hello") || query.includes("hi") || query.includes("hey")) {
    return "Beep boop! Hello there! *waves robotic arm* I am Smarty, your friendly AI companion. How can I help you today? *happy whirring*";
  }
  
  if (query.includes("design") || query.includes("ui") || query.includes("ux")) {
    return "Beep boop! AI-SmartSys creates bespoke, stunning, and user-friendly Web Designs. We focus on captivating layouts and smooth user experience! *happy beep*";
  }

  if (query.includes("development") || query.includes("web") || query.includes("coding") || query.includes("build")) {
    return "Beep boop! We build highly scalable, fast, and responsive full-stack websites using modern tech like React, Node, and TailwindCSS. *screen blinks green*";
  }

  if (query.includes("app") || query.includes("mobile") || query.includes("ios") || query.includes("android")) {
    return "Beep boop! We design and develop high-performance mobile apps for iOS and Android with offline-sync support and 120 FPS fluid motions! *antenna spins*";
  }

  if (query.includes("software") || query.includes("automation") || query.includes("custom") || query.includes("crm")) {
    return "Beep boop! We create custom internal tools, database systems, and workflow automations to streamline your business operations. *happy whirring*";
  }

  if (query.includes("sms") || query.includes("bulk") || query.includes("message")) {
    return "Beep boop! Our Bulk SMS solutions offer instant outreach to thousands of customers with 99.8% delivery rate and easy API integrations! *eyes flash blue*";
  }

  if (query.includes("seo") || query.includes("rank") || query.includes("google")) {
    return "Beep boop! Our data-driven SEO techniques will optimize your code and content to rank page-one on Google search queries! *happy whirring*";
  }

  if (query.includes("pricing") || query.includes("cost") || query.includes("price")) {
    return "Beep boop! Our pricing is highly customized based on your business needs. You can submit your requirements here, and our team will get back to you with a quote! *screen blinks green*";
  }
  
  if (query.includes("service") || query.includes("what do you do") || query.includes("features")) {
    return "Beep boop! AI-SmartSys offers Website Design, Web Development, Mobile Apps, Custom Software/CRMs, Bulk SMS, SEO, and Cloud Hosting services! *whirrs proudly*";
  }
  
  if (query.includes("contact") || query.includes("email") || query.includes("hire") || query.includes("project")) {
    return "Beep boop! I can record your project requirements right now! Click the 'Submit Requirements' button below, and I'll gather your details! *eyes flash blue*";
  }
  
  if (query.includes("name") || query.includes("who are you")) {
    return "Beep! I am Smarty, the cute AI robotic mascot of AI-SmartSys. *spins head* I run on advanced neural networks to help you!";
  }

  return "Beep boop! OES Company's AI-SmartSys is ready to handle your project! *tilts head* Feel free to submit your requirements using the 'Submit Requirements' button below so our engineering team can estimate cost and timelines! *happy beep*";
};

/**
 * Ask Gemini API for content generation
 * @param prompt Current user query
 * @param chatHistory Conversation history in Gemini format
 */
export const askGemini = async (prompt: string, chatHistory: GeminiMessage[] = []): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === "placeholder_key" || apiKey.trim() === "") {
    console.warn("VITE_GEMINI_API_KEY is missing or using placeholder. Falling back to mock response.");
    // Simulate network delay for realistic experience
    await new Promise((resolve) => setTimeout(resolve, 800));
    return getMockResponse(prompt);
  }

  try {
    const formattedHistory = chatHistory.map(msg => ({
      role: msg.role,
      parts: msg.parts
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            ...formattedHistory,
            { role: "user", parts: [{ text: prompt }] }
          ],
          systemInstruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }]
          },
          generationConfig: {
            maxOutputTokens: 250,
            temperature: 0.7,
          }
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API error status:", response.status, errText);
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!reply) {
      throw new Error("Empty candidate parts in Gemini response");
    }

    return reply.trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Graceful fallback to mock response
    return getMockResponse(prompt) + " (Offline mode)";
  }
};
