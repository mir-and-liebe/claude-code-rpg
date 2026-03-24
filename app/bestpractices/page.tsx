import bestpracticesData from "@/data/bestpractices.json";
import type { BestPractice } from "@/lib/types";
import { BestPracticeCard } from "@/components/BestPracticeCard";

export default function BestPracticesPage() {
  const practices = bestpracticesData as BestPractice[];
  const categories = [...new Set(practices.map((p) => p.category))];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Best Practices</h1>
        <p className="text-sm text-text-muted mt-0.5">
          Every best practice in your vault, explained with the &quot;what&quot;
          and the &quot;why&quot;. Derived from your ECC + BMAD setup.
        </p>
      </div>

      {categories.map((category) => (
        <div key={category}>
          <h2 className="text-lg font-bold mb-3">{category}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {practices
              .filter((p) => p.category === category)
              .map((practice) => (
                <BestPracticeCard key={practice.id} practice={practice} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
