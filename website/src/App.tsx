import { useState } from 'react';
import { ImageTab } from './tabs/ImageTab';
import { VideoTab } from './tabs/VideoTab';

type Tab = 'image' | 'video';

export function App() {
    const [tab, setTab] = useState<Tab>('image');

    return (
        <div className="flex min-h-screen flex-col bg-ink text-[#e6e8eb]">
            <header className="flex items-center justify-between border-b border-line px-5 py-3 sm:px-8">
                <div className="flex items-baseline gap-3">
                    <span className="text-[15px] font-semibold tracking-tight">LuzTech</span>
                    <span className="text-[13px] text-fog">Mesh Generator</span>
                </div>
                <nav className="flex" role="tablist" aria-label="Output type">
                    <TabButton active={tab === 'image'} onClick={() => setTab('image')}>
                        Image
                    </TabButton>
                    <TabButton active={tab === 'video'} onClick={() => setTab('video')}>
                        Video
                    </TabButton>
                </nav>
            </header>

            <main className="flex flex-1 flex-col">
                {tab === 'image' ? <ImageTab /> : <VideoTab />}
            </main>

            <footer className="flex items-center justify-between border-t border-line px-5 py-3 text-[11px] text-[#5c6670] sm:px-8">
                <span>LuzTech visual identity — see TRADEMARKS.md for usage rules.</span>
                <span>
                    Static style after{' '}
                    <a
                        href="https://meshgradient.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="text-fog underline decoration-line underline-offset-2 hover:text-[#e6e8eb]">
                        Mesh Gradient Generator
                    </a>
                </span>
            </footer>
        </div>
    );
}

function TabButton({
    active,
    onClick,
    children
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            role="tab"
            aria-selected={active}
            onClick={onClick}
            className={`px-4 py-1.5 text-sm transition ${
                active ? 'bg-mint font-medium text-ink' : 'text-fog hover:text-[#e6e8eb]'
            }`}>
            {children}
        </button>
    );
}
