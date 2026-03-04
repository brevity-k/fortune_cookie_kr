'use client';

import type { NatalChart } from '@/lib/astro/types';
import { formatPlanet } from '@/lib/astro/format';

interface Props {
  chart: NatalChart;
}

export default function PlanetTable({ chart }: Props) {
  const planets = chart.planets.map(formatPlanet);

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold text-cookie-gold">
        행성 위치
      </h3>
      <div className="overflow-x-auto rounded-xl border border-white/5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 bg-white/3">
              <th className="px-3 py-2.5 text-left font-medium text-text-muted">행성</th>
              <th className="px-3 py-2.5 text-left font-medium text-text-muted">별자리</th>
              <th className="px-3 py-2.5 text-right font-medium text-text-muted">도수</th>
              <th className="px-3 py-2.5 text-center font-medium text-text-muted">하우스</th>
              <th className="px-3 py-2.5 text-center font-medium text-text-muted">역행</th>
            </tr>
          </thead>
          <tbody>
            {planets.map((p) => (
              <tr key={p.planet} className="border-b border-white/5 transition hover:bg-white/3">
                <td className="px-3 py-2.5 text-text-primary">
                  <span className="mr-1.5 text-cookie-gold">{p.symbol}</span>
                  {p.planetKorean}
                </td>
                <td className="px-3 py-2.5 text-text-secondary">
                  <span className="mr-1.5">{p.signSymbol}</span>
                  {p.signKorean}
                </td>
                <td className="px-3 py-2.5 text-right font-mono text-text-secondary">
                  {p.degree}
                </td>
                <td className="px-3 py-2.5 text-center text-text-secondary">
                  {p.house}
                </td>
                <td className="px-3 py-2.5 text-center text-red-400">
                  {p.retrograde ? '\u212E' : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
