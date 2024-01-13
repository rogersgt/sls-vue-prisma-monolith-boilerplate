/*
  Warnings:

  - Added the required column `email_verified` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `google_user_id` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" ADD COLUMN     "email_verified" BOOLEAN NOT NULL,
ADD COLUMN     "google_user_id" TEXT NOT NULL,
ADD COLUMN     "picture_url" TEXT;
