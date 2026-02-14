import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import type { Battle } from '@/types/battle'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit') || '20')

        // Fetch completed battles and calculate weighted score
        const battles = await prisma.battle.findMany({
            where: {
                status: "COMPLETE",
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: Math.min(limit, 50), // Max 50
        })

        // Calculate weighted score: (score * 0.6 + shares * 0.4)
        type LeaderboardEntry = {
            id: string
            topic: string
            score: number
            views: number
            shares: number
            winner: string
            createdAt: Date
            weightedScore: number
        }

        const leaderboard: LeaderboardEntry[] = battles
            .filter((battle): battle is Battle & { score: number; winner: string } =>
                battle.score !== null && battle.winner !== null
            )
            .map((battle) => ({
                id: battle.id,
                topic: battle.topic,
                score: battle.score,
                views: battle.views,
                shares: battle.shares,
                winner: battle.winner,
                createdAt: battle.createdAt,
                weightedScore: battle.score * 0.6 + battle.shares * 0.4,
            }))

        // Sort by weighted score descending
        leaderboard.sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.weightedScore - a.weightedScore)

        return NextResponse.json({ leaderboard })
    } catch (error) {
        console.error('Leaderboard fetch error:', error)
        return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
    }
}
