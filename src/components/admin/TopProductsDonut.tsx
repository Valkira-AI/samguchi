import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartOptions } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { formatARS } from "@/lib/products";

ChartJS.register(ArcElement, Tooltip, Legend);

const COLORS = ["#e07b39", "#f2b134", "#2f9e6f", "#3b82f6", "#a855f7"];

export type DonutSlice = { nombre: string; uds: number; total: number };

export default function TopProductsDonut({ data }: { data: DonutSlice[] }) {
  const totalUds = data.reduce((a, d) => a + d.uds, 0) || 1;

  const options: ChartOptions<"doughnut"> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "62%",
    plugins: {
      legend: {
        position: "right",
        labels: { boxWidth: 12, boxHeight: 12, usePointStyle: true, padding: 14, font: { size: 12 } },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const slice = data[ctx.dataIndex];
            const pct = ((slice.uds / totalUds) * 100).toFixed(1);
            return ` ${slice.uds} uds · ${pct}% · ${formatARS(slice.total)}`;
          },
        },
      },
    },
  };

  return (
    <div className="h-[280px]">
      <Doughnut
        options={options}
        data={{
          labels: data.map((d) => `${d.nombre} (${((d.uds / totalUds) * 100).toFixed(0)}%)`),
          datasets: [
            {
              data: data.map((d) => d.uds),
              backgroundColor: COLORS,
              borderColor: "#fff",
              borderWidth: 2,
            },
          ],
        }}
      />
    </div>
  );
}
