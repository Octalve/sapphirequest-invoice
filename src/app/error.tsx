"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  void error;
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-16">
      <section className="mx-auto max-w-lg rounded-3xl bg-white p-8 text-center shadow-xl">
        <h1 className="text-2xl font-black text-slate-900">Something went wrong</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          The invoice workspace could not be rendered. Your browser-stored draft is not deleted by this screen.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-xl bg-[#0755DB] px-5 py-3 font-bold text-white hover:brightness-110"
        >
          Try again
        </button>
      </section>
    </main>
  );
}
