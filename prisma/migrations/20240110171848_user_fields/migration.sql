/*
  Warnings:

  - Added the required column `band_id` to the `band_user` table without a default value. This is not possible if the table is not empty.
  - Made the column `user_id` on table `band_user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `last_name` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "band_user" DROP CONSTRAINT "band_user_user_id_fkey";

-- AlterTable
ALTER TABLE "band_user" ADD COLUMN     "band_id" TEXT NOT NULL,
ALTER COLUMN "user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "last_name" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "band_user" ADD CONSTRAINT "band_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "band_user" ADD CONSTRAINT "band_user_band_id_fkey" FOREIGN KEY ("band_id") REFERENCES "band"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
