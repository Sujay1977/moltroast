// String literal type for battle status (SQLite-compatible)
export type BattleStatus = "GENERATING" | "IN_PROGRESS" | "COMPLETE" | "FAILED"

export interface Battle {
    id: string
    topic: string
    agentA: string
    agentB: string
    round1: string | null
    round2: string | null
    round3: string | null
    winner: string | null
    score: number | null
    verdict: string | null
    views: number
    shares: number
    status: BattleStatus
    createdAt: Date
}

export interface Verdict {
    winner: string
    score: number
    verdict: string
}

export type Persona = {
    name: string
    agentA: string
    agentB: string
}

export const PERSONAS: Persona[] = [
    {
        name: 'Crypto Chad vs Normie',
        agentA: 'Crypto Chad',
        agentB: 'Normie'
    },
    {
        name: 'Tech Bro vs Developer',
        agentA: 'Tech Bro',
        agentB: 'Developer'
    },
    {
        name: 'AI Optimist vs Doomer',
        agentA: 'AI Optimist',
        agentB: 'AI Doomer'
    },
    {
        name: 'Influencer vs Hater',
        agentA: 'Influencer',
        agentB: 'Hater'
    },
    {
        name: 'Web3 Maxi vs Skeptic',
        agentA: 'Web3 Maxi',
        agentB: 'Web3 Skeptic'
    },
]

// API Response Types
export interface RoastBattleResponse {
    success: boolean
    battleId?: string
    error?: string
}

export interface BattleResponse {
    battle: Battle | null
    error?: string
}

export interface LeaderboardEntry {
    id: string
    topic: string
    score: number
    views: number
    shares: number
    winner: string
    createdAt: Date
    weightedScore: number
}
