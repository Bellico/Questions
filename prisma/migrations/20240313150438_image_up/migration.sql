/*
  Warnings:

  - Added the required column `authorId` to the `Images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdDate` to the `Images` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filetype` to the `Images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Images" ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "createdDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "filetype" TEXT NOT NULL;
