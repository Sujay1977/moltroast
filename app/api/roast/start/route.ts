import { NextResponse } from "next/server";

// Ensure Node.js runtime (Vercel compatible)
export const runtime = "nodejs";
export const dynamic = 'force-dynamic'

interface RoastRequestBody {
    topic: string;
    agentA: string;
    agentB: string;
}

export async function POST(req: Request) {
    try {
        // Lazy load dependencies
        const { prisma } = await import("@/lib/db");
        const { OpenAI } = await import("openai");

        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        // 1. Validate Request Body
        const body = (await req.json().catch(() => null)) as RoastRequestBody | null;

        if (!body || typeof body !== "object") {
            return NextResponse.json(
                { success: false, error: "Invalid JSON payload" },
                { status: 400 }
            );
        }

        const { topic, agentA, agentB } = body;

        // Strict validation
        if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
            return NextResponse.json(
                { success: false, error: "Topic is required" },
                { status: 400 }
            );
        }
        if (topic.length > 200) {
            return NextResponse.json(
                { success: false, error: "Topic must be under 200 characters" },
                { status: 400 }
            );
        }
        if (!agentA || typeof agentA !== "string") {
            return NextResponse.json(
                { success: false, error: "Agent A selection is required" },
                { status: 400 }
            );
        }
        if (!agentB || typeof agentB !== "string") {
            return NextResponse.json(
                { success: false, error: "Agent B selection is required" },
                { status: 400 }
            );
        }

        // 2. Validate API Key
        if (!process.env.OPENAI_API_KEY) {
            console.error("[ROAST_START_ERROR] Server misconfiguration: API key missing");
            return NextResponse.json(
                { success: false, error: "Server misconfiguration" },
                { status: 500 }
            );
        }

        // 3. Create Battle Record (Initial State: IN_PROGRESS)
        const battle = await prisma.battle.create({
            data: {
                topic: topic.trim(),
                agentA: agentA.trim(),
                agentB: agentB.trim(),
                status: "IN_PROGRESS",
            },
        });

        console.log(`[Roast] Battle created: ${battle.id}. Starting OpenAI generation...`);

        // 4. Generate Content (Rounds + Verdict)
        try {
            // Parallel generation for speed, but rigorous checking
            // We need: Round 1, Round 2, Winner, Score, Verdict

            const prompt = `
            Topic: "${topic}"
            Agent A: ${agentA}
            Agent B: ${agentB}

            Generate a brutal roast battle.
            Output JSON only:
            {
                "round1": "Agent A's roast (max 280 chars)",
                "round2": "Agent B's comeback (max 280 chars)",
                "round3": "Agent A's final blow (max 280 chars)",
                "winner": "Name of winner",
                "score": Integer 0-100,
                "verdict": "One sentence jury verdict"
            }
            `;

            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: "You are a roast battle generator. Return strictly valid JSON."
                    },
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
                response_format: { type: "json_object" }
            });

            const content = completion.choices?.[0]?.message?.content;
            if (!content) throw new Error("Accidentally Empty OpenAI response");

            const result = JSON.parse(content);

            // Validate all fields present
            if (!result.round1 || !result.round2 || !result.round3 || !result.winner || result.score === undefined || !result.verdict) {
                throw new Error("OpenAI returned incomplete JSON structure");
            }

            // 5. Atomic Update to COMPLETE
            await prisma.battle.update({
                where: { id: battle.id },
                data: {
                    round1: result.round1,
                    round2: result.round2,
                    round3: result.round3,
                    winner: result.winner,
                    score: result.score,
                    verdict: result.verdict,
                    status: "COMPLETE",
                },
            });

            console.log(`[Roast] Battle ${battle.id} COMPLETED successfully.`);

            return NextResponse.json({
                success: true,
                battleId: battle.id,
            });

        } catch (generationError: unknown) {
            console.error("[ROAST_START_ERROR] Generation Failed:", generationError);

            // Leave as IN_PROGRESS or mark FAILED, but definitely NOT COMPLETE
            await prisma.battle.update({
                where: { id: battle.id },
                data: { status: "FAILED" }, // Optional: separate status for failed gens
            }).catch(e => console.error("Failed to mark battle as FAILED:", e));

            return NextResponse.json(
                { success: false, error: "Failed to generate battle content" },
                { status: 500 }
            );
        }

    } catch (error: unknown) {
        console.error("[ROAST_START_ERROR] Internal Server Error:", error);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
