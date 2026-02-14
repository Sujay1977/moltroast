'use client'

import { useEffect } from 'react'
import confetti from 'canvas-confetti'

interface WinnerBannerProps {
    winner: string
    score: number
}

export default function WinnerBanner({ winner, score }: WinnerBannerProps) {
    useEffect(() => {
        // Trigger confetti on mount
        const duration = 3000
        const animationEnd = Date.now() + duration
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

        function randomInRange(min: number, max: number) {
            return Math.random() * (max - min) + min
        }

        const interval: NodeJS.Timeout = setInterval(function () {
            const timeLeft = animationEnd - Date.now()

            if (timeLeft <= 0) {
                return clearInterval(interval)
            }

            const particleCount = 50 * (timeLeft / duration)

            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
            })
            confetti({
                ...defaults,
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
            })
        }, 250)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 border-2 border-primary rounded-xl p-8 text-center animate-shake">
            <div className="text-6xl mb-4">🔥</div>
            <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight mb-2">
                WINNER: {winner}
            </h2>
            <div className="text-2xl text-accent-cyan font-bold">
                Score: {score}/100
            </div>
        </div>
    )
}
