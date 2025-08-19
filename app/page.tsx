import { Header } from '@/components/header';
import { BreachCraft } from '@/components/shell-genius';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container py-8">
        <BreachCraft />
      </main>
    </div>
  );
}
