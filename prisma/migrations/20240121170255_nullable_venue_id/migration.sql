-- DropForeignKey
ALTER TABLE "show" DROP CONSTRAINT "show_venue_id_fkey";

-- AlterTable
ALTER TABLE "show" ALTER COLUMN "venue_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "show" ADD CONSTRAINT "show_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venue"("id") ON DELETE SET NULL ON UPDATE CASCADE;
