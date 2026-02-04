"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Avatar from "@/components/Avatar";
import { playEnglishText } from "@/utils/speech";
import { ConversationNode, UserRoleType } from "@/types/conversation";

interface Props {
  node: ConversationNode;
  mode: "learning" | "practice";
  userRole: UserRoleType;
}

export default function ConversationDisplay({ node, mode, userRole }: Props) {
  const isMyTurn = node.speaker === userRole;
  const isPractice = mode === "practice";
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    setShowAnswer(false);
    if (isPractice && isMyTurn) {
      // 5秒間想起させる時間を設ける
      const timer = setTimeout(() => setShowAnswer(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [node.id, isPractice, isMyTurn]);

  return (
    <div className="min-h-64 flex flex-col items-center justify-center text-center space-y-6">
      <Avatar
        speaker={node.speaker}
        className="w-24 h-24 shadow-xl border-4 border-white"
      />

      <div
        className={`text-xs font-bold px-4 py-1 rounded-full tracking-widest ${
          isMyTurn ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
        }`}
      >
        {isMyTurn ? "YOUR TURN" : "PARTNER"}
      </div>

      <div className="space-y-4">
        {isPractice && isMyTurn && !showAnswer ? (
          <div className="h-16 flex items-center justify-center">
            <span className="text-4xl font-black text-slate-200 animate-pulse tracking-widest">
              ??????
            </span>
          </div>
        ) : (
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-3xl font-black leading-tight ${isPractice && isMyTurn ? "text-blue-600" : "text-slate-800"}`}
          >
            {node.textEN}
          </motion.h2>
        )}
        <p className="text-slate-500 italic text-sm font-medium">
          「{node.textJP}」
        </p>
      </div>

      {(!isPractice || !isMyTurn || showAnswer) && (
        <button
          onClick={() => playEnglishText(node.textEN, node.speaker)}
          className="p-4 rounded-full bg-slate-50 hover:bg-blue-50 transition-colors"
        >
          <span className="text-2xl">🔊</span>
        </button>
      )}
    </div>
  );
}
