-- CreateTable
CREATE TABLE "Note" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "activityId" INTEGER,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Note_userId_date_idx" ON "Note"("userId", "date");

-- CreateIndex
CREATE INDEX "Note_userId_content_idx" ON "Note"("userId", "content");

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
