import Avatar from "@/components/Avatar";

interface Props {
  roleLabels: { roleA: string; roleB: string };
  onSelect: (role: "roleA" | "roleB") => void;
}

export default function RoleSelection({ roleLabels, onSelect }: Props) {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-3xl shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-500">
      <h2 className="text-2xl font-black text-slate-800 mb-8 text-center leading-tight">
        どっちの立場で
        <br />
        練習する？
      </h2>

      <div className="grid grid-cols-2 gap-4 w-full">
        {/* 役割 A (例：お客さん) */}
        <button
          onClick={() => onSelect("roleA")}
          className="flex flex-col items-center p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
        >
          {/* ここを "user" から "roleA" に修正 */}
          <Avatar
            speaker="roleA"
            className="w-16 h-16 mb-4 group-hover:scale-110 transition-transform"
          />
          <span className="font-bold text-slate-700">{roleLabels.roleA}</span>
        </button>

        {/* 役割 B (例：店員さん) */}
        <button
          onClick={() => onSelect("roleB")}
          className="flex flex-col items-center p-6 bg-slate-50 border-2 border-slate-100 rounded-3xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
        >
          {/* ここを "pc" から "roleB" に修正 */}
          <Avatar
            speaker="roleB"
            className="w-16 h-16 mb-4 group-hover:scale-110 transition-transform"
          />
          <span className="font-bold text-slate-700">{roleLabels.roleB}</span>
        </button>
      </div>
    </div>
  );
}
