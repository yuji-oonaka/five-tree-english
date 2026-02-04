"use client";

import { useEffect, useMemo, Suspense, useState } from "react"; // useStateを追加
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useConversation } from "@/hooks/useConversation";
import { getScenarioById } from "@/data/scenarios";
import { playEnglishText } from "@/utils/speech";
import ConversationReflection from "@/components/ConversationReflection";
import Avatar from "@/components/Avatar";

function PlayContent() {
  const searchParams = useSearchParams();
  const scenarioId = searchParams.get("id");
  const scenario = useMemo(
    () => getScenarioById(scenarioId || "cafe-001"),
    [scenarioId],
  );

  // ふりかえり画面を表示するかどうかのローカル状態を追加
  const [showReview, setShowReview] = useState(false);

  const { currentNode, choices, selectChoice, history, isEnd, reset } =
    useConversation(scenario!);

  useEffect(() => {
    // ふりかえり画面が表示されていない時だけ再生
    if (currentNode && !showReview) {
      const timer = setTimeout(() => {
        playEnglishText(currentNode.textEN, currentNode.speaker);
      }, 300); // アニメーションとの競合を防ぐための微細なディレイ

      return () => clearTimeout(timer);
    }
    // ここに並べる変数の「数」と「順番」を常に一定に保つのがReactの掟です
  }, [currentNode.id, showReview]);

  // リセット時にローカル状態も戻す
  const handleReset = () => {
    setShowReview(false);
    reset();
  };

  if (!scenario)
    return <div className="p-10 text-center">Scenario not found.</div>;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50 overflow-hidden">
      <AnimatePresence mode="wait">
        {!showReview ? ( // isEnd ではなく showReview で切り替える
          <motion.div
            key={currentNode.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden p-8"
          >
            <div className="text-sm text-slate-400 mb-6 text-center font-medium">
              Turn: {currentNode.turn} / 5
            </div>

            <div className="min-h-64 flex flex-col items-center justify-center text-center space-y-6">
              <Avatar
                speaker={currentNode.speaker}
                className="w-16 h-16 mb-2 border-2 border-white ring-4 ring-slate-50"
              />

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
                onClick={() =>
                  playEnglishText(currentNode.textEN, currentNode.speaker)
                }
                className="group p-4 rounded-full bg-slate-100 hover:bg-blue-100 transition-colors active:scale-90"
              >
                <span className="text-2xl group-hover:scale-110 block transition-transform">
                  🔊
                </span>
              </button>

              <p className="text-slate-500 italic text-sm">
                「{currentNode.textJP}」
              </p>
            </div>

            {/* 選択肢エリアの制御 */}
            <div className="mt-10 space-y-3">
              {!isEnd ? (
                // 通常ターン：選択肢を表示
                choices.map((choice, index) => (
                  <motion.button
                    key={choice.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    onClick={() => selectChoice(choice.id)}
                    className="w-full py-4 px-6 text-left bg-white border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50 rounded-2xl transition-all group flex items-center shadow-sm"
                  >
                    <span className="text-slate-300 group-hover:text-blue-500 mr-3 text-xl">
                      ●
                    </span>
                    <span className="font-bold text-slate-700">
                      {choice.textJP}
                    </span>
                  </motion.button>
                ))
              ) : (
                // 5ターン目（完結）：ふりかえり画面へ進むボタンを表示
                <motion.button
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={() => setShowReview(true)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-lg hover:bg-slate-800 active:scale-95 transition-all"
                >
                  会話をふりかえる →
                </motion.button>
              )}
            </div>
          </motion.div>
        ) : (
          /* --- 2. 会話終了後のふりかえり画面 --- */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md"
          >
            <ConversationReflection
              history={history}
              currentNode={currentNode}
              onReset={handleReset} // 修正したリセット関数を渡す
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

export default function PlayPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <PlayContent />
    </Suspense>
  );
}
