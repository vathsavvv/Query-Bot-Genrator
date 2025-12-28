
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, BotConfig, Document } from '../types';

export const queryBot = async (
  config: BotConfig,
  history: Message[],
  knowledgeBase: Document[],
  userInput: string
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Only use documents that are ACTIVE
  const activeKnowledge = knowledgeBase.filter(doc => doc.status === 'ACTIVE');
  
  const knowledgeContext = activeKnowledge
    .map(doc => `--- SOURCE_ID: ${doc.id} | FILENAME: ${doc.name} ---\n${doc.content}`)
    .join('\n\n');

  const systemInstruction = `
    DESIGNATION: ${config.name}
    PROTOCOL: KNOWLEDGE_RETRIEVAL_AGENT
    ORGANIZATION: ${config.companyName}
    INDUSTRY: ${config.industry}

    CORE DIRECTIVES:
    1. Answer strictly using the provided KNOWLEDGE BASE.
    2. ALWAYS cite the source filename at the end of your response if information from a document was used (e.g., "[Source: policy_v2.pdf]").
    3. If multiple documents were used, list them clearly.
    4. If the information is not present in the KNOWLEDGE BASE, respond with: "INSUFFICIENT_DATA: The requested information is not available in the current knowledge core."
    5. Maintain the following tone: ${config.customInstructions}

    KNOWLEDGE BASE INGESTION:
    ${knowledgeContext || "NO_DATA_INGESTED: Knowledge core is currently empty."}
  `;

  const contents = [
    ...history.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    })),
    {
      role: 'user',
      parts: [{ text: userInput }]
    }
  ];

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents as any,
      config: {
        systemInstruction,
        temperature: 0.1, // Lower temperature for maximum precision/faithfulness to docs
      },
    });

    return response.text || "SYSTEM_ERROR: NULL_RESPONSE_RETURNED";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "SYSTEM_CRITICAL: Unable to access neural engine. Potential API throttling or network instability.";
  }
};
