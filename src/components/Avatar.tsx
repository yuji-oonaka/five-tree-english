interface Props {
  speaker: "user" | "pc";
  className?: string;
}

export default function Avatar({ speaker, className = "" }: Props) {
  // ユーザー（YOU）は明るいオレンジ、店員（PC）は落ち着いたブルー
  const isUser = speaker === "user";

  return (
    <div
      className={`flex items-center justify-center rounded-full shadow-sm overflow-hidden ${
        isUser ? "bg-orange-100" : "bg-slate-200"
      } ${className}`}
    >
      {/* 知育アプリらしく、親しみやすい絵文字で代用。将来的に画像へ差し替え可能 */}
      <span className="text-2xl" role="img" aria-label={speaker}>
        {isUser ? "👩‍🎓" : "👨‍🍳"}
      </span>
    </div>
  );
}
