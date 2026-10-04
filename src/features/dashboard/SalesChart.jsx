import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { eachDayOfInterval, format, isSameDay, subDays } from "date-fns";
import { useTheme } from "../../context/ThemeContext";
import ChartTooltip from "./ChartTooltip";
import { formatCurrency } from "../../lib/utils";

// Validated pair (dataviz palette check): passes CVD + contrast in both modes.
const SERIES = {
  light: { cabin: "#e11d48", extras: "#7c3aed", grid: "#e2ddd6", text: "#6b6470" },
  dark: { cabin: "#ff3d5a", extras: "#9085e9", grid: "#2a2630", text: "#a39cab" },
};

export default function SalesChart({ bookings, numDays }) {
  const { isDark } = useTheme();
  const c = SERIES[isDark ? "dark" : "light"];

  const days = eachDayOfInterval({ start: subDays(new Date(), numDays - 1), end: new Date() });
  const data = days.map((date) => {
    const todays = bookings.filter((b) => isSameDay(date, new Date(b.createdAt)));
    return {
      label: format(date, "MMM d"),
      cabin: todays.reduce((s, b) => s + b.cabinPrice, 0),
      extras: todays.reduce((s, b) => s + b.extrasPrice, 0),
    };
  });
  const total = data.reduce((s, d) => s + d.cabin + d.extras, 0);

  return (
    <section className="card p-5 sm:p-6" aria-labelledby="sales-title">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="sales-title" className="font-semibold">
            Sales
          </h2>
          <p className="text-xs text-muted">
            {format(days[0], "MMM d")} – {format(days.at(-1), "MMM d, yyyy")} · {formatCurrency(total)} total
          </p>
        </div>
        <ul className="flex gap-4 text-xs text-muted" aria-label="Legend">
          <li className="flex items-center gap-2">
            <span className="size-2.5 rounded-sm" style={{ background: c.cabin }} /> Cabin revenue
          </li>
          <li className="flex items-center gap-2">
            <span className="size-2.5 rounded-sm" style={{ background: c.extras }} /> Extras
          </li>
        </ul>
      </div>
      <div className="h-64 sm:h-72" role="img" aria-label={`Daily sales chart, ${formatCurrency(total)} total`}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="fill-cabin" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c.cabin} stopOpacity={0.35} />
                <stop offset="100%" stopColor={c.cabin} stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="fill-extras" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c.extras} stopOpacity={0.45} />
                <stop offset="100%" stopColor={c.extras} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke={c.grid} strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={{ fill: c.text, fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: c.grid }}
              minTickGap={24}
            />
            <YAxis
              tick={{ fill: c.text, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => (v >= 1000 ? `$${v / 1000}k` : `$${v}`)}
              width={52}
            />
            <Tooltip
              content={<ChartTooltip currency total />}
              cursor={{ stroke: c.text, strokeWidth: 1, strokeDasharray: "4 4" }}
            />
            <Area
              type="monotone"
              dataKey="extras"
              name="Extras"
              stackId="sales"
              stroke={c.extras}
              strokeWidth={2}
              fill="url(#fill-extras)"
              activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--surface)" }}
            />
            <Area
              type="monotone"
              dataKey="cabin"
              name="Cabin revenue"
              stackId="sales"
              stroke={c.cabin}
              strokeWidth={2}
              fill="url(#fill-cabin)"
              activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--surface)" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
