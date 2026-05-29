-- AlterTable
ALTER TABLE "Complaint" ADD COLUMN     "assignedWorkerId" INTEGER,
ADD COLUMN     "workImage" TEXT,
ADD COLUMN     "workNote" TEXT;

-- AddForeignKey
ALTER TABLE "Complaint" ADD CONSTRAINT "Complaint_assignedWorkerId_fkey" FOREIGN KEY ("assignedWorkerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
