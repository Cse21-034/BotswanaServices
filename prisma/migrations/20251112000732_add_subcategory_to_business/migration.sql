-- AlterTable
ALTER TABLE "businesses" ADD COLUMN     "subcategory_id" TEXT;

-- AddForeignKey
ALTER TABLE "businesses" ADD CONSTRAINT "businesses_subcategory_id_fkey" FOREIGN KEY ("subcategory_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
