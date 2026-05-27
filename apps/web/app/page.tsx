import FormImage from "~/components/landing/FormImage";
import Hero from "~/components/landing/Hero";
import Navbar from "~/components/landing/Navbar";
import SecondHero from "~/components/landing/SecondHero";
import Showcase from "~/components/landing/Showcase";
// import { api } from "~/trpc/server";
export const dynamic = "force-dynamic";

export default async function Home() {
  // const { status } = await api.health.getHealth.query();
  return (
    <main className="min-h-screen min-w-screen flex flex-col items-center">
      <div className="w-full max-w-5xl border-r border-l min-h-screen pt-12">
        <Navbar />
        <Hero />
        <SecondHero />
        <FormImage />
        <Showcase />
      </div>
    </main>
  );
}
