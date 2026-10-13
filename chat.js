import OpenAI from "openai";

const crisisPattern = /\b(kill myself|suicid(?:e|al)|end my life|hurt myself|self[- ]harm|don't want to live|do not want to live|overdose)\b/i;
const safetyMessage = `I'm really sorry you're dealing with this. Your safety matters more than solving everything in this chat. If you may act on thoughts of harming yourself, please move near a trusted person and contact local emergency services now. In India, call 112 for emergencies or Tele-MANAS at 14416 for mental-health support. If you are elsewhere, contact your local crisis line or emergency number. I can stay with you while you take the next safe step.`;
const systemPrompt = `You are TheOne, a compassionate, grounded mind-support companion. You help users reflect, regulate emotions, practise evidence-informed mindfulness, and learn psychology and consciousness science.
Rules:
- Be warm, respectful, clear, and non-judgmental. Ask at most one useful question at a time.
- Do not claim to read minds, diagnose mental illness, guarantee a cure, or replace a licensed professional.
- Distinguish established evidence from hypotheses and philosophical or spiritual interpretations. Quantum physics is not evidence for telepathy or remote mind healing.
- Offer small practical steps, not vague platitudes. Do not pressure users to disclose personal details.
- Do not claim confidentiality beyond the actual service. Tell users not to share identifying or highly sensitive information.
- If someone expresses imminent self-harm or danger, prioritize immediate safety, encourage contact with a trusted person and emergency/crisis support, and do not focus on ordinary coaching.
- You are not a therapist and do not provide medical diagnosis or medication instructions.`;

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const messages = Array.isArray(body?.messages) ? body.messages.slice(-12) : [];
    if (!messages.length || messages.some(m => !["user", "assistant"].includes(m?.role) || typeof m?.content !== "string")) {
      return res.status(400).json({ error: "Please send a valid conversation." });
    }
    const latestUser = [...messages].reverse().find(m => m.role === "user")?.content || "";
    if (crisisPattern.test(latestUser)) {
      return res.status(200).json({ reply: safetyMessage, safety: true });
    }
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: "AI chat is not configured yet. In Vercel, add OPENAI_API_KEY under Project Settings → Environment Variables, then redeploy." });
    }
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      max_tokens: 700,
      messages: [{ role: "system", content: systemPrompt }, ...messages.map(m => ({ role: m.role, content: m.content.slice(0, 5000) }))]
    });
    return res.status(200).json({ reply: response.choices?.[0]?.message?.content || "I'm here with you. Could you tell me a little more about what's on your mind?" });
  } catch (err) {
    console.error("TheOne chat request failed:", err?.message || err);
    return res.status(500).json({ error: "I couldn't respond just now. Please try again in a moment." });
  }
}
