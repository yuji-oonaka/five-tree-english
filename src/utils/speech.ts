export const playEnglishText = (text: string) => {
  if (typeof window === 'undefined') return;

  // 以前の再生を停止
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US'; // 英語（米国）に設定
  utterance.rate = 0.9;     // 少しゆっくりめで聞き取りやすく

  window.speechSynthesis.speak(utterance);
};