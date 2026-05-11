'use client';

import { useMemo, useState } from 'react';
import { TrendingUp, ChevronDown } from 'lucide-react';

interface RawSet {
  id: string;
  reps: number;
  weight_kg: number;
  workout_exercise: {
    exercise: { id: string; name: string };
    workout: { id: string; date: string; user_id: string };
  };
}

interface DataPoint {
  date: string;
  maxWeight: number;
  totalVolume: number;
  setCount: number;
}

interface Props {
  sets: RawSet[];
}

// ─── SVG Chart ────────────────────────────────────────────────────────────────

const W = 320;
const H = 180;
const PAD = { top: 16, right: 16, bottom: 48, left: 44 };
const PLOT_W = W - PAD.left - PAD.right;
const PLOT_H = H - PAD.top - PAD.bottom;

function ProgressChart({ points }: { points: DataPoint[] }) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const weights = points.map((p) => p.maxWeight);
  const minW = Math.min(...weights);
  const maxW = Math.max(...weights);
  const range = maxW - minW || 1;

  // Map to SVG coordinates
  const coords = points.map((p, i) => ({
    x: PAD.left + (i / Math.max(points.length - 1, 1)) * PLOT_W,
    y: PAD.top + PLOT_H - ((p.maxWeight - minW) / range) * PLOT_H,
    ...p,
  }));

  // Y-axis labels (3 levels)
  const yLabels = [minW, Math.round((minW + maxW) / 2), maxW];

  // X-axis labels — show at most 5 evenly spaced dates
  const step = Math.max(1, Math.floor(points.length / 5));
  const xLabelIndices = Array.from({ length: Math.ceil(points.length / step) }, (_, i) =>
    Math.min(i * step, points.length - 1)
  );

  const polyline = coords.map((c) => `${c.x},${c.y}`).join(' ');
  const active = activeIdx !== null ? coords[activeIdx] : null;

  return (
    <div className="relative select-none">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        style={{ touchAction: 'none' }}
        onPointerMove={(e) => {
          const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
          const scaleX = W / rect.width;
          const relX = (e.clientX - rect.left) * scaleX;
          // Find nearest point
          let nearest = 0;
          let nearestDist = Infinity;
          coords.forEach((c, i) => {
            const d = Math.abs(c.x - relX);
            if (d < nearestDist) { nearestDist = d; nearest = i; }
          });
          setActiveIdx(nearest);
        }}
        onPointerLeave={() => setActiveIdx(null)}
      >
        {/* Grid lines */}
        {yLabels.map((_, i) => {
          const y = PAD.top + (i === 0 ? PLOT_H : i === 1 ? PLOT_H / 2 : 0);
          return (
            <line
              key={i}
              x1={PAD.left}
              y1={y}
              x2={W - PAD.right}
              y2={y}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
          );
        })}

        {/* Y-axis labels */}
        {yLabels.map((val, i) => {
          const y = PAD.top + (i === 0 ? PLOT_H : i === 1 ? PLOT_H / 2 : 0);
          return (
            <text
              key={i}
              x={PAD.left - 6}
              y={y + 4}
              textAnchor="end"
              fontSize="9"
              fill="rgba(255,255,255,0.35)"
            >
              {val}
            </text>
          );
        })}

        {/* X-axis labels */}
        {xLabelIndices.map((idx) => {
          const c = coords[idx];
          const [, month, day] = points[idx].date.split('-');
          return (
            <text
              key={idx}
              x={c.x}
              y={H - 8}
              textAnchor="middle"
              fontSize="9"
              fill="rgba(255,255,255,0.35)"
            >
              {`${parseInt(day)}/${parseInt(month)}`}
            </text>
          );
        })}

        {/* Line */}
        {points.length > 1 && (
          <polyline
            points={polyline}
            fill="none"
            stroke="rgba(99,102,241,0.9)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {/* Area fill */}
        {points.length > 1 && (
          <polygon
            points={`${coords[0].x},${PAD.top + PLOT_H} ${polyline} ${coords[coords.length - 1].x},${PAD.top + PLOT_H}`}
            fill="rgba(99,102,241,0.08)"
          />
        )}

        {/* Data points */}
        {coords.map((c, i) => (
          <circle
            key={i}
            cx={c.x}
            cy={c.y}
            r={activeIdx === i ? 5 : 3}
            fill={activeIdx === i ? 'rgb(99,102,241)' : 'rgba(99,102,241,0.7)'}
            stroke={activeIdx === i ? 'white' : 'none'}
            strokeWidth="1.5"
          />
        ))}

        {/* Active vertical line */}
        {active && (
          <line
            x1={active.x}
            y1={PAD.top}
            x2={active.x}
            y2={PAD.top + PLOT_H}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />
        )}
      </svg>

      {/* Tooltip */}
      {active && (
        <div className="pointer-events-none absolute left-1/2 top-1 -translate-x-1/2 rounded-lg bg-[--color-surface] border border-[--color-border] px-3 py-1.5 text-center shadow-lg">
          <p className="text-xs font-bold text-[--color-text]">{active.maxWeight} kg</p>
          <p className="text-[10px] text-[--color-text-muted]">
            {(() => {
              const [y, m, d] = active.date.split('-').map(Number);
              return new Date(y, m - 1, d).toLocaleDateString('nl-NL', {
                day: 'numeric',
                month: 'short',
              });
            })()}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function WorkoutProgressContent({ sets }: Props) {
  // Build exercise list from sets
  const exercises = useMemo(() => {
    const map = new Map<string, string>();
    sets.forEach((s) => {
      const ex = s.workout_exercise?.exercise;
      if (ex) map.set(ex.id, ex.name);
    });
    return Array.from(map.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name, 'nl'));
  }, [sets]);

  const [selectedId, setSelectedId] = useState<string>(exercises[0]?.id ?? '');

  // Compute data points for selected exercise
  const dataPoints = useMemo((): DataPoint[] => {
    if (!selectedId) return [];

    // Group sets by workout date
    const byDate = new Map<string, { maxWeight: number; volume: number; count: number }>();

    sets.forEach((s) => {
      const ex = s.workout_exercise?.exercise;
      const workout = s.workout_exercise?.workout;
      if (!ex || !workout || ex.id !== selectedId) return;

      const date = workout.date;
      const existing = byDate.get(date) ?? { maxWeight: 0, volume: 0, count: 0 };
      byDate.set(date, {
        maxWeight: Math.max(existing.maxWeight, s.weight_kg),
        volume: existing.volume + s.weight_kg * s.reps,
        count: existing.count + 1,
      });
    });

    return Array.from(byDate.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, data]) => ({
        date,
        maxWeight: data.maxWeight,
        totalVolume: Math.round(data.volume),
        setCount: data.count,
      }));
  }, [sets, selectedId]);

  const selectedExercise = exercises.find((e) => e.id === selectedId);

  // Stats
  const pr = dataPoints.length > 0 ? Math.max(...dataPoints.map((p) => p.maxWeight)) : null;
  const latest = dataPoints[dataPoints.length - 1] ?? null;
  const first = dataPoints[0] ?? null;
  const improvement =
    first && latest && first.maxWeight > 0
      ? Math.round(((latest.maxWeight - first.maxWeight) / first.maxWeight) * 100)
      : null;

  if (exercises.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 pt-24 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[--color-surface]">
          <TrendingUp size={28} className="text-[--color-text-muted]" />
        </div>
        <h2 className="mb-2 text-lg font-semibold">Nog geen data</h2>
        <p className="text-sm text-[--color-text-muted]">
          Log trainingen met gewicht om je voortgang te zien.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 pt-5 pb-4">
      <h1 className="mb-5 text-2xl font-bold">Voortgang</h1>

      {/* Exercise picker */}
      <div className="relative mb-4">
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="w-full appearance-none rounded-xl border border-[--color-border] bg-[--color-surface] px-4 py-3 pr-10 text-sm font-medium text-[--color-text] focus:border-[--color-accent] focus:outline-none"
        >
          {exercises.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.name}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[--color-text-muted]"
        />
      </div>

      {/* Stats row */}
      {dataPoints.length > 0 && (
        <div className="mb-4 grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-[--color-card] p-3 text-center">
            <p className="text-[10px] uppercase tracking-wide text-[--color-text-muted]">PR</p>
            <p className="mt-0.5 text-lg font-bold text-[--color-accent]">{pr} kg</p>
          </div>
          <div className="rounded-xl bg-[--color-card] p-3 text-center">
            <p className="text-[10px] uppercase tracking-wide text-[--color-text-muted]">Sessies</p>
            <p className="mt-0.5 text-lg font-bold">{dataPoints.length}</p>
          </div>
          <div className="rounded-xl bg-[--color-card] p-3 text-center">
            <p className="text-[10px] uppercase tracking-wide text-[--color-text-muted]">Progressie</p>
            <p
              className={`mt-0.5 text-lg font-bold ${
                improvement === null
                  ? 'text-[--color-text-muted]'
                  : improvement >= 0
                  ? 'text-[--color-green]'
                  : 'text-[--color-red]'
              }`}
            >
              {improvement === null ? '—' : `${improvement > 0 ? '+' : ''}${improvement}%`}
            </p>
          </div>
        </div>
      )}

      {/* Chart */}
      {dataPoints.length === 0 ? (
        <div className="rounded-2xl border border-[--color-border] bg-[--color-card] p-8 text-center">
          <p className="text-sm text-[--color-text-muted]">
            Nog geen sets gelogd voor {selectedExercise?.name}.
          </p>
        </div>
      ) : dataPoints.length === 1 ? (
        <div className="rounded-2xl border border-[--color-border] bg-[--color-card] p-8 text-center">
          <p className="text-2xl font-bold">{dataPoints[0].maxWeight} kg</p>
          <p className="mt-1 text-sm text-[--color-text-muted]">
            Slechts 1 sessie — log meer om een grafiek te zien.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-[--color-border] bg-[--color-card] px-2 py-4">
          <p className="mb-1 px-3 text-xs text-[--color-text-muted]">Zwaarste set (kg)</p>
          <ProgressChart points={dataPoints} />
        </div>
      )}

      {/* Recent sessions table */}
      {dataPoints.length > 1 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[--color-text-muted]">
            Recente sessies
          </p>
          <div className="overflow-hidden rounded-xl border border-[--color-border] bg-[--color-card]">
            {[...dataPoints].reverse().slice(0, 8).map((p, i, arr) => {
              const [y, m, d] = p.date.split('-').map(Number);
              const label = new Date(y, m - 1, d).toLocaleDateString('nl-NL', {
                day: 'numeric',
                month: 'short',
              });
              const prev = arr[i + 1];
              const diff = prev ? p.maxWeight - prev.maxWeight : null;
              return (
                <div
                  key={p.date}
                  className={`flex items-center justify-between px-4 py-2.5 ${
                    i < arr.slice(0, 8).length - 1 ? 'border-b border-[--color-border]' : ''
                  }`}
                >
                  <span className="text-sm text-[--color-text-secondary]">{label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[--color-text-muted]">{p.setCount} sets</span>
                    <span className="text-sm font-semibold">{p.maxWeight} kg</span>
                    {diff !== null && (
                      <span
                        className={`w-12 text-right text-xs font-medium ${
                          diff > 0
                            ? 'text-[--color-green]'
                            : diff < 0
                            ? 'text-[--color-red]'
                            : 'text-[--color-text-muted]'
                        }`}
                      >
                        {diff > 0 ? `+${diff}` : diff === 0 ? '=' : diff} kg
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
