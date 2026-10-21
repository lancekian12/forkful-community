import type { Metadata } from "next";
import ShareMealForm from "@/components/share-meal-form";

export const metadata: Metadata = {
  title: "Share a recipe",
  description: "Share your favourite home recipe with the Forkful community.",
};

export default function ShareMealPage() {
  return (
    <div className="container-page pt-12">
      <header className="max-w-2xl">
        <p className="eyebrow">Share a recipe</p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Share your <em className="font-normal text-accent">favourite</em> dish
        </h1>
        <p className="mt-4 text-lg text-muted">
          Write it once, the way you&apos;d explain it to a friend. It goes live instantly.
        </p>
      </header>
      <div className="mt-12">
        <ShareMealForm />
      </div>
    </div>
  );
}
