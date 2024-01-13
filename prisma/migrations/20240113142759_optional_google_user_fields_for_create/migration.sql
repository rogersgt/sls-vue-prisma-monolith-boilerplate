-- AlterTable
ALTER TABLE "user" ALTER COLUMN "email_verified" SET DEFAULT false,
ALTER COLUMN "google_user_id" DROP NOT NULL;
