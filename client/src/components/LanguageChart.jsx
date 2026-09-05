import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

const COLORS = [
  "#6366F1",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#64748B",
];

const LanguageChart = ({ languages }) => {
  const source = languages?.languages ?? languages ?? {};

  const entries = Array.isArray(source)
    ? source
        .map((item) => [
          item.name || item.language || item.label,
          Number(item.value ?? item.count ?? item.percentage ?? 0),
        ])
        .filter(([name, value]) => name && value > 0)
    : Object.entries(source).filter(([, value]) => Number(value) > 0);

  const total = entries.reduce((sum, [, value]) => sum + Number(value), 0);

  const data = entries
    .map(([name, value]) => ({
      name,
      value: Number(value),
      percentage: total > 0 ? (Number(value) / total) * 100 : 0,
    }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Language Distribution
        </h2>
        <p className="text-slate-500 mt-1">Repository language composition.</p>

        <div className="h-[320px] flex items-center justify-center text-slate-500">
          No language data available.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8">
      <h2 className="text-2xl font-bold text-slate-900">
        Language Distribution
      </h2>

      <p className="text-slate-500 mt-1 mb-6">
        Repository language composition.
      </p>

      <div className="grid lg:grid-cols-2 gap-8 items-center">
        <div className="w-full h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={72}
                outerRadius={118}
                paddingAngle={2}
                stroke="#ffffff"
                strokeWidth={2}
                label={false}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`language-${entry.name}-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value, name) => {
                  const item = data.find((d) => d.name === name);

                  return [`${item?.percentage.toFixed(1) ?? "0.0"}%`, name];
                }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          <div className="bg-slate-50 rounded-2xl p-5 mb-5 text-center">
            <p className="text-3xl font-bold text-slate-900">{data.length}</p>
            <p className="text-sm text-slate-500 mt-1">Languages Detected</p>
          </div>

          <div className="space-y-3 max-h-[260px] overflow-y-auto pr-2">
            {data.map((item, index) => (
              <div
                key={item.name}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />

                  <span className="font-medium text-slate-700 truncate">
                    {item.name}
                  </span>
                </div>

                <span className="font-semibold text-slate-800 whitespace-nowrap">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageChart;
