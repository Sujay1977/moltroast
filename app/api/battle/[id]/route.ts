import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params

        const battle = await prisma.battle.findUnique({
            where: { id },
        })

        if (!battle) {
            return NextResponse.json({ error: 'Battle not found' }, { status: 404 })
        }

        return NextResponse.json({ battle })
    } catch (error) {
        console.error('Battle fetch error:', error)
        return NextResponse.json({ error: 'Failed to fetch battle' }, { status: 500 })
    }
}
