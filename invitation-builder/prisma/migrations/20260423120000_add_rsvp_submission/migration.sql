-- CreateTable
CREATE TABLE "RsvpSubmission" (
    "id" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "side" TEXT NOT NULL,
    "intent" TEXT NOT NULL,
    "guestName" TEXT NOT NULL,
    "companionCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RsvpSubmission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RsvpSubmission_invitationId_createdAt_idx" ON "RsvpSubmission"("invitationId", "createdAt" DESC);

-- AddForeignKey
ALTER TABLE "RsvpSubmission" ADD CONSTRAINT "RsvpSubmission_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
