'use client';

import { RadialBar, RadialBarChart } from 'recharts';

import { ChartContainer } from '@/components/ui/chart';

interface RiskChartProps {
  score: number;
}

export function RiskChart({ score }: RiskChartProps) {
  const getRiskProperties = (value: number) => {
    if (value <= 3) return { label: 'Low', color: 'hsl(var(--chart-2))' };
    if (value <= 7) return { label: 'Medium', color: 'hsl(var(--chart-4))' };
    return { label: 'High', color: 'hsl(var(--chart-1))' };
  };

  const { label, color } = getRiskProperties(score);
  
  const chartData = [{ name: 'risk', value: score, fill: color }];

  const chartConfig = { risk: { label: 'Risk' } };

  return (
    <div className="relative flex h-40 w-full items-center justify-center">
      <ChartContainer config={chartConfig} className="absolute inset-0 h-full w-full">
        <RadialBarChart
          data={chartData}
          domain={[0, 10]}
          startAngle={-90}
          endAngle={270}
          innerRadius="75%"
          outerRadius="100%"
          barSize={16}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <RadialBar dataKey="value" background={{ fill: 'hsl(var(--muted))' }} cornerRadius={8} />
        </RadialBarChart>
      </ChartContainer>
      <div className="flex flex-col items-center">
        <p className="text-5xl font-bold" style={{ color: color }}>{score}</p>
        <p className="text-sm text-muted-foreground">{label} Risk</p>
      </div>
    </div>
  );
}
