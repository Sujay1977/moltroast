import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'   // 🔥 VERY IMPORTANT

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params

        // 🔥 Import Prisma INSIDE function (prevents build-time execution)
        const { prisma } = await import('@/lib/db')

        const battle = await prisma.battle.findUnique({
            where: { id },
        })

        if (!battle) {
            return NextResponse.json(
                { error: 'Battle not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({ battle })
    } catch (error) {
        console.error('Battle fetch error:', error)

        return NextResponse.json(
            { error: 'Failed to fetch battle' },
            { status: 500 }
        )
    }
}
