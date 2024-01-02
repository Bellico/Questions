/*
  Warnings:

  - You are about to alter the column `name` on the `QuestionGroup` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `text` on the `Response` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(250)`.

*/
-- AlterTable
ALTER TABLE "QuestionGroup" ALTER COLUMN "name" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Response" ALTER COLUMN "text" SET DATA TYPE VARCHAR(250);
