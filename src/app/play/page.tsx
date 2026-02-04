"use client";

import { useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useConversation } from "@/hooks/useConversation";
import { getScenarioById } from "@/data/scenarios";
import { playEnglishText } from "@/utils/speech";
import ConversationReflection from "@/components/ConversationReflection";

// クエリパラメータを使用するため、Next.jsのルールに従いSuspenseで囲みます
function PlayContent() {
  const searchParams = useSearchParams();
  const scenarioId = searchParams.get("id");

  const scenario = useMemo(
    () => getScenarioById(scenarioId || "cafe-001"),
    [scenarioId],
  );

  // useConversation から history を確実に受け取ります
  const { currentNode, choices, selectChoice, history, isEnd, reset } =
    useConversation(scenario!);

  useEffect(() => {
    if (currentNode && !isEnd) {
      playEnglishText(currentNode.textEN);
    }
  }, [currentNode, isEnd]);

  if (!scenario)
    return <div className="p-10 text-center">Scenario not found.</div>;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50">
      {!isEnd ? (
        /* --- 1. 会話進行中の画面 --- */
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden p-8 animate-in fade-in duration-500">
          <div className="text-sm text-slate-400 mb-6 text-center font-medium">
            Turn: {currentNode.turn} / 5
          </div>

          <div className="min-h-62.5 flex flex-col items-center justify-center text-center space-y-6">
            <div
              className={`text-xs font-bold px-4 py-1 rounded-full tracking-widest ${
                currentNode.speaker === "user"
                  ? "bg-blue-100 text-blue-600"
                  : "bg-green-100 text-green-600"
              }`}
            >
              {currentNode.speaker === "user" ? "YOU" : "SHOP KEEPER"}
            </div>

            <h2 className="text-3xl font-bold text-slate-800 leading-tight">
              {currentNode.textEN}
            </h2>

            <button
              onClick={() => playEnglishText(currentNode.textEN)}
              className="group p-4 rounded-full bg-slate-100 hover:bg-blue-100 transition-all active:scale-95"
            >
              <span className="text-2xl group-hover:scale-110 block transition-transform">
                🔊
              </span>
            </button>

            <p className="text-slate-500 italic text-sm">
              「{currentNode.textJP}」
            </p>
          </div>

          <div className="mt-10 space-y-3">
            {choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => selectChoice(choice.id)}
                className="w-full py-4 px-6 text-left bg-white border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 rounded-2xl transition-all duration-200 group flex items-center shadow-sm hover:shadow-md"
              >
                <span className="text-slate-300 group-hover:text-blue-500 mr-3 transition-colors text-xl">
                  ●
                </span>
                <span className="font-bold text-slate-700">
                  {choice.textJP}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* --- 2. 会話終了後のふりかえり画面 --- */
        <ConversationReflection
          history={history}
          currentNode={currentNode}
          onReset={reset}
        />
      )}
    </main>
  );
}

// Next.jsのApp RouterでuseSearchParamsを使うためのラップ
export default function PlayPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <PlayContent />
    </Suspense>
  );
}
