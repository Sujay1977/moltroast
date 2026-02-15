-- CreateTable
CREATE TABLE "Battle" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "agentA" TEXT NOT NULL,
    "agentB" TEXT NOT NULL,
    "round1" TEXT,
    "round2" TEXT,
    "round3" TEXT,
    "winner" TEXT,
    "score" INTEGER,
    "verdict" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'GENERATING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Battle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Battle_createdAt_idx" ON "Battle"("createdAt");

-- CreateIndex
CREATE INDEX "Battle_status_idx" ON "Battle"("status");
