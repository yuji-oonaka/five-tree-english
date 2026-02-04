export type Speaker = 'user' | 'pc';

export interface ConversationNode {
  id: string;               // ノード識別子 
  textJP: string;           // 日本語の選択肢 
  textEN: string;           // 英語の音声・テキスト 
  speaker: Speaker;         // 発話者 
  nextIds: string[];        // 分岐先のIDリスト（最大3つ程度） 
  turn: number;             // 1〜5ターンのカウント 
  isEnd?: boolean;          // 5ターン完結フラグ 
}

export interface Scenario {
  id: string;
  title: string;            // シチュエーション名 
  nodes: Record<string, ConversationNode>;
}