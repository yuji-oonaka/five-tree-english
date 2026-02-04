"use client";

import { useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useConversation } from "@/hooks/useConversation";
import { getScenarioById } from "@/data/scenarios";
import { playEnglishText } from "@/utils/speech";

export default function PlayPage() {
  const searchParams = useSearchParams();
  const scenarioId = searchParams.get("id");

  // シナリオをIDから取得
  const scenario = useMemo(
    () => getScenarioById(scenarioId || "cafe-001"),
    [scenarioId],
  );

  // scenario が undefined の場合のガード（安全策）
  if (!scenario) return <div>Scenario not found.</div>;

  // hooksの呼び出し（前回と同じ）
  const { currentNode, choices, selectChoice, isEnd, reset } =
    useConversation(scenario);

  // ノードが変わるたびに音声を再生
  useEffect(() => {
    if (currentNode && !isEnd) {
      playEnglishText(currentNode.textEN);
    }
  }, [currentNode, isEnd]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden p-8">
        {/* ヘッダー・進捗  */}
        <div className="text-sm text-slate-400 mb-4 text-center">
          Turn: {currentNode.turn} / 5
        </div>
        {/* メイン会話エリア  */}
        <div className="min-h-50 flex flex-col items-center justify-center text-center space-y-4">
          <div
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              currentNode.speaker === "user"
                ? "bg-blue-100 text-blue-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {currentNode.speaker.toUpperCase()}
          </div>
          <h2 className="text-3xl font-bold text-slate-800 leading-tight">
            {currentNode.textEN}
          </h2>
          {/* 再生ボタン（ここを修正しました） */}
          <button
            onClick={() => playEnglishText(currentNode.textEN)}
            className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
            title="Listen again"
          >
            <span className="text-xl">🔊</span>
          </button>
          <p className="text-slate-500 italic">「{currentNode.textJP}」</p>
        </div>
        {/* 選択肢・操作エリア */}
        <div className="mt-12 space-y-3">
          {!isEnd ? (
            choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => selectChoice(choice.id)}
                className="w-full py-4 px-6 text-left bg-white border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 rounded-2xl transition-all duration-200 group"
              >
                <span className="text-slate-400 group-hover:text-blue-500 mr-2">
                  👉
                </span>
                <span className="font-medium text-slate-700">
                  {choice.textJP}
                </span>
              </button>
            ))
          ) : (
            <div className="text-center space-y-4">
              <p className="text-xl font-bold text-green-600">Great Job! 🎉</p>
              <button
                onClick={reset}
                className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-700 transition-colors"
              >
                もう一度練習する
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
