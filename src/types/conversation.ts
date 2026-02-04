// 役割の定義
export type UserRoleType = 'roleA' | 'roleB';

// 選択肢の定義（エラーの原因：これが漏れていました）
export interface Choice {
  id: string;
  textEN: string;
  textJP: string;
  nextNodeId: string; // 次に進む先のノードID
}

// 会話の1ステップの定義
export interface ConversationNode {
  id: string;
  turn: number;
  speaker: UserRoleType;
  textEN: string;
  textJP: string;
  choices: Choice[];
  isEnd?: boolean;
}

// シナリオ全体の定義
export interface Scenario {
  id: string;
  title: string;
  roleLabels: {
    roleA: string;
    roleB: string;
  };
  // 役割によってスタート地点を変える場合に対応
  initialNodeId: Record<UserRoleType, string>;
  nodes: ConversationNode[];
}