import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Expect } from "@/components/sections/expect";
import { Join } from "@/components/sections/join";

export default function Home() {
  return (
    <main>
  <Hero />
      <About />
      <Expect />
      <Join />
    </main>
  );
}
