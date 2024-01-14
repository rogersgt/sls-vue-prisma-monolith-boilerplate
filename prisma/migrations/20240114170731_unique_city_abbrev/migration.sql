/*
  Warnings:

  - A unique constraint covering the columns `[abbreviation,province_id]` on the table `city` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "city_abbreviation_province_id_key" ON "city"("abbreviation", "province_id");
