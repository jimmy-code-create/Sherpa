import Link from "next/link";
import { Compass } from "lucide-react";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";

export default function NotFound() {
  return (
    <>
      <SiteHeader signedIn={false} />
      <main className="mx-auto flex w-full max-w-lg flex-col items-center px-4 py-24 text-center">
        <Compass className="size-10 text-[var(--brand-primary)]" aria-hidden="true" />
        <h1 className="mt-4 font-display text-3xl font-extrabold text-[var(--fg-primary)]">Chapter not found</h1>
        <p className="mt-2 text-[15px] text-[var(--fg-secondary)]">
          That page doesn&apos;t exist (or the chapter slug is wrong). Browse the catalogue instead.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link href="/subjects" className="btn btn-primary">
            Browse chapters
          </Link>
          <Link href="/" className="btn btn-secondary">
            Home
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
