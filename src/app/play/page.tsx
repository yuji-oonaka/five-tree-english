"use client";

import { useEffect, useMemo, Suspense, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useConversation } from "@/hooks/useConversation";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { getScenarioById } from "@/data/scenarios";
import { playEnglishText } from "@/utils/speech";

import PlayHeader from "@/components/play/PlayHeader";
import ConversationDisplay from "@/components/play/ConversationDisplay";
import ActionControl from "@/components/play/ActionControl";
import ConversationReflection from "@/components/ConversationReflection";
import RoleSelection from "@/components/play/RoleSelection";

type PlayStep = "role-selection" | "learning" | "practice" | "review";

function PlayContent() {
  const searchParams = useSearchParams();
  const scenario = useMemo(
    () => getScenarioById(searchParams.get("id") || "cafe-001"),
    [searchParams],
  );

  const [step, setStep] = useState<PlayStep>("role-selection");
  const [userRole, setUserRole] = useState<"roleA" | "roleB">("roleA");

  // 【核心】Step 1での選択を「現在のノードID: 次のノードID」で記録
  const [learningPath, setLearningPath] = useState<Record<string, string>>({});
  const [hasSpoken, setHasSpoken] = useState(false);

  const { currentNode, choices, selectChoice, history, isEnd, reset } =
    useConversation(scenario!, userRole);

  // 練習モード（practice）では、Step 1で選んだルート以外の選択肢を隠す
  const activeChoices = useMemo(() => {
    if (step === "practice" && learningPath[currentNode.id]) {
      return choices.filter(
        (c) => c.nextNodeId === learningPath[currentNode.id],
      );
    }
    return choices;
  }, [step, currentNode.id, choices, learningPath]);

  const isPcTurn = currentNode.speaker !== userRole;

  const handleNext = useCallback(
    (nextNodeId: string) => {
      if (step === "learning") {
        setLearningPath((prev) => ({ ...prev, [currentNode.id]: nextNodeId }));
      }
      setHasSpoken(false);
      selectChoice(nextNodeId);
    },
    [step, currentNode.id, selectChoice],
  );

  const { isListening, startListening, stopListening } = useSpeechRecognition(
    (transcript) => {
      if (step === "practice" && !isPcTurn && transcript.length > 0) {
        setHasSpoken(true);
        if (!isEnd && activeChoices.length > 0) {
          setTimeout(() => handleNext(activeChoices[0].nextNodeId), 1000);
        }
      }
    },
  );

  useEffect(() => {
    if (!currentNode || step === "role-selection" || step === "review") return;

    const isPractice = step === "practice";
    // 自分の練習ターンは能動性を促すため無音
    if (isPractice && !isPcTurn) return;

    const timer = setTimeout(() => {
      playEnglishText(currentNode.textEN, currentNode.speaker);
    }, 300);

    // PC（相手）ターンの自動進行（練習モード）
    if (isPractice && isPcTurn && !isEnd) {
      const autoNextTimer = setTimeout(() => {
        const nextId = learningPath[currentNode.id] || choices[0]?.nextNodeId;
        if (nextId) handleNext(nextId);
      }, 4000);
      return () => {
        clearTimeout(timer);
        clearTimeout(autoNextTimer);
      };
    }
    return () => clearTimeout(timer);
  }, [
    currentNode.id,
    step,
    isPcTurn,
    isEnd,
    learningPath,
    choices,
    handleNext,
  ]);

  if (!scenario)
    return <div className="p-10 text-center">Scenario not found.</div>;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-slate-50 overflow-hidden">
      <AnimatePresence mode="wait">
        {step === "role-selection" ? (
          <RoleSelection
            roleLabels={scenario.roleLabels}
            onSelect={(role) => {
              setUserRole(role);
              setStep("learning");
            }}
          />
        ) : step === "learning" || step === "practice" ? (
          <motion.div
            key={`${step}-${currentNode.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8"
          >
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black px-2 py-1 bg-blue-600 text-white rounded uppercase">
                {step === "learning"
                  ? "Step 1: 流れを知る"
                  : "Step 2: 会話する"}
              </span>
              <PlayHeader turn={currentNode.turn} />
            </div>

            <ConversationDisplay
              node={currentNode}
              mode={step === "learning" ? "learning" : "practice"}
              userRole={userRole}
            />

            <ActionControl
              mode={step === "learning" ? "learning" : "practice"}
              isPcTurn={isPcTurn}
              choices={activeChoices}
              isListening={isListening}
              hasSpoken={hasSpoken}
              onSelect={handleNext}
              onStart={startListening}
              onStop={() => {
                stopListening();
                if (step === "practice" && isEnd) setHasSpoken(true);
              }}
              isEnd={isEnd}
              onFinish={() => {
                if (step === "learning") {
                  setStep("practice");
                  reset();
                } else setStep("review");
              }}
            />
          </motion.div>
        ) : (
          <ConversationReflection
            history={history}
            currentNode={currentNode}
            userRole={userRole}
            onReset={() => {
              setStep("role-selection");
              reset();
              setLearningPath({});
            }}
          />
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
