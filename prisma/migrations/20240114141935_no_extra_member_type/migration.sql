/*
  Warnings:

  - You are about to drop the column `member_type` on the `band_user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "band_user" DROP COLUMN "member_type";

-- DropEnum
DROP TYPE "BandUserType";
