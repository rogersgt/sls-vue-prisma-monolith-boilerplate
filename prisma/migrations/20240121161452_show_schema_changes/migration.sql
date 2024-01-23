/*
  Warnings:

  - You are about to drop the column `band_organizer_id` on the `show` table. All the data in the column will be lost.
  - Added the required column `created_by_id` to the `show` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by_id` to the `show` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "show" DROP CONSTRAINT "show_band_organizer_id_fkey";

-- AlterTable
ALTER TABLE "band_show" ADD COLUMN     "set_start_time" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "show" DROP COLUMN "band_organizer_id",
ADD COLUMN     "created_by_id" TEXT NOT NULL,
ADD COLUMN     "doors_open_at" TIMESTAMP(3),
ADD COLUMN     "updated_by_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "show" ADD CONSTRAINT "show_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "show" ADD CONSTRAINT "show_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
