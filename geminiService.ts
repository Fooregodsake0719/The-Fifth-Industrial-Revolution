
// Service disabled per request - functionality moved to pure text logs
export interface VoiceControl {
  analyser: AnalyserNode;
  stop: () => void;
}

export const speak = async () => {
  console.warn("TTS is disabled by project configuration.");
  return null;
};
