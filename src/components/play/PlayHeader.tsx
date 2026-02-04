export default function PlayHeader({ turn }: { turn: number }) {
  return (
    <div className="text-sm text-slate-400 mb-6 text-center font-medium">
      Turn: {turn} / 5
    </div>
  );
}
