import { useState, useCallback, useMemo } from 'react';
import { Scenario, ConversationNode, UserRoleType } from '@/types/conversation';

export const useConversation = (scenario: Scenario, userRole: UserRoleType) => {
  // 現在のノードIDを管理（初期値は選んだ役割のスタート地点）
  const [currentNodeId, setCurrentNodeId] = useState(scenario.initialNodeId[userRole]);
  const [history, setHistory] = useState<ConversationNode[]>([]);

  // 現在のノードオブジェクトを取得
  const currentNode = useMemo(() => {
    return scenario.nodes.find(node => node.id === currentNodeId)!;
  }, [scenario.nodes, currentNodeId]);

  // 現在の選択肢を取得
  const choices = currentNode.choices;

  // 次のステップへ進む関数（idにstring型を明示）
  const selectChoice = useCallback((nextNodeId: string) => {
    setHistory(prev => [...prev, currentNode]);
    setCurrentNodeId(nextNodeId);
  }, [currentNode]);

  // 最初からやり直す
  const reset = useCallback(() => {
    setCurrentNodeId(scenario.initialNodeId[userRole]);
    setHistory([]);
  }, [scenario, userRole]);

  return {
    currentNode,
    choices,
    selectChoice,
    history,
    isEnd: currentNode.isEnd || false,
    reset
  };
};