import { NextRequest, NextResponse } from 'next/server'


export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
    try {
        const { prisma } = await import('@/lib/db')
        const { searchParams } = new URL(request.url)
        const limit = parseInt(searchParams.get('limit') || '20')

        // Fetch ONLY completed battles with all required fields
        const battles = await prisma.battle.findMany({
            where: {
                status: "COMPLETE",
                winner: { not: null },
                score: { not: null },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: Math.min(limit, 50),
        })

        // Calculate weighted score: (score * 0.6 + shares * 0.4)
        // Note: DB filtering guarantees winner and score are not null, so we can cast safely or check minimally
        const leaderboard = battles.map((battle) => ({
            id: battle.id,
            topic: battle.topic,
            score: battle.score || 0, // Fallback just in case, though DB filter prevents this
            views: battle.views,
            shares: battle.shares,
            winner: battle.winner || "Unknown",
            createdAt: battle.createdAt,
            weightedScore: (battle.score || 0) * 0.6 + battle.shares * 0.4,
        }))

        // Sort by weighted score descending
        leaderboard.sort((a, b) => b.weightedScore - a.weightedScore)

        return NextResponse.json({ leaderboard })
    } catch (error) {
        console.error('Leaderboard fetch error:', error)
        return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
    }
}
