"use client";

import { motion } from "framer-motion";
import { Choice } from "@/types/conversation";

interface Props {
  mode: "learning" | "practice";
  isPcTurn: boolean;
  choices: Choice[];
  isListening: boolean;
  hasSpoken: boolean;
  onSelect: (id: string) => void;
  onStart: () => void;
  onStop: () => void;
  isEnd: boolean;
  onFinish: () => void;
}

export default function ActionControl({
  mode,
  isPcTurn,
  choices,
  isListening,
  hasSpoken,
  onSelect,
  onStart,
  onStop,
  isEnd,
  onFinish,
}: Props) {
  const isPractice = mode === "practice";

  // 終了ボタンが出る条件：
  // Step 1ならisEndで即表示。Step 2ならisEndかつ「PCターン」または「自分が一度喋った(hasSpoken)」ときのみ。
  const canShowFinish = isEnd && (!isPractice || isPcTurn || hasSpoken);

  if (canShowFinish && !isListening) {
    return (
      <button
        onClick={onFinish}
        className="w-full mt-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-xl shadow-xl animate-in fade-in zoom-in duration-300"
      >
        {mode === "learning"
          ? "今の流れで練習する！ →"
          : "できた！ふりかえる →"}
      </button>
    );
  }

  return (
    <div className="mt-10 min-h-48 flex flex-col items-center justify-center">
      {mode === "learning" ? (
        /* Step 1: ルート選択 */
        <div className="w-full space-y-3">
          {choices.map((choice: Choice) => (
            <button
              key={choice.id}
              onClick={() => onSelect(choice.nextNodeId)}
              className="w-full py-4 px-6 text-left bg-white border-2 border-slate-200 hover:border-blue-500 rounded-2xl transition-all shadow-sm"
            >
              <span className="font-bold text-slate-700">{choice.textJP}</span>
            </button>
          ))}
        </div>
      ) : isPcTurn ? (
        /* Step 2: 相手のターン */
        <div className="text-center space-y-4 animate-pulse">
          <div className="flex justify-center">
            <span className="h-3 w-3 rounded-full bg-green-500"></span>
          </div>
          <p className="text-slate-400 font-bold text-sm tracking-tight">
            相手が話しています...
          </p>
        </div>
      ) : (
        /* Step 2: 自分の練習ターン（5ターン目でも喋るまでマイクを出す） */
        <div className="flex flex-col items-center gap-6 w-full">
          <p className="text-blue-600 font-black text-xs uppercase tracking-widest animate-pulse">
            ★ さっき選んだフレーズをしゃべろう！
          </p>
          <button
            onMouseDown={onStart}
            onMouseUp={onStop}
            onTouchStart={onStart}
            onTouchEnd={onStop}
            className={`w-28 h-28 rounded-full flex items-center justify-center transition-all shadow-xl ${
              isListening
                ? "bg-red-500 scale-110 ring-8 ring-red-100"
                : "bg-blue-600 shadow-blue-200"
            }`}
          >
            <span className="text-5xl text-white">
              {isListening ? "🎙️" : "🎤"}
            </span>
          </button>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
            Hold to speak
          </p>
        </div>
      )}
    </div>
  );
}
