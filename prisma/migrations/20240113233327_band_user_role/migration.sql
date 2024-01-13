/*
  Warnings:

  - A unique constraint covering the columns `[google_user_id]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "BandRole" AS ENUM ('owner', 'member');

-- AlterTable
ALTER TABLE "band_user" ADD COLUMN     "role" "BandRole" NOT NULL DEFAULT 'member';

-- CreateIndex
CREATE UNIQUE INDEX "user_google_user_id_key" ON "user"("google_user_id");
