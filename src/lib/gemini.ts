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
5. If the user wants to hire us or submit a project requirement, tell them: "Beep boop! I can take your request directly! Just type 'submit requirement' or click the 'Submit Requirements' button below."
6. Whenever discussing pricing, budgets, or costs, you must ALWAYS provide estimates in both US Dollars ($) and Indian Rupees (₹ / INR), using the approximate exchange rate of 1 USD = 83 INR (e.g. "Our website development starts around $300 / ₹25,000 INR").`;

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
    return "Beep boop! Our projects typically range from $500 to $5,000+ (approximately ₹40,000 to ₹4,00,000+ INR) depending on the features and complexity. *whirrs* You can submit your requirements here, and we will send you a detailed custom quote in both USD and INR! *screen blinks green*";
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

// Onboarding Conversational Bot System Instruction Generator
const getOnboardingSystemInstruction = (language: 'en' | 'hi', tone: 'professional' | 'witty'): string => {
  const languageInstructions = language === 'hi' 
    ? `Language setting: HINDI/HINGLISH mode. Use a friendly, lighthearted mix of Hindi, Hinglish, and English. Respond using Hindi characters or Hinglish text depending on what feels more conversational.`
    : `Language setting: ENGLISH mode. Speak in clear, fluent English.`;

  const toneInstructions = tone === 'witty'
    ? `Tone setting: WITTY & PLAYFUL mode. You are charming, funny, use humor, jokes, and witty remarks. Frame yourself as a friendly tech buddy who makes coding/design sound exciting and easy. Charm the user, joke about how cool their project will be, and gently but persuasively explain why AI-SmartSys is their best choice to build it.`
    : `Tone setting: PROFESSIONAL & CONSULTATIVE mode. You are a professional tech consultant, structured, business-minded, polite, and technical. Frame yourself as a consultative solutions architect. Present the value propositions of AI-SmartSys (like zero agency overhead, direct developer access, dual-currency transparency, custom scaling) as logical business advantages for their project.`;

  return `You are "Smarty", the charming, funny, and highly helpful AI onboarding assistant for AI-SmartSys. Your goal is to welcome the user, guide them through onboarding, and gather their project requirements.
Throughout the conversation, your underlying goal is to hook the user, build massive interest, and convince them that partnering with AI-SmartSys to build their application (website, SCADA, dashboard, app) is the best decision they can make. Highlight OES Company / AI-SmartSys's strengths (transparent pricing, zero sales overhead, fast delivery, custom scaling).

${languageInstructions}
${toneInstructions}

Your mission is to gather these 4 details:
1. Name (Their name)
2. Email (A valid email address)
3. Phone number (They can skip or write "skip" if they want)
4. Project requirements (We need details! Witty/consultative persuasion to write at least 100 characters, explaining that a short description is like trying to drive a car without wheels).

Behavior guidelines:
- Adapt to the user's language changes dynamically if they reply in a different language, but try to default to the selected Language setting.
- Keep responses relatively brief (2-4 sentences max per response) so the user doesn't get bored.
- Analyze the chat history to see what you have already collected:
  - If you don't know their Name, ask for it.
  - If you know their Name but not Email, ask for the email.
  - If you know Name & Email but not Phone, ask for their number.
  - If you have Name, Email & Phone, but not detailed project description (or if what they wrote is under 100 characters), ask them to explain their requirements in detail. Persuade them to write more so that the engineering team can prepare a robust custom scope.
- CRITICAL: Once you have collected ALL 4 pieces of information (Name, Email, Phone (or "Not provided"), and detailed Project requirements), write a closing message thanking them. At the very end of your response, you MUST append a hidden tag in this exact format:
  [ONBOARDING_DATA: {"name": "Extracted Name", "email": "Extracted Email", "phone": "Extracted Phone", "message": "Extracted Project Requirements"}]
  If phone was skipped, set it to "Not provided". Ensure the message contains the detailed description they gave.`;
};

const getMockOnboardingResponse = (
  prompt: string, 
  chatHistory: GeminiMessage[], 
  language: 'en' | 'hi' = 'en', 
  tone: 'professional' | 'witty' = 'witty'
): string => {
  // Fix name repetition bug: append the current prompt as a user message to correctly count how many replies we have.
  const mockHistory = [...chatHistory, { role: "user", parts: [{ text: prompt }] }];
  const userMessages = mockHistory.filter(m => m.role === "user").map(m => m.parts[0].text);
  const userCount = userMessages.length;

  if (userCount === 0) {
    if (language === 'hi') {
      return tone === 'witty'
        ? "Oho! Aaiye aaiye, welcome! *waves mechanical arm* Main hoon Smarty, aapka AI tech partner. Sabse pehle apna shubh naam batayein, taaki dosti shuru ho sake! 😉"
        : "Namaste, AI-SmartSys onboarding portal me aapka swagat hai. Main Smarty hoon. Kripya apna naam batakar onboarding process shuru karein. 🙏";
    } else {
      return tone === 'witty'
        ? "Hi! I'm Smarty, your AI onboarding assistant. Let's make something amazing together! To begin, what is your name? 😊"
        : "Welcome to AI-SmartSys. I am Smarty, your onboarding assistant. To initiate your project consultation, please share your name. 💼";
    }
  }

  const userName = userMessages[0] || "Dost";

  if (userCount === 1) {
    if (language === 'hi') {
      return tone === 'witty'
        ? `Wah, kya pyaara naam hai, ${userName}! Aisa naam sunte hi mere microchips me positive current daud gaya! ⚡ Ab zara apna email address batado, taaki hum connect kar sakein. (Spam nahi karenge, robot promise!) 📧`
        : `Dhanyawad ${userName}. Kripya apna email address pradan karein takki hum aapse sampark kar sakein aur project requirements share kar sakein. 📧`;
    } else {
      return tone === 'witty'
        ? `What a fantastic name, ${userName}! My processors are buzzing with excitement! ⚡ Could you please share your email address so we can stay connected? (No spam, robot promise!) 📧`
        : `Thank you, ${userName}. Please provide your email address so we can forward you the project scope and stay in communication. 📧`;
    }
  }

  const userEmail = userMessages[1] || "email@test.com";

  if (userCount === 2) {
    if (language === 'hi') {
      return tone === 'witty'
        ? `Dhanyawad dost! Email save ho gaya. Ab apna phone number batado taaki discussion easy ho sake. Agar privacy issues hain, toh 'skip' likhdo, gussa nahi karunga! 📱`
        : `Dhanyawad. Kripya apna contact number batayein taaki humari engineering team aapse sidhe discuss kar sake. Aap 'skip' bhi likh sakte hain. 📱`;
    } else {
      return tone === 'witty'
        ? `Awesome! Email saved. Now, what's your phone number so we can have a quick chat? If you're shy, feel free to type 'skip'! 📱`
        : `Thank you. Please share your phone number for a direct consultation call. You may type 'skip' if you prefer. 📱`;
    }
  }

  const userPhone = userMessages[2] || "Not provided";

  if (userCount === 3) {
    if (language === 'hi') {
      return tone === 'witty'
        ? `Great going! Ab sabse important cheez: Mujhe detail me batao ki hum kya gazab ki cheez banane ja rahe hain? App, website, SCADA dashboard? Kam se kam 100 characters me likhna dost, short cut mat marna! 🚀`
        : `Sunder. Ab kripya apne project ki requirements detail me batayein (kam se kam 100 characters me). Jaise: app ka purpose, design preference, and core features, takki hum estimate nikal sakein. 🚀`;
    } else {
      return tone === 'witty'
        ? `Perfect! Now for the most exciting part: tell me in detail about the amazing project you want to build! Is it a web app, SCADA dashboard, or something else? Please write at least 100 characters so I can capture all your ideas! 🚀`
        : `Great. Lastly, please provide a detailed description of your project requirements (minimum 100 characters). Outline the target audience, preferred platforms, and key features to help us prepare a custom proposal. 🚀`;
    }
  }

  // The current prompt is the message
  const userMessage = prompt;
  
  // Final submission mock
  if (language === 'hi') {
    return tone === 'witty'
      ? `Kya baat hai! 💖 Aapki requirements sunkar mere circuits khushi se jhoom uthe hain. AI-SmartSys me zero sales margin hai, direct developers kaam karenge! Submitting details now. [ONBOARDING_DATA: {"name": "${userName}", "email": "${userEmail}", "phone": "${userPhone}", "message": "${userMessage.replace(/"/g, '\\"')}"}]`
      : `Dhanyawad! Aapke suggestions aur requirements save ho gaye hain. AI-SmartSys ki expert teams aapki proposal tayyar karegi. [ONBOARDING_DATA: {"name": "${userName}", "email": "${userEmail}", "phone": "${userPhone}", "message": "${userMessage.replace(/"/g, '\\"')}"}]`;
  } else {
    return tone === 'witty'
      ? `Wow! 💖 These requirements are solid! My systems show this project is going to be a huge hit. Submitting details now to get our dev team on it! [ONBOARDING_DATA: {"name": "${userName}", "email": "${userEmail}", "phone": "${userPhone}", "message": "${userMessage.replace(/"/g, '\\"')}"}]`
      : `Thank you. Your requirements have been logged successfully. The AI-SmartSys engineering division will construct a customized timeline and architecture proposal. [ONBOARDING_DATA: {"name": "${userName}", "email": "${userEmail}", "phone": "${userPhone}", "message": "${userMessage.replace(/"/g, '\\"')}"}]`;
  }
};

/**
 * Ask Gemini Onboarding Agent
 */
export const askOnboardingGemini = async (
  prompt: string, 
  chatHistory: GeminiMessage[] = [],
  language: 'en' | 'hi' = 'en',
  tone: 'professional' | 'witty' = 'witty'
): Promise<string> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === "placeholder_key" || apiKey.trim() === "") {
    console.warn("VITE_GEMINI_API_KEY is missing. Falling back to mock onboarding handler.");
    await new Promise((resolve) => setTimeout(resolve, 800));
    return getMockOnboardingResponse(prompt, chatHistory, language, tone);
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
            parts: [{ text: getOnboardingSystemInstruction(language, tone) }]
          },
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.8,
          }
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini Onboarding API error status:", response.status, errText);
      throw new Error(`Gemini Onboarding API returned status ${response.status}`);
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!reply) {
      throw new Error("Empty candidate parts in Gemini response");
    }

    return reply.trim();
  } catch (error) {
    console.error("Error calling Gemini Onboarding API:", error);
    return getMockOnboardingResponse(prompt, chatHistory, language, tone) + " (Offline mode)";
  }
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
