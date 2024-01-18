-- DropForeignKey
ALTER TABLE "band_user" DROP CONSTRAINT "band_user_band_id_fkey";

-- AddForeignKey
ALTER TABLE "band_user" ADD CONSTRAINT "band_user_band_id_fkey" FOREIGN KEY ("band_id") REFERENCES "band"("id") ON DELETE CASCADE ON UPDATE CASCADE;
