/*
  Warnings:

  - You are about to drop the column `band_owner_id` on the `show` table. All the data in the column will be lost.
  - Added the required column `band_organizer_id` to the `show` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "show" DROP CONSTRAINT "show_band_owner_id_fkey";

-- AlterTable
ALTER TABLE "band" ADD COLUMN     "founded" TIMESTAMP(3),
ADD COLUMN     "instagram_handle" TEXT,
ADD COLUMN     "website_url" TEXT;

-- AlterTable
ALTER TABLE "show" DROP COLUMN "band_owner_id",
ADD COLUMN     "band_organizer_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "genre" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BandToGenre" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "genre_name_idx" ON "genre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "genre_name_key" ON "genre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_BandToGenre_AB_unique" ON "_BandToGenre"("A", "B");

-- CreateIndex
CREATE INDEX "_BandToGenre_B_index" ON "_BandToGenre"("B");

-- AddForeignKey
ALTER TABLE "show" ADD CONSTRAINT "show_band_organizer_id_fkey" FOREIGN KEY ("band_organizer_id") REFERENCES "band"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BandToGenre" ADD CONSTRAINT "_BandToGenre_A_fkey" FOREIGN KEY ("A") REFERENCES "band"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BandToGenre" ADD CONSTRAINT "_BandToGenre_B_fkey" FOREIGN KEY ("B") REFERENCES "genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;
