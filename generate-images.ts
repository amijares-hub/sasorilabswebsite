import { GoogleGenAI } from "@google/genai";
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey) {
    console.error("No API key found. Please add GEMINI_API_KEY to your Secrets in AI Studio Settings (gear icon).");
    return;
  }
  const ai = new GoogleGenAI({ apiKey });
  
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  console.log("Generating main hero image (Scorpion-inspired)...");
  const response = await ai.models.generateContent({
    model: 'gemini-3.1-flash-image-preview',
    contents: {
      parts: [
        {
          text: "A premium, cinematic 3D render of a futuristic dark corridor. The architecture is inspired by a scorpion's exoskeleton, with segmented dark metallic plates. The floor has glowing red neon light strips. In the far distance, a large, brightly glowing white and red logo shaped like '{S}' is the focal point. Atmospheric fog and volumetric red lighting. High-end tech aesthetic, 16:9 aspect ratio, 4k resolution style.",
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

  let imageData = '';
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageData = part.inlineData.data;
      }
    }
  }

  if (imageData) {
    const buffer = Buffer.from(imageData, 'base64');
    fs.writeFileSync(path.join(publicDir, 'hero-image.png'), buffer);
    console.log("Main image generated: public/hero-image.png");
  }

  console.log("Generating depth map...");
  const depthResponse = await ai.models.generateContent({
    model: 'gemini-3.1-flash-image-preview',
    contents: {
      parts: [
        {
          text: "A high-quality grayscale depth map of the same futuristic corridor. Closer objects are bright white, receding into pure black in the distance. Smooth gradients for 3D displacement. 16:9 aspect ratio.",
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

  let depthData = '';
  if (depthResponse.candidates?.[0]?.content?.parts) {
    for (const part of depthResponse.candidates[0].content.parts) {
      if (part.inlineData) {
        depthData = part.inlineData.data;
      }
    }
  }

  if (depthData) {
    const buffer = Buffer.from(depthData, 'base64');
    fs.writeFileSync(path.join(publicDir, 'hero-depth.png'), buffer);
    console.log("Depth map generated: public/hero-depth.png");
  }
}

main().catch(console.error);
