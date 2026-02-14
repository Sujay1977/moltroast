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

        // Atomically increment views
        const updatedBattle = await prisma.battle.update({
            where: { id: battleId },
            data: {
                views: {
                    increment: 1,
                },
            },
            select: {
                views: true,
            },
        })

        return NextResponse.json({ views: updatedBattle.views })
    } catch (error) {
        console.error('View increment error:', error)
        return NextResponse.json({ error: 'Failed to increment views' }, { status: 500 })
    }
}
