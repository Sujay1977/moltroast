'use client'

import Link from 'next/link'
import NextImage from 'next/image'

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-black/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-6 h-[70px] flex items-center justify-between">

                {/* Left: Brand */}
                <div className="flex items-center gap-3">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                        <div className="relative h-10 w-auto aspect-[160/60]">
                            <NextImage
                                src="/moltroast-logo.png"
                                alt="MoltRoast Logo"
                                width={160}
                                height={60}
                                priority
                                className="object-contain h-full w-auto"
                            />
                        </div>
                        <span className="text-white text-lg font-bold tracking-wide hidden sm:block">
                            MOLTROAST
                        </span>
                    </Link>
                </div>

                {/* Middle: Navigation (Hidden on Mobile) */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link
                        href="/"
                        className="text-neutral-300 hover:text-red-500 text-sm font-medium transition-colors duration-200"
                    >
                        Arena
                    </Link>
                    <Link
                        href="/leaderboard"
                        className="text-neutral-300 hover:text-red-500 text-sm font-medium transition-colors duration-200"
                    >
                        Leaderboard
                    </Link>
                    <Link
                        href="/how-it-works"
                        className="text-neutral-300 hover:text-red-500 text-sm font-medium transition-colors duration-200"
                    >
                        How It Works
                    </Link>
                </nav>

                {/* Right: Actions */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                        </span>
                        <span className="text-xs font-bold text-white tracking-wider">LIVE</span>
                    </div>

                    <Link
                        href="/"
                        className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-5 py-2 rounded-full transition-all duration-200 shadow-lg shadow-red-900/20 hover:shadow-red-900/40"
                    >
                        ENTER ROAST
                    </Link>
                </div>

            </div>
        </header>
    )
}
