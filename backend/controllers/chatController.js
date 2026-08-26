import Groq from "groq-sdk";
import Bus from "../models/bus.js";
import dotenv from "dotenv";
dotenv.config();

// Groq client initialized directly with your API key
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const handlePassengerChat = async (req, res) => {
    try {
        const { message } = req.body;

        // 1. Approved buses 
        const buses = await Bus.find({ isApproved: true }).select("busName departureLocation destination amount departureTime routeNo type");

        // 2. AI Prompt (System Instructions & Context)
        const systemPrompt = `You are a friendly and helpful AI assistant for "eBus Lanka", a bus booking system in Sri Lanka. 
        Here is the list of currently available approved buses in the system: ${JSON.stringify(buses)}. 
        Answer the passenger's question accurately based on this bus data. Be polite, concise, and helpful.`;

        // 3. Groq API Call (using currently supported production model)
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: message }
            ],
            model: "openai/gpt-oss-120b", // Updated active model ID
            temperature: 0.7,
        });

        const aiReply = chatCompletion.choices[0]?.message?.content || "I am sorry, I couldn't process that.";
        res.status(200).json({ reply: aiReply });

    } catch (error) {
        console.error("Groq Chatbot Error:", error);
        res.status(500).json({ message: "AI Assistant is currently unavailable." });
    }
};