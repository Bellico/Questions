/*
  Warnings:

  - Added the required column `withNavigate` to the `Room` table without a default value. This is not possible if the table is not empty.
  - Added the required column `withProgressState` to the `Room` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN "withNavigate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN  "withProgressState" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "Room" ALTER COLUMN "withNavigate" DROP DEFAULT;
ALTER TABLE "Room" ALTER COLUMN "withProgressState" DROP DEFAULT;
