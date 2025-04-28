export const textToSpeech = async (text, options = {}) => {
  if (!("speechSynthesis" in window)) {
    console.error("Text-to-speech is not supported in this browser.");
    return null;
  }
  if (!text || typeof text !== "string") {
    console.error("Invalid text input for text-to-speech.");
    return null;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);

  utterance.lang = options.lang || "en-US";
  utterance.pitch = options.pitch || 1.5;
  utterance.rate = options.rate || 1.2;
  utterance.volume = options.volume || 1;

  const getVoices = () =>
    new Promise((resolve) => {
      let voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        resolve(voices);
        return;
      }
      window.speechSynthesis.onvoiceschanged = () => {
        voices = window.speechSynthesis.getVoices();
        resolve(voices);
      };
    });


  const voices = await getVoices();

  const ziraVoice = voices.find(
    (voice) => voice.name === "Microsoft Zira - English (United States)"
  );

  if (!ziraVoice) {
    console.error("Microsoft Zira voice not found.");
    return null;
  }

  utterance.voice = ziraVoice;
  window.speechSynthesis.speak(utterance);

  return utterance;
};

export const stopSpeech = () => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
};