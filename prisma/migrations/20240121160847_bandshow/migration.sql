/*
  Warnings:

  - You are about to drop the `_BandToShow` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BandToShow" DROP CONSTRAINT "_BandToShow_A_fkey";

-- DropForeignKey
ALTER TABLE "_BandToShow" DROP CONSTRAINT "_BandToShow_B_fkey";

-- DropTable
DROP TABLE "_BandToShow";

-- CreateTable
CREATE TABLE "band_show" (
    "id" TEXT NOT NULL,
    "band_id" TEXT NOT NULL,
    "show_id" TEXT NOT NULL,
    "lineup_order" INTEGER NOT NULL,

    CONSTRAINT "band_show_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "band_show_band_id_idx" ON "band_show"("band_id");

-- CreateIndex
CREATE INDEX "show_venue_id_idx" ON "show"("venue_id");

-- CreateIndex
CREATE INDEX "show_date_idx" ON "show"("date");

-- AddForeignKey
ALTER TABLE "band_show" ADD CONSTRAINT "band_show_band_id_fkey" FOREIGN KEY ("band_id") REFERENCES "band"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "band_show" ADD CONSTRAINT "band_show_show_id_fkey" FOREIGN KEY ("show_id") REFERENCES "show"("id") ON DELETE CASCADE ON UPDATE CASCADE;
