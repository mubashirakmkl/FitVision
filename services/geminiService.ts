import { GoogleGenAI } from "@google/genai";
import { UserProfile } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const stripBase64Prefix = (base64: string): string => {
  return base64.replace(/^data:image\/[a-z]+;base64,/, "");
};

const getMimeTypeFromBase64 = (base64: string): string => {
  const match = base64.match(/^data:(image\/[a-z]+);base64,/);
  return match ? match[1] : 'image/jpeg';
};

export const generateBetterVersion = async (profile: UserProfile): Promise<string> => {
  if (!profile.photo) throw new Error("No photo provided");

  const weightLoss = profile.currentWeightKg - profile.targetWeightKg;
  const percentageLoss = ((weightLoss / profile.currentWeightKg) * 100).toFixed(0);
  
  // Construct a prompt focused on extreme realism and significant physical transformation
  const prompt = `
    Edit the attached photo to simulate a TRANSFORMATIONAL weight loss of ${weightLoss}kg for the person depicted.
    
    Current Stats: ${profile.currentWeightKg}kg.
    Target Stats: ${profile.targetWeightKg}kg.
    This is a ${percentageLoss}% reduction in total body mass.
    Subject: ${profile.age} year old ${profile.gender}, ${profile.heightCm}cm.

    VISUALIZATION REQUIREMENT: The visual difference must be SUBSTANTIAL and IMMEDIATELY OBVIOUS. The subject should look drastically lighter.

    1. **Body Physics**: 
       - Drastically reduce the width of the waist, hips, and torso.
       - Make arms and legs significantly thinner.
       - The silhouette must be much narrower to reflect a ${profile.targetWeightKg}kg physique.
    
    2. **Face Structure**: 
       - Make the face significantly narrower.
       - Remove puffiness from cheeks completely.
       - Define the jawline sharply.
       - Remove any double chin or neck fat to show a lean neck.

    3. **Clothing Physics**: 
       - Adjust clothing to fit the new smaller frame naturally.
       - If the original clothes were tight, they should look looser or drape differently on the thinner body.

    4. **Critical Realism Constraints**:
       - **Lighting & Color**: Keep the EXACT same lighting conditions, shadows, and color grading as the original.
       - **Texture**: Do NOT smooth the skin. Keep pores, texture, and natural imperfections.
       - **Identity**: It must look like the SAME person, just significantly fitter.

    Output ONLY the modified image.
  `;

  const base64Data = stripBase64Prefix(profile.photo);
  const mimeType = getMimeTypeFromBase64(profile.photo);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Nano Banana
      contents: {
        parts: [
          {
            text: prompt
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data
            }
          }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1", 
        }
      }
    });

    // Extract image from response
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image generated in the response.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};