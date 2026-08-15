-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'GENERAL',
ADD COLUMN     "link" TEXT;

-- CreateIndex
CREATE INDEX "notifications_userId_read_idx" ON "notifications"("userId", "read");

-- CreateIndex
CREATE INDEX "notifications_userId_category_read_idx" ON "notifications"("userId", "category", "read");
