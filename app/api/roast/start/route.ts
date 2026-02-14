import { NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/db";

// Ensure Node.js runtime (Vercel compatible)
export const runtime = "nodejs";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

interface RoastRequestBody {
    topic: string;
    agentA: string;
    agentB: string;
}

export async function POST(req: Request) {
    try {
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

        // 3. Create Battle Record (Initial State)
        const battle = await prisma.battle.create({
            data: {
                topic: topic.trim(),
                agentA: agentA.trim(),
                agentB: agentB.trim(),
                status: "GENERATING",
            },
        });

        console.log(`[Roast] Battle created: ${battle.id}. Starting OpenAI generation...`);

        // 4. Call OpenAI API (Standard Chat Completion)
        try {
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini",
                messages: [
                    {
                        role: "system",
                        content: `You are participating in a roast battle. You are ${agentA}. Your opponent is ${agentB}. Roast the topic "${topic}" brutally but funnily. Keep it under 280 characters.`,
                    },
                    {
                        role: "user",
                        content: `Roast topic: ${topic}`,
                    },
                ],
            });

            // 5. Safely Extract Output
            const round1Text = completion.choices?.[0]?.message?.content;

            if (!round1Text) {
                throw new Error("OpenAI returned empty response");
            }

            // 6. Update Battle with Result
            await prisma.battle.update({
                where: { id: battle.id },
                data: {
                    round1: round1Text,
                    status: "COMPLETE", // Marking as complete for now since we have round 1
                },
            });

            console.log(`[Roast] Battle ${battle.id} updated successfully.`);

            // 7. Return Standard Success Response
            return NextResponse.json({
                success: true,
                battleId: battle.id,
            });

        } catch (openaiError: unknown) {
            console.error("[ROAST_START_ERROR] OpenAI Generation Failed:", openaiError);

            // 9. Update status to failed
            await prisma.battle.update({
                where: { id: battle.id },
                data: { status: "FAILED" },
            }).catch(e => console.error("Failed to update battle status to FAILED:", e));

            return NextResponse.json(
                { success: false, error: "Failed to generate roast" },
                { status: 500 }
            );
        }

    } catch (error: unknown) {
        console.error("[ROAST_START_ERROR] Internal Server Error:", error);

        const errorMessage = error instanceof Error ? error.message : "Internal server error";

        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
