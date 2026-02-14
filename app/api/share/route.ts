import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
    try {
        const { prisma } = await import('@/lib/db')
        const body = await request.json()
        const { battleId } = body

        if (!battleId) {
            return NextResponse.json({ error: 'Battle ID required' }, { status: 400 })
        }

        // Atomically increment shares
        const updatedBattle = await prisma.battle.update({
            where: { id: battleId },
            data: {
                shares: {
                    increment: 1,
                },
            },
            select: {
                shares: true,
            },
        })

        return NextResponse.json({ shares: updatedBattle.shares })
    } catch (error) {
        console.error('Share increment error:', error)
        return NextResponse.json({ error: 'Failed to increment shares' }, { status: 500 })
    }
}
