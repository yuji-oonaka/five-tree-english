import Link from "next/link";
import { allScenarios } from "@/data/scenarios";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 p-6 flex flex-col items-center">
      <header className="mb-12 text-center mt-10">
        <h1 className="text-4xl font-black text-slate-900 mb-2">
          Five Tree English
        </h1>
        <p className="text-slate-500 font-medium tracking-tight">
          日常会話の「流れ」を知ろう
        </p>
      </header>

      <div className="grid gap-4 w-full max-w-md">
        <h2 className="text-lg font-bold text-slate-700 mb-2 px-2">
          シチュエーションを選ぶ
        </h2>

        {allScenarios.map((scenario) => (
          <Link key={scenario.id} href={`/play?id=${scenario.id}`}>
            <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-transparent hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">
                    Level 1
                  </span>
                  <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {scenario.title}
                  </h3>
                </div>
                <div className="text-2xl group-hover:translate-x-1 transition-transform">
                  ➡️
                </div>
              </div>
            </div>
          </Link>
        ))}

        {/* 開発中プレースホルダー：警告の出ない標準記法で実装 */}
        <div className="bg-slate-100 p-6 rounded-3xl border-2 border-dashed border-slate-300 opacity-60">
          <p className="text-slate-500 font-bold">
            Coming Soon: コンビニ / 道案内
          </p>
        </div>
      </div>

      {/* フッター等のボタン類が必要な場合も、w-39.5 のような標準スケールを使用します */}
      <footer className="mt-20">
        <p className="text-xs text-slate-400">
          © 2026 Five Tree English Project
        </p>
      </footer>
    </main>
  );
}
