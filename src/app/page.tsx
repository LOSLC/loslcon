import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Expect } from "@/components/sections/expect";
import { Join } from "@/components/sections/join";
import { Expo } from "@/components/sections/expo";
import { Partners } from "@/components/sections/partners";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Expect />
      <Expo />
      <Partners />
      <Join />
    </main>
  );
}
