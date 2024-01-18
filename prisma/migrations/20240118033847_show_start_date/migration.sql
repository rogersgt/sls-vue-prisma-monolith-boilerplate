/*
  Warnings:

  - Added the required column `date` to the `show` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "show" ADD COLUMN     "date" DATE NOT NULL;
