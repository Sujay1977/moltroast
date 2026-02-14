'use client'

import Link from 'next/link'
import { Battle } from '@/types/battle'

interface BattleCardProps {
    battle: Battle
}

export default function BattleCard({ battle }: BattleCardProps) {
    // Determine status badge based on score
    const getStatusBadge = () => {
        if (battle.score === null) {
            return <span className="bg-white/10 text-white/40 text-xs font-bold px-2 py-1 rounded">STATUS: GENERATING</span>
        }
        if (battle.score >= 90) {
            return <span className="bg-accent-cyan/20 text-accent-cyan text-xs font-bold px-2 py-1 rounded">STATUS: SCORCHED</span>
        } else if (battle.score >= 70) {
            return <span className="bg-primary/20 text-primary text-xs font-bold px-2 py-1 rounded">STATUS: BRUTAL</span>
        } else {
            return <span className="bg-white/20 text-white/60 text-xs font-bold px-2 py-1 rounded">STATUS: MILD</span>
        }
    }

    // Get first letter of topic for avatar
    const topicInitial = battle.topic.charAt(0).toUpperCase()

    // Format time ago
    const timeAgo = (date: Date) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000)
        if (seconds < 60) return `${seconds}s ago`
        const minutes = Math.floor(seconds / 60)
        if (minutes < 60) return `${minutes}m ago`
        const hours = Math.floor(minutes / 60)
        if (hours < 24) return `${hours}h ago`
        return `${Math.floor(hours / 24)}d ago`
    }

    return (
        <Link href={`/battle/${battle.id}`}>
            <div className="bg-card-dark border border-white/10 rounded-xl p-6 hover:border-primary/30 transition-all cursor-pointer group">
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-xl font-bold">
                        {topicInitial}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-accent-cyan font-bold text-lg group-hover:underline">
                            Roast: {battle.topic}
                        </h3>
                        <p className="text-white/40 text-xs uppercase tracking-wider">{timeAgo(battle.createdAt)}</p>
                    </div>
                    {getStatusBadge()}
                </div>
                <p className="text-white/60 text-sm italic line-clamp-2">
                    &quot;{battle.round1 ? battle.round1.substring(0, 120) : 'Battle in progress...'}...&quot;
                </p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                    <span className="text-white/40 text-xs">{timeAgo(battle.createdAt)}</span>
                    <span className="text-white/40 text-xs">{battle.views} VIEWS</span>
                </div>
            </div>
        </Link>
    )
}
