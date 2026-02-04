import { Scenario } from '@/types/conversation';

export const cafeScenario: Scenario = {
  id: 'cafe-001',
  title: 'カフェでコーヒーを頼む',
  nodes: {
    'start': {
      id: 'start',
      textJP: '店員さんに挨拶して注文する',
      textEN: 'Hi, can I have a coffee, please?',
      speaker: 'user',
      nextIds: ['pc-1'],
      turn: 1
    },
    'pc-1': {
      id: 'pc-1',
      textJP: '店員：もちろんです。サイズはどうしますか？',
      textEN: 'Sure. What size would you like?',
      speaker: 'pc',
      nextIds: ['user-2-hot', 'user-2-ice'], // ここで分岐
      turn: 2
    },
    'user-2-hot': {
      id: 'user-2-hot',
      textJP: 'ホットのLサイズで',
      textEN: 'Large hot coffee, please.',
      speaker: 'user',
      nextIds: ['pc-2'],
      turn: 3
    },
    'user-2-ice': {
      id: 'user-2-ice',
      textJP: 'アイスのMサイズで',
      textEN: 'Medium iced coffee, please.',
      speaker: 'user',
      nextIds: ['pc-2'],
      turn: 3
    },
    'pc-2': {
      id: 'pc-2',
      textJP: '店員：了解しました。400円になります。',
      textEN: 'Got it. That will be 400 yen.',
      speaker: 'pc',
      nextIds: ['end'],
      turn: 4
    },
    'end': {
      id: 'end',
      textJP: 'お金を払ってお礼を言う',
      textEN: 'Here you go. Thank you!',
      speaker: 'user',
      nextIds: [],
      turn: 5,
      isEnd: true
    }
  }
};