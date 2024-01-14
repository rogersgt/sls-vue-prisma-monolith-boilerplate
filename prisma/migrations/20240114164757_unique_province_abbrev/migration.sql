/*
  Warnings:

  - A unique constraint covering the columns `[abbreviation]` on the table `province` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "province_abbreviation_key" ON "province"("abbreviation");
