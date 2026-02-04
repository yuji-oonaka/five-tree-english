"use client";

import { useState } from "react";
import { ConversationNode } from "@/types/conversation";
import { playEnglishText } from "@/utils/speech";
import Avatar from "@/components/Avatar";

interface Props {
  history: ConversationNode[];
  currentNode: ConversationNode;
  onReset: () => void;
}

export default function ConversationReflection({
  history,
  currentNode,
  onReset,
}: Props) {
  const [showSubtitles, setShowSubtitles] = useState(true);

  // 履歴と最後のノードを結合して表示用リストを作成
  const allNodes = [...history, currentNode];

  return (
    <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-slate-800">Review</h2>
        <button
          onClick={() => setShowSubtitles(!showSubtitles)}
          className={`px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${
            showSubtitles
              ? "bg-blue-500 text-white"
              : "bg-slate-200 text-slate-500"
          }`}
        >
          字幕: {showSubtitles ? "ON" : "OFF"}
        </button>
      </div>

      <div className="space-y-6 mb-8">
        {allNodes.map((node) => (
          <div
            key={node.id}
            className={`flex items-end gap-2 ${node.speaker === "user" ? "flex-row-reverse" : "flex-row"}`}
          >
            <Avatar speaker={node.speaker} className="w-10 h-10 shrink-0" />

            <div
              onClick={() => playEnglishText(node.textEN, node.speaker)}
              className={`max-w-[75%] p-4 rounded-2xl cursor-pointer hover:opacity-80 transition-opacity ${
                node.speaker === "user"
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-white border-2 border-slate-200 text-slate-800 rounded-tl-none"
              }`}
            >
              <p className="font-bold leading-tight">{node.textEN}</p>
              {showSubtitles && (
                <p
                  className={`text-xs mt-2 ${node.speaker === "user" ? "text-blue-100" : "text-slate-500"}`}
                >
                  {node.textJP}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onReset}
        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg shadow-lg hover:bg-slate-800 active:scale-[0.98] transition-all"
      >
        もう一度練習する
      </button>
    </div>
  );
}
