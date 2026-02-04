"use client";

import { useConversation } from "@/hooks/useConversation";
import { cafeScenario } from "@/data/scenarios/cafe";

export default function PlayPage() {
  const { currentNode, choices, selectChoice, isEnd, reset } =
    useConversation(cafeScenario);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden p-8">
        {/* ヘッダー・進捗 */}
        <div className="text-sm text-slate-400 mb-4 text-center">
          Turn: {currentNode.turn} / 5
        </div>

        {/* メイン会話エリア */}
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
