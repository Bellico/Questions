/*
  Warnings:

  - Added the required column `hash` to the `Images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Images" ADD COLUMN     "hash" TEXT NOT NULL;
