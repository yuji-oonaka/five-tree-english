export const playEnglishText = (text: string, speaker: 'roleA' | 'roleB') => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  utterance.rate = 0.9;

  const voices = window.speechSynthesis.getVoices();
  
  // roleA (客) = 女性優先
  // roleB (店員) = 男性優先
  const voice = (speaker === 'roleA') 
    ? voices.find(v => v.lang.includes('en') && (v.name.includes('Samantha') || v.name.includes('Female') || v.name.includes('Google US English')))
    : voices.find(v => v.lang.includes('en') && (v.name.includes('Daniel') || v.name.includes('Male') || v.name.includes('David')));

  if (voice) utterance.voice = voice;
  utterance.pitch = (speaker === 'roleA') ? 1.2 : 0.9;

  window.speechSynthesis.speak(utterance);
};