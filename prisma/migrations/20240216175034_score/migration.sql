/*
  Warnings:

  - You are about to drop the column `display` on the `Room` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Room" DROP COLUMN "display",
ADD COLUMN     "failedCount" INTEGER,
ADD COLUMN     "score" INTEGER,
ADD COLUMN     "successCount" INTEGER;

-- DropEnum
DROP TYPE "RoomDisplay";
