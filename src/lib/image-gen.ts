import { GoogleGenAI } from "@google/genai";

async function generateHeroImage() {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-image-preview',
    contents: {
      parts: [
        {
          text: "A futuristic dark corridor with a hexagonal metallic floor. Red glowing neon lines are between the hexagons. In the far background, there is a large glowing white and red logo shaped like an 'S' inside brackets {S}. The atmosphere is smoky and cinematic with soft red lighting. 16:9 aspect ratio. High quality, detailed textures.",
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
        imageSize: "1K"
      },
    },
  });

  let imageUrl = '';
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      imageUrl = `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  // Generate a depth map version
  const depthResponse = await ai.models.generateContent({
    model: 'gemini-3.1-flash-image-preview',
    contents: {
      parts: [
        {
          text: "A grayscale depth map of a futuristic dark corridor with a hexagonal metallic floor. Closer objects are lighter, farther objects are darker. The floor hexagons should have clear depth gradients. 16:9 aspect ratio.",
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "16:9",
        imageSize: "1K"
      },
    },
  });

  let depthUrl = '';
  for (const part of depthResponse.candidates[0].content.parts) {
    if (part.inlineData) {
      depthUrl = `data:image/png;base64,${part.inlineData.data}`;
    }
  }

  return { imageUrl, depthUrl };
}
