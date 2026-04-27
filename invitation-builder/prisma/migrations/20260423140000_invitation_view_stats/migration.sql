-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN "publicViewCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Invitation" ADD COLUMN "lastPublicViewAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "InvitationDailyView" (
    "invitationId" TEXT NOT NULL,
    "statDate" VARCHAR(10) NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "InvitationDailyView_pkey" PRIMARY KEY ("invitationId","statDate")
);

-- CreateIndex
CREATE INDEX "InvitationDailyView_invitationId_idx" ON "InvitationDailyView"("invitationId");

-- AddForeignKey
ALTER TABLE "InvitationDailyView" ADD CONSTRAINT "InvitationDailyView_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "Invitation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
