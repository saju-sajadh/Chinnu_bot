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

  // Function to get voices, waiting for onvoiceschanged if necessary
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

  // Retry fetching voices with a timeout
  const maxRetries = 5;
  let retries = 0;
  let voices = [];
  while (retries < maxRetries && voices.length === 0) {
    voices = await getVoices();
    if (voices.length === 0) {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Wait 500ms
      retries++;
    }
  }

  if (voices.length === 0) {
    console.error("No voices available after retries.");
    return null;
  }

  console.log("Available voices:", voices.map((v) => v.name));


  const femaleVoiceNames = [
    "Zira",
    "Aria",
    "Jenny",
    "Samantha",
    "Susan",
    "Hazel",
    "Cortana",
    "Michelle",
    "Emily",
    "Mary",
    "Linda",
  ];

  // Find Zira voice
  let selectedVoice = voices.find(
    (voice) => voice.name === "Microsoft Zira - English (United States)"
  );

  // Fall back to any female-named voice (prioritizing en-US)
  if (!selectedVoice) {
    selectedVoice = voices.find(
      (voice) =>
        femaleVoiceNames.some((name) => voice.name.includes(name)) &&
        voice.lang === "en-US"
    );
  }

  // Fall back to any female-named voice (any language)
  if (!selectedVoice) {
    selectedVoice = voices.find((voice) =>
      femaleVoiceNames.some((name) => voice.name.includes(name))
    );
  }

  // Fall back to any en-US voice
  if (!selectedVoice) {
    selectedVoice = voices.find((voice) => voice.lang === "en-US");
  }

  // Fall back to any voice
  if (!selectedVoice) {
    selectedVoice = voices[0];
  }

  if (!selectedVoice) {
    console.error("No suitable voice found.");
    return null;
  }

  console.log("Selected voice:", selectedVoice.name);

  utterance.voice = selectedVoice;

  try {
    window.speechSynthesis.speak(utterance);
  } catch (error) {
    console.error("Error initiating speech:", error);
    return null;
  }

  return utterance;
};

export const stopSpeech = () => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
};