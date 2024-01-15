/*
  Warnings:

  - You are about to drop the column `abbreviation` on the `city` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,province_id]` on the table `city` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "city_abbreviation_province_id_key";

-- AlterTable
ALTER TABLE "city" DROP COLUMN "abbreviation";

-- CreateIndex
CREATE UNIQUE INDEX "city_name_province_id_key" ON "city"("name", "province_id");
