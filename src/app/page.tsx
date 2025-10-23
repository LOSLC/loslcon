import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Expect } from "@/components/sections/expect";
import { Join } from "@/components/sections/join";
import { Expo } from "@/components/sections/expo";
import { Partners } from "@/components/sections/partners";
import { getRegistrationsConfig } from "@/app/actions/loslcon/loslcon";

export default async function Home() {
  const config = await getRegistrationsConfig();
  const registrationsOpen = !!config?.registrationsOpen;
  return (
    <main>
      <Hero registrationsOpen={registrationsOpen} />
      <About />
      <Expect />
      <Expo />
      <Partners />
      <Join registrationsOpen={registrationsOpen} />
    </main>
  );
}
