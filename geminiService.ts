
import { GoogleGenAI, Modality } from "@google/genai";

export interface VoiceControl {
  analyser: AnalyserNode;
  stop: () => void;
}

export async function speak(text: string, audioContext: AudioContext): Promise<VoiceControl> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `INSTRUCTION: Speak the following technical data in an extremely robotic, cold, monotone, mechanical, and industrial voice. Zero emotion. Precise enunciation. Strict data transmission tone: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            // Using Fenrir for a potentially deeper, more mechanical tone
            prebuiltVoiceConfig: { voiceName: 'Fenrir' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) throw new Error("No audio data received");

    const audioData = decode(base64Audio);
    const audioBuffer = await decodeAudioData(audioData, audioContext, 24000, 1);
    
    const source = audioContext.createBufferSource();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    
    source.buffer = audioBuffer;
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    
    source.start();
    
    return {
      analyser,
      stop: () => {
        try {
          source.stop();
        } catch (e) {
          // Ignore if already stopped
        }
      }
    };
  } catch (error) {
    console.error("TTS Error:", error);
    throw error;
  }
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
