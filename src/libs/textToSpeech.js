export const textToSpeech = (text, options = {}) => {
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

  const voices = window.speechSynthesis.getVoices();
  let selectedVoice = null;

  selectedVoice = voices.find((voice) => voice.name.includes("Zira"));

  if (!selectedVoice) {
    console.warn("Zira voice not found, falling back to default en-US voice.");
    selectedVoice = voices.find((voice) => voice.lang === "en-US") || voices[0];
  }

  utterance.voice = selectedVoice;

  if (voices.length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      const updatedVoices = window.speechSynthesis.getVoices();
      let voice = updatedVoices.find((v) => v.name.includes("Zira"));
      if (!voice) {
        voice = updatedVoices.find((v) => v.lang === "en-US") || updatedVoices[0];
      }
      utterance.voice = voice;
      window.speechSynthesis.speak(utterance);
    };
  } else {
    window.speechSynthesis.speak(utterance);
  }

  return utterance;
};

export const stopSpeech = () => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
};

  