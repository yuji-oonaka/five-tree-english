export const playEnglishText = (text: string, speaker: 'user' | 'pc') => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';
  
  // 速度は標準に近い 0.9 に戻し、一音一音を丁寧に発音させます
  utterance.rate = 0.9;

  const voices = window.speechSynthesis.getVoices();
  
  const selectNaturalVoice = (isUser: boolean) => {
    const enVoices = voices.filter(v => v.lang.startsWith('en'));
    
    if (isUser) {
      // ユーザー（女性）：癖の少ないモダンな音声を優先
      return enVoices.find(v => v.name.includes('Google US English')) // 最も標準的
             || enVoices.find(v => v.name.includes('Natural'))        // 最新の自然な音声
             || enVoices.find(v => v.name.includes('Samantha'))       // iOSの標準
             || enVoices[0];
    } else {
      // 店員（男性）：落ち着いた標準的な音声を優先
      return enVoices.find(v => v.name.includes('Google') && v.name.includes('Male'))
             || enVoices.find(v => v.name.includes('Microsoft David'))
             || enVoices.find(v => v.name.includes('Daniel'))
             || enVoices[1] || enVoices[0];
    }
  };

  const voice = selectNaturalVoice(speaker === 'user');
  if (voice) {
    utterance.voice = voice;
  }

  // ピッチを 1.1（自然な明るさ）に微調整。1.3まで上げると発音が歪むため
  utterance.pitch = speaker === 'user' ? 1.1 : 1.0;

  window.speechSynthesis.speak(utterance);
};