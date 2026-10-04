import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTheme } from "../../context/ThemeContext";
import ChartTooltip from "./ChartTooltip";

const BUCKETS = [
  { label: "1", test: (n) => n === 1 },
  { label: "2", test: (n) => n === 2 },
  { label: "3", test: (n) => n === 3 },
  { label: "4–5", test: (n) => n >= 4 && n <= 5 },
  { label: "6–7", test: (n) => n >= 6 && n <= 7 },
  { label: "8–14", test: (n) => n >= 8 && n <= 14 },
  { label: "15+", test: (n) => n >= 15 },
];

export default function DurationChart({ confirmedStays }) {
  const { isDark } = useTheme();
  const color = isDark ? "#ff3d5a" : "#e11d48";
  const grid = isDark ? "#2a2630" : "#e2ddd6";
  const text = isDark ? "#a39cab" : "#6b6470";

  const data = BUCKETS.map((b) => ({
    label: b.label,
    stays: confirmedStays.filter((s) => b.test(s.numNights)).length,
  }));
  const top = data.reduce((a, b) => (b.stays > a.stays ? b : a), data[0]);

  return (
    <section className="card flex flex-col p-5 sm:p-6" aria-labelledby="duration-title">
      <h2 id="duration-title" className="font-semibold">
        Stay length
      </h2>
      <p className="mb-5 text-xs text-muted">
        {confirmedStays.length
          ? `Nights per stay · most common: ${top.label}`
          : "No stays in this period"}
      </p>
      <div className="min-h-56 flex-1" role="img" aria-label="Number of stays by length in nights">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke={grid} strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={{ fill: text, fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: grid }}
            />
            <YAxis allowDecimals={false} tick={{ fill: text, fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: "var(--surface-2)" }}
              labelFormatter={(l) => `${l} nights`}
            />
            <Bar dataKey="stays" name="Stays" fill={color} radius={[4, 4, 0, 0]} maxBarSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
