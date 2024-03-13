/*
  Warnings:

  - A unique constraint covering the columns `[name,authorId]` on the table `QuestionGroup` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "QuestionGroup_name_key";

-- CreateTable
CREATE TABLE "Images" (
    "id" TEXT NOT NULL,
    "base64" TEXT NOT NULL,

    CONSTRAINT "Images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuestionGroup_name_authorId_key" ON "QuestionGroup"("name", "authorId");
