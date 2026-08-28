import { useState } from "react";
import { ImageTab } from "./tabs/ImageTab";
import { VideoTab } from "./tabs/VideoTab";

type Tab = "image" | "video";

export function App() {
  const [tab, setTab] = useState<Tab>("image");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[#00ff9d] via-[#69dd96] to-[#1f6fef] font-bold text-zinc-950">
              L
            </div>
            <div>
              <h1 className="text-lg font-semibold leading-tight">LuzTech Mesh Generator</h1>
              <p className="text-xs text-zinc-500">Static &amp; animated brand gradients</p>
            </div>
          </div>
          <nav className="flex gap-1 rounded-lg border border-zinc-800 bg-zinc-900 p-1">
            <TabButton active={tab === "image"} onClick={() => setTab("image")}>
              Image
            </TabButton>
            <TabButton active={tab === "video"} onClick={() => setTab("video")}>
              Video
            </TabButton>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {tab === "image" ? <ImageTab /> : <VideoTab />}
      </main>

      <footer className="border-t border-zinc-800">
        <div className="mx-auto max-w-6xl px-6 py-4 text-xs text-zinc-500">
          LuzTech visual identity — see TRADEMARKS.md for usage rules. Static mesh
          style modeled after the{" "}
          <a
            href="https://meshgradient.com/"
            target="_blank"
            rel="noreferrer"
            className="text-emerald-400 hover:underline"
          >
            Mesh Gradient Generator
          </a>
          .
        </div>
      </footer>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-4 py-1.5 text-sm font-medium transition ${
        active ? "bg-emerald-400 text-zinc-950" : "text-zinc-400 hover:text-zinc-100"
      }`}
    >
      {children}
    </button>
  );
}
