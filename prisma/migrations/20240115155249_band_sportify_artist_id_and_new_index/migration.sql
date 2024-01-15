-- AlterTable
ALTER TABLE "band" ADD COLUMN     "spotify_artist_id" TEXT;

-- CreateIndex
CREATE INDEX "band_city_id_name_idx" ON "band"("city_id", "name");
