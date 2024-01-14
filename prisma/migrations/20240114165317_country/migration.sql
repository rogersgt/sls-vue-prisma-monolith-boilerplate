/*
  Warnings:

  - Added the required column `country_id` to the `province` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "province" ADD COLUMN     "country_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "country" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,

    CONSTRAINT "country_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "country_abbreviation_key" ON "country"("abbreviation");

-- AddForeignKey
ALTER TABLE "province" ADD CONSTRAINT "province_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
