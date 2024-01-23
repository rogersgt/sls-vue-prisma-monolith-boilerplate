/*
  Warnings:

  - Added the required column `updated` to the `band` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `band_show` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `band_user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `show` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated` to the `venue` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "band" ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "band_show" ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "band_user" ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "show" ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "venue" ADD COLUMN     "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated" TIMESTAMP(3) NOT NULL;
