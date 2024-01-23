-- CreateEnum
CREATE TYPE "ShowStatus" AS ENUM ('pending', 'confirmed', 'cancelled');

-- AlterTable
ALTER TABLE "show" ADD COLUMN     "status" "ShowStatus" NOT NULL DEFAULT 'pending';
