import { useState, useCallback, useMemo } from 'react';
import { ConversationNode, Scenario } from '@/types/conversation';

export const useConversation = (scenario: Scenario) => {
  // 現在どのノードにいるかを管理
  const [currentNodeId, setCurrentNodeId] = useState<string>('start');
  // 振り返り用に、これまでの会話履歴を保存
  const [history, setHistory] = useState<ConversationNode[]>([]);

  // 現在のノードオブジェクトを取得
  const currentNode = useMemo(() => 
    scenario.nodes[currentNodeId], 
    [scenario, currentNodeId]
  );

  // 次の選択肢（ノード）のリストを取得
  const choices = useMemo(() => 
    currentNode.nextIds.map(id => scenario.nodes[id]),
    [scenario, currentNode]
  );

  // 選択肢を選んだ時の処理
  const selectChoice = useCallback((nextNodeId: string) => {
    setHistory(prev => [...prev, currentNode]);
    setCurrentNodeId(nextNodeId);
  }, [currentNode]);

  // 最初からやり直す
  const reset = useCallback(() => {
    setCurrentNodeId('start');
    setHistory([]);
  }, []);

  return {
    currentNode,
    choices,
    selectChoice,
    history,
    reset,
    isEnd: currentNode.isEnd || currentNode.turn >= 5 // 5ターン完結の保証 
  };
};