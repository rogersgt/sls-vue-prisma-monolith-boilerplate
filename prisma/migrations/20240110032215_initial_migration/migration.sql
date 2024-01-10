-- CreateEnum
CREATE TYPE "BandUserType" AS ENUM ('MEMBER', 'MANAGER');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "email" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address" (
    "id" TEXT NOT NULL,
    "latitude" INTEGER NOT NULL,
    "longitude" INTEGER NOT NULL,
    "street_address" TEXT NOT NULL,
    "postal_code" TEXT,
    "city_id" TEXT NOT NULL,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "province" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,

    CONSTRAINT "province_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "city" (
    "id" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "province_id" TEXT NOT NULL,

    CONSTRAINT "city_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "venue" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address_id" TEXT NOT NULL,

    CONSTRAINT "venue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "venue_note" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "venue_id" TEXT NOT NULL,
    "created_by_id" TEXT NOT NULL,
    "band_id" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "venue_note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "band" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city_id" TEXT NOT NULL,

    CONSTRAINT "band_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "band_user" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "member_type" "BandUserType" NOT NULL,

    CONSTRAINT "band_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "show" (
    "id" TEXT NOT NULL,
    "band_owner_id" TEXT NOT NULL,
    "event_name" TEXT,
    "venue_id" TEXT NOT NULL,

    CONSTRAINT "show_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BandToShow" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE INDEX "user_email_idx" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "city_name_idx" ON "city"("name");

-- CreateIndex
CREATE INDEX "city_province_id_idx" ON "city"("province_id");

-- CreateIndex
CREATE INDEX "venue_note_venue_id_idx" ON "venue_note"("venue_id");

-- CreateIndex
CREATE INDEX "band_city_id_idx" ON "band"("city_id");

-- CreateIndex
CREATE INDEX "band_name_idx" ON "band"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_BandToShow_AB_unique" ON "_BandToShow"("A", "B");

-- CreateIndex
CREATE INDEX "_BandToShow_B_index" ON "_BandToShow"("B");

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "city" ADD CONSTRAINT "city_province_id_fkey" FOREIGN KEY ("province_id") REFERENCES "province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "venue" ADD CONSTRAINT "venue_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "venue_note" ADD CONSTRAINT "venue_note_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "venue_note" ADD CONSTRAINT "venue_note_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "venue_note" ADD CONSTRAINT "venue_note_band_id_fkey" FOREIGN KEY ("band_id") REFERENCES "band"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "band" ADD CONSTRAINT "band_city_id_fkey" FOREIGN KEY ("city_id") REFERENCES "city"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "band_user" ADD CONSTRAINT "band_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "show" ADD CONSTRAINT "show_band_owner_id_fkey" FOREIGN KEY ("band_owner_id") REFERENCES "band"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "show" ADD CONSTRAINT "show_venue_id_fkey" FOREIGN KEY ("venue_id") REFERENCES "venue"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BandToShow" ADD CONSTRAINT "_BandToShow_A_fkey" FOREIGN KEY ("A") REFERENCES "band"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BandToShow" ADD CONSTRAINT "_BandToShow_B_fkey" FOREIGN KEY ("B") REFERENCES "show"("id") ON DELETE CASCADE ON UPDATE CASCADE;
