import Image from "next/image";
import { PARTNERS } from "@/lib/partners";

export const metadata = {
  title: "Partners – LOSL-CON 2025",
  description: "Our partners supporting LOSL-CON 2025.",
};

export default function PartnersPage() {
  return (
    <main className="container mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Our partners</h1>
        <p className="mt-2 text-white/70">They help make LOSL-CON possible.</p>
      </div>
      {PARTNERS.length === 0 ? (
        <p className="text-white/70">No partners yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {PARTNERS.map((p) => (
            <a
              key={p.name}
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="group p-4 transition-transform hover:scale-[1.02]"
            >
              <div className="relative w-full h-28 sm:h-36 md:h-44 lg:h-52">
                <Image
                  src={p.imageFile}
                  alt={p.name}
                  fill
                  sizes="(max-width: 640px) 240px, (max-width: 1024px) 320px, 400px"
                  className="object-contain"
                />
              </div>
              <div className="mt-2 text-xs text-white/70 text-center">{p.name}</div>
            </a>
          ))}
        </div>
      )}
    </main>
  );
}
