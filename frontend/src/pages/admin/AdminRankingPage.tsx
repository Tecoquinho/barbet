import { useEffect, useState } from "react";
import { getRanking } from "../../services/adminService";
import { RankingEntry } from "../../types/api";

export default function AdminRankingPage() {
  const [ranking, setRanking] = useState<RankingEntry[]>([]);

  useEffect(() => {
    getRanking().then(setRanking);
  }, []);

  return (
    <div className="glass-panel overflow-hidden">
      <div className="border-b border-white/10 p-5">
        <h2 className="font-display text-2xl font-semibold">Ranking do bar</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-white/5 text-white/55">
            <tr>
              <th className="px-5 py-4">#</th>
              <th className="px-5 py-4">Apelido</th>
              <th className="px-5 py-4">Mesa</th>
              <th className="px-5 py-4">Apostas</th>
              <th className="px-5 py-4">Cervejas</th>
              <th className="px-5 py-4">Pontos</th>
            </tr>
          </thead>
          <tbody>
            {ranking.map((item, index) => (
              <tr key={item.customerId} className="border-t border-white/10">
                <td className="px-5 py-4">{index + 1}</td>
                <td className="px-5 py-4 font-semibold">{item.apelido}</td>
                <td className="px-5 py-4">{item.mesaCodigo}</td>
                <td className="px-5 py-4">{item.totalApostas}</td>
                <td className="px-5 py-4">{item.totalCervejas}</td>
                <td className="px-5 py-4 text-gold">{item.totalPontos}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
