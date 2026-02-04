import { Scenario } from '@/types/conversation';

export const cafeScenario: Scenario = {
  id: 'cafe-001',
  title: 'カフェで注文',
  roleLabels: {
    roleA: 'お客さん',
    roleB: '店員さん'
  },
  // どちらの役割を選んでも、まずは最初の挨拶(start)から始まります
  initialNodeId: {
    roleA: 'start',
    roleB: 'start'
  },
  nodes: [
    {
      id: 'start',
      turn: 1,
      speaker: 'roleA', // お客さん(roleA)からスタート
      textEN: 'Hi, can I have a coffee, please?',
      textJP: 'こんにちは、コーヒーを一つついただけますか？',
      choices: [
        { id: 'c-start', textEN: 'Hi, can I have a coffee, please?', textJP: '挨拶して注文する', nextNodeId: 'pc-1' }
      ]
    },
    {
      id: 'pc-1',
      turn: 2,
      speaker: 'roleB', // 店員さん(roleB)のターン
      textEN: 'Sure. What size would you like?',
      textJP: 'もちろんです。サイズはどうなさいますか？',
      choices: [
        // ここで分岐！ユーザーが選ぶ選択肢を定義します
        { id: 'c-hot', textEN: 'Large hot coffee, please.', textJP: 'ホットのLサイズで', nextNodeId: 'user-2-hot' },
        { id: 'c-ice', textEN: 'Medium iced coffee, please.', textJP: 'アイスのMサイズで', nextNodeId: 'user-2-ice' }
      ]
    },
    {
      id: 'user-2-hot',
      turn: 3,
      speaker: 'roleA',
      textEN: 'Large hot coffee, please.',
      textJP: 'ホットのLサイズをお願いします。',
      choices: [
        { id: 'c-h2', textEN: 'Large hot coffee, please.', textJP: 'サイズを伝える', nextNodeId: 'pc-2' }
      ]
    },
    {
      id: 'user-2-ice',
      turn: 3,
      speaker: 'roleA',
      textEN: 'Medium iced coffee, please.',
      textJP: 'アイスのMサイズをお願いします。',
      choices: [
        { id: 'c-i2', textEN: 'Medium iced coffee, please.', textJP: 'サイズを伝える', nextNodeId: 'pc-2' }
      ]
    },
    {
      id: 'pc-2',
      turn: 4,
      speaker: 'roleB',
      textEN: 'Got it. That will be 400 yen.',
      textJP: 'かしこまりました。400円になります。',
      choices: [
        { id: 'c-pay', textEN: 'Here you go. Thank you!', textJP: '支払ってお礼を言う', nextNodeId: 'end' }
      ]
    },
    {
      id: 'end',
      turn: 5,
      speaker: 'roleA',
      textEN: 'Here you go. Thank you!',
      textJP: 'はい、どうぞ。ありがとうございます！',
      isEnd: true,
      choices: [] // 最後は空にする
    }
  ]
};