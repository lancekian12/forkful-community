import type { Metadata } from "next";
import Link from "next/link";
import { CalendarHeart, Flame, Heart, MessageSquareHeart, Trophy, Users, UtensilsCrossed } from "lucide-react";
import SubscribeForm from "@/components/subscribe-form";
import { getStats, getTopCooks } from "@/lib/queries";
import { initials } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Community",
  description: "Meet the cooks behind Forkful and join our cook-alongs.",
};

export const dynamic = "force-dynamic";

const perks = [
  { icon: UtensilsCrossed, title: "Share & discover", body: "Post your dishes and find tried-and-true recipes from cooks you trust." },
  { icon: MessageSquareHeart, title: "Real feedback", body: "Reviews come from people who actually cooked it — tweaks included." },
  { icon: CalendarHeart, title: "Live events", body: "Weekly cook-alongs, seasonal challenges and tasting meet-ups." },
];

const events = [
  { when: "Every Sunday · 6 pm", title: "Sunday Supper Club", body: "A live cook-along of the week's top-rated recipe." },
  { when: "First Saturday monthly", title: "Pantry Challenge", body: "Five mystery ingredients, one hour, endless creativity." },
  { when: "Every Friday", title: "Street Food Fridays", body: "Recreating the world's best street snacks at home." },
];

export default async function CommunityPage() {
  const [stats, cooks] = await Promise.all([getStats(), getTopCooks()]);

  return (
    <div className="container-page pt-12">
      <header className="mx-auto max-w-3xl text-center">
        <p className="eyebrow">Community</p>
        <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight sm:text-6xl">
          One shared passion: <em className="font-normal text-accent">food</em>
        </h1>
        <p className="mt-5 text-lg text-muted">
          Forkful is a kitchen table for home cooks everywhere. Swap recipes, trade tips, and cook together.
        </p>
      </header>

      <dl className="mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { icon: UtensilsCrossed, label: "Recipes", value: stats.recipes },
          { icon: Users, label: "Home cooks", value: stats.cooks },
          { icon: MessageSquareHeart, label: "Reviews", value: stats.reviews },
          { icon: Heart, label: "Likes", value: stats.likes },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="card flex flex-col items-center p-5 text-center">
            <Icon className="size-5 text-accent" aria-hidden />
            <dt className="order-last text-sm text-muted">{label}</dt>
            <dd className="mt-2 font-display text-3xl font-semibold">{value}</dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="perks" className="mt-24">
        <h2 id="perks" className="text-center font-display text-3xl font-semibold sm:text-4xl">Why cooks join</h2>
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {perks.map(({ icon: Icon, title, body }) => (
            <li key={title} className="card p-8">
              <span className="grid size-12 place-items-center rounded-2xl bg-accent-soft text-accent">
                <Icon className="size-6" aria-hidden />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-24 grid gap-10 lg:grid-cols-2">
        <section aria-labelledby="cooks" className="card p-8">
          <div className="flex items-center gap-2">
            <Trophy className="size-5 text-gold" aria-hidden />
            <h2 id="cooks" className="font-display text-2xl font-semibold">Top cooks</h2>
          </div>
          <ol className="mt-6 divide-y divide-line">
            {cooks.map((c, i) => (
              <li key={c.name} className="flex items-center gap-4 py-4">
                <span className="w-5 font-display text-lg font-semibold text-muted">{i + 1}</span>
                <span className="grid size-10 place-items-center rounded-full bg-surface-2 text-sm font-semibold">
                  {initials(c.name)}
                </span>
                <div className="flex-1">
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-xs text-muted">
                    {c.recipes} {c.recipes === 1 ? "recipe" : "recipes"}
                    {c.rating ? ` · ${c.rating.toFixed(1)} ★ avg` : ""}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-sm text-muted">
                  <Heart className="size-3.5 text-accent" fill="currentColor" aria-hidden />
                  {c.likes}
                </span>
              </li>
            ))}
          </ol>
          <Link href="/meals/share" className="btn-ghost mt-4 w-full">Get on the board</Link>
        </section>

        <section aria-labelledby="events" className="card p-8">
          <div className="flex items-center gap-2">
            <Flame className="size-5 text-accent" aria-hidden />
            <h2 id="events" className="font-display text-2xl font-semibold">Regular events</h2>
          </div>
          <ul className="mt-6 space-y-4">
            {events.map((e) => (
              <li key={e.title} className="rounded-2xl bg-surface-2 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">{e.when}</p>
                <h3 className="mt-1 font-display text-lg font-semibold">{e.title}</h3>
                <p className="mt-1 text-sm text-muted">{e.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-24 flex flex-col items-center gap-6 rounded-[2rem] bg-accent px-6 py-14 text-center text-accent-ink">
        <h2 className="font-display text-3xl font-semibold sm:text-4xl">Pull up a chair</h2>
        <p className="max-w-md opacity-85">Get event invites and the week&apos;s best new recipes. No spam — just food.</p>
        <SubscribeForm />
      </section>
    </div>
  );
}
