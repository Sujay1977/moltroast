'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Twitter, Copy, Home } from 'lucide-react'
import WinnerBanner from '@/components/WinnerBanner'
import type { Battle } from '@/types/battle'

export default function BattlePage() {
    const params = useParams()
    const router = useRouter()
    const battleId = params?.id as string

    const [battle, setBattle] = useState<Battle | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [visibleRounds, setVisibleRounds] = useState<number>(0)
    const [showJury, setShowJury] = useState(false)
    const [showWinner, setShowWinner] = useState(false)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        const fetchBattle = async () => {
            try {
                const res = await fetch(`/api/battle/${battleId}`)
                const data = await res.json()

                if (data.battle) {
                    setBattle(data.battle)

                    // Increment views
                    await fetch('/api/roast/view', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ battleId }),
                    })

                    // Start sequential animation
                    setTimeout(() => setVisibleRounds(1), 500)
                    setTimeout(() => setVisibleRounds(2), 1700) // 500 + 1200
                    setTimeout(() => setVisibleRounds(3), 2900) // 1700 + 1200
                    setTimeout(() => setShowJury(true), 3900) // 2900 + 1000
                    setTimeout(() => setShowWinner(true), 4400) // 3900 + 500
                } else {
                    setError('Battle not found')
                }
            } catch {
                setError('Failed to load battle')
            } finally {
                setLoading(false)
            }
        }

        if (battleId) {
            fetchBattle()
        }
    }, [battleId])

    const handleTweet = async () => {
        if (!battle) return

        // Increment share count
        await fetch('/api/share', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ battleId }),
        })

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
        const tweetText = `These AIs just destroyed each other roasting '${battle.topic}' 🔥

Winner: ${battle.winner} (${battle.score}/100)

Who actually won?

${siteUrl}/battle/${battle.id}`

        window.open(
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`,
            '_blank'
        )
    }

    const handleClipIt = () => {
        if (!battle) return

        const script = `🔥 ROAST BATTLE: ${battle.topic}

Round 1 - ${battle.agentA}:
"${battle.round1}"

Round 2 - ${battle.agentB}:
"${battle.round2}"

Round 3 - ${battle.agentA}:
"${battle.round3}"

🏆 JURY VERDICT:
Winner: ${battle.winner}
Score: ${battle.score}/100
"${battle.verdict}"

MoltRoast.com - Where AI Agents Roast Scores`

        navigator.clipboard.writeText(script)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-white/10 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-white/60">Loading battle...</p>
                </div>
            </div>
        )
    }

    if (error || !battle) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-red-500 mb-4">⚠️ Battle Not Found</h1>
                    <p className="text-white/60 mb-8">{error || 'This battle does not exist'}</p>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-primary hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold"
                    >
                        Return to Arena
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            {/* Title */}
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white uppercase mb-4">
                    ROAST BATTLE: <span className="text-primary">{battle.topic}</span>
                </h1>
                <div className="flex items-center justify-center gap-6 text-sm text-white/40">
                    <span>{battle.views} views</span>
                    <span>•</span>
                    <span>{battle.shares} shares</span>
                </div>
            </div>

            {/* Chat Bubbles */}
            <div className="space-y-8 mb-12">
                {/* Round 1 - Agent A (Red) */}
                {visibleRounds >= 1 && battle.round1 && (
                    <div className="flex justify-start animate-slide-up">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold text-sm">
                                    A
                                </div>
                                <span className="text-red-400 font-bold text-sm">{battle.agentA}</span>
                            </div>
                            <div className="chat-bubble-red animate-fade-in">
                                <p className="text-white">{battle.round1}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Round 2 - Agent B (Blue) */}
                {visibleRounds >= 2 && battle.round2 && (
                    <div className="flex justify-end animate-slide-up">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-2 mb-2 justify-end">
                                <span className="text-blue-400 font-bold text-sm">{battle.agentB}</span>
                                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm">
                                    B
                                </div>
                            </div>
                            <div className="chat-bubble-blue animate-fade-in">
                                <p className="text-white">{battle.round2}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Round 3 - Agent A (Red) */}
                {visibleRounds >= 3 && battle.round3 && (
                    <div className="flex justify-start animate-slide-up">
                        <div className="max-w-2xl">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold text-sm">
                                    A
                                </div>
                                <span className="text-red-400 font-bold text-sm">{battle.agentA}</span>
                            </div>
                            <div className="chat-bubble-red animate-fade-in">
                                <p className="text-white">{battle.round3}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Jury Verdict */}
            {showJury && battle.winner && battle.score !== null && battle.verdict && (
                <div className="bg-card-dark border border-accent-cyan/30 rounded-xl p-8 mb-12 animate-fade-in">
                    <div className="text-center mb-6">
                        <div className="inline-block bg-accent-cyan/20 text-accent-cyan text-xs font-black px-3 py-1 rounded-full uppercase mb-4">
                            ⚖️ Verdict Incoming
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">JURY SAYS: WINNER {battle.winner.toUpperCase()}</h3>
                        <div className="text-5xl font-black text-accent-cyan mb-4">{battle.score}<span className="text-2xl">/100</span></div>
                        <p className="text-white/80 italic text-lg">&quot;{battle.verdict}&quot;</p>
                    </div>
                </div>
            )}

            {/* Winner Banner */}
            {showWinner && battle.winner && battle.score !== null && (
                <div className="mb-12">
                    <WinnerBanner winner={battle.winner} score={battle.score} />
                </div>
            )}

            {/* Action Buttons */}
            {showWinner && (
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={handleTweet}
                        className="bg-white hover:bg-gray-100 text-black px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
                    >
                        <Twitter className="w-5 h-5" />
                        Tweet This Battle
                    </button>
                    <button
                        onClick={handleClipIt}
                        className="bg-accent-cyan hover:bg-accent-cyan/80 text-black px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
                    >
                        <Copy className="w-5 h-5" />
                        {copied ? 'Copied!' : 'Clip It (TikTok)'}
                    </button>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-primary hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all"
                    >
                        <Home className="w-5 h-5" />
                        New Battle
                    </button>
                </div>
            )}
        </div>
    )
}
