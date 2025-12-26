-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fullName" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "role" TEXT DEFAULT 'Member',
ADD COLUMN     "website" TEXT;
