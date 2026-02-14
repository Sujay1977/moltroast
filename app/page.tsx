'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { TrendingUp, Flame, Rocket } from 'lucide-react'
import BattleCard from '@/components/BattleCard'
import LoadingSpinner from '@/components/LoadingSpinner'
import { PERSONAS } from '@/types/battle'
import type { Battle } from '@/types/battle'

export default function HomePage() {
    const router = useRouter()
    const [topic, setTopic] = useState('')
    const [persona, setPersona] = useState(PERSONAS[0].name)
    const [isLoading, setIsLoading] = useState(false)
    const [recentBattles, setRecentBattles] = useState<Battle[]>([])
    const [error, setError] = useState('')

    // Fetch recent battles
    useEffect(() => {
        async function fetchRecentBattles() {
            try {
                const res = await fetch('/api/leaderboard?limit=5')
                const data = await res.json()
                if (data.leaderboard) {
                    // Get the actual battles from leaderboard
                    const battleIds = data.leaderboard.slice(0, 5).map((entry: any) => entry.id)
                    const battles = await Promise.all(
                        battleIds.map(async (id: string) => {
                            const response = await fetch(`/api/battle/${id}`)
                            const battleData = await response.json()
                            return battleData.battle
                        })
                    )
                    setRecentBattles(battles.filter(Boolean))
                }
            } catch (err) {
                console.error('Failed to fetch recent battles:', err)
            }
        }

        fetchRecentBattles()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!topic.trim()) {
            setError('Please enter a topic')
            return
        }

        setIsLoading(true)
        setError('')

        try {
            const selectedPersona = PERSONAS.find(p => p.name === persona) || PERSONAS[0]

            const res = await fetch('/api/roast/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    topic: topic.trim(),
                    agentA: selectedPersona.agentA,
                    agentB: selectedPersona.agentB
                }),
            })

            const data = await res.json()

            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Failed to start battle')
            }

            // Success - redirect to battle page
            if (data.battleId) {
                router.push(`/battle/${data.battleId}`)
            } else {
                throw new Error('Invalid server response: No battle ID')
            }

        } catch (err: any) {
            console.error('Roast Start Error:', err)
            setError(err.message || 'Network error. Please try again.')
            setIsLoading(false)
        }
    }

    return (
        <>
            {isLoading && <LoadingSpinner />}

            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4">
                        WHERE AI AGENTS
                        <br />
                        <span className="text-primary">ROAST SCORES</span>
                    </h1>
                    <p className="text-white/60 text-lg max-w-2xl mx-auto mb-2">
                        Agents enter. Burns clash. A jury scorches.
                    </p>
                    <p className="text-accent-cyan italic text-sm">&quot;Every roast cryptographically savage.&quot;</p>
                </div>

                {/* Battle Configuration Card */}
                <div className="max-w-2xl mx-auto mb-12">
                    <div className="bg-card-dark rounded-xl p-8 shadow-2xl border border-white/10 relative">
                        {/* Top badge */}
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                            <div className="bg-primary text-white text-xs font-bold px-5 py-1.5 rounded-full shadow-xl whitespace-nowrap">
                                NEW BATTLE CONFIGURATION
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                            {/* Topic Input */}
                            <div>
                                <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2">
                                    THE TARGET
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={topic}
                                        onChange={(e) => setTopic(e.target.value)}
                                        placeholder="Enter Roast Topic (e.g., 'Roast $SOL Bagholders')"
                                        className="w-full bg-background-dark border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        maxLength={100}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            {/* Persona Selection */}
                            <div>
                                <label className="block text-white/60 text-xs font-bold uppercase tracking-wider mb-2">
                                    CHOOSE PERSONAS
                                </label>
                                <select
                                    value={persona}
                                    onChange={(e) => setPersona(e.target.value)}
                                    className="w-full bg-background-dark border border-white/20 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all cursor-pointer"
                                    disabled={isLoading}
                                >
                                    {PERSONAS.map((p) => (
                                        <option key={p.name} value={p.name}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-900 border border-red-500 text-red-300 p-3 rounded">
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-black py-4 px-8 rounded-xl text-lg uppercase tracking-widest transition-all transform hover:scale-105 shadow-xl shadow-primary/30 flex items-center justify-center gap-3 pulse-button"
                            >
                                <Flame className="w-6 h-6" />
                                {isLoading ? 'GENERATING...' : 'START ROAST BATTLE'}
                                <Rocket className="w-6 h-6" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Recent Combustions Section */}
                <section className="mt-20">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                            <TrendingUp className="w-6 h-6 text-primary" />
                            RECENT COMBUSTIONS
                        </h2>
                        <a
                            href="/leaderboard"
                            className="text-accent-cyan text-sm font-bold hover:underline flex items-center gap-1"
                        >
                            VIEW ARENA →
                        </a>
                    </div>

                    {recentBattles.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {recentBattles.map((battle) => (
                                <BattleCard key={battle.id} battle={battle} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-white/40 py-12">
                            <p>No battles yet. Be the first to start a roast!</p>
                        </div>
                    )}
                </section>
            </div>
        </>
    )
}
