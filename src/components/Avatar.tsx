import { UserRoleType } from "@/types/conversation";

interface Props {
  speaker: UserRoleType;
  className?: string;
}

export default function Avatar({ speaker, className = "" }: Props) {
  const isRoleA = speaker === "roleA";

  return (
    <div
      className={`flex items-center justify-center rounded-full shadow-sm overflow-hidden ${
        isRoleA ? "bg-orange-100" : "bg-slate-200"
      } ${className}`}
    >
      <span className="text-2xl" role="img" aria-label={speaker}>
        {isRoleA ? "👩‍🎓" : "👨‍🍳"}
      </span>
    </div>
  );
}
