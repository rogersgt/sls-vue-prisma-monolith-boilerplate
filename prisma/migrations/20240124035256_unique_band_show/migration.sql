/*
  Warnings:

  - A unique constraint covering the columns `[show_id,band_id]` on the table `band_show` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "band_show_show_id_band_id_key" ON "band_show"("show_id", "band_id");
