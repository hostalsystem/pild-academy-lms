/*
  Warnings:

  - You are about to drop the column `instructorId` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `displayOrder` on the `instructors` table. All the data in the column will be lost.
  - You are about to drop the column `expertise` on the `instructors` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `instructors` table. All the data in the column will be lost.
  - You are about to drop the column `socialLinks` on the `instructors` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_instructorId_fkey";

-- DropIndex
DROP INDEX "instructors_email_key";

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "instructorId";

-- AlterTable
ALTER TABLE "instructors" DROP COLUMN "displayOrder",
DROP COLUMN "expertise",
DROP COLUMN "isActive",
DROP COLUMN "socialLinks",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "courses" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "education" TEXT,
ADD COLUMN     "experience" TEXT,
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "github" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "portfolioUrl" TEXT,
ADD COLUMN     "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "specialization" TEXT,
ADD COLUMN     "youtube" TEXT,
ALTER COLUMN "email" DROP NOT NULL;
