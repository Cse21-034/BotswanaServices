-- DropIndex
DROP INDEX "public"."businesses_owner_id_key";

-- AlterTable
ALTER TABLE "businesses" ADD COLUMN     "branch_name" TEXT,
ADD COLUMN     "is_branch" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "parent_business_id" TEXT;

-- AddForeignKey
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_parent_business_id_fkey" FOREIGN KEY ("parent_business_id") REFERENCES "businesses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
