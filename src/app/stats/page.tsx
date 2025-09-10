import { catApi } from "@/lib/catApi";
import OriginsChart from "@/components/OriginsChart";
import LifeSpanChart, { LifeSpanPoint } from "@/components/LifeSpanChart";
import { Breed } from "@/types/cat";

const API_URL = process.env.CAT_API_URL;
const API_KEY = process.env.CAT_API_KEY || "";

export default async function StatsPage() {
  let breeds: Breed[] = [];

  try {
    breeds = await catApi.getBreeds();
  } catch {
    try {
      const res = await fetch(`${API_URL}/breeds`, {
        headers: { "x-api-key": API_KEY },
        cache: "no-store",
      });
      if (res.ok) {
        breeds = await res.json();
      }
    } catch {
      breeds = [];
    }
  }

  // ✅ Scatter plot data with jitter for X-axis
  const lifespanData: LifeSpanPoint[] = (breeds || [])
    .map((b: Breed) => {
      let avg = 0;
      let range = "N/A";

      if (b.life_span) {
        const parts = b.life_span.split(/[-–]/).map((n) => parseInt(n.trim(), 10));
        if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
          avg = (parts[0] + parts[1]) / 2;
          range = `${parts[0]}–${parts[1]} yrs`;
        } else if (parts.length === 1 && !isNaN(parts[0])) {
          avg = parts[0];
          range = `${parts[0]} yrs`;
        }
      }

      let color = "#f87171";
      if (avg >= 16) color = "#34d399";
      else if (avg >= 12) color = "#fbbf24";

      return { name: b.name, avg, range, color, index: 0 };
    })
    .filter((d) => d.avg > 0)
    .map((d, i) => ({
      ...d,
      index: i + Math.random() * 0.5, // ✅ jitter so it looks scattered
    }));

  // ✅ Origins aggregation
  const grouped: Record<string, number> = {};
  breeds.forEach((b: Breed) => {
    if (!b.origin) return;
    grouped[b.origin] = (grouped[b.origin] || 0) + 1;
  });
  const originData = Object.entries(grouped).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold mb-6">Insights</h1>
        <OriginsChart data={originData} />
      </div>
      <div>
        <LifeSpanChart data={lifespanData} />
      </div>
    </div>
  );
}
