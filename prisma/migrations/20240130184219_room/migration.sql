-- CreateEnum
CREATE TYPE "RoomDisplay" AS ENUM ('Horizontal', 'Vertical');

-- CreateEnum
CREATE TYPE "RoomMode" AS ENUM ('Training', 'Rating');

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "groupId" TEXT,
    "userId" TEXT NOT NULL,
    "shareLink" TEXT,
    "display" "RoomDisplay" NOT NULL,
    "mode" "RoomMode" NOT NULL,
    "withTimer" BOOLEAN NOT NULL,
    "withRandom" BOOLEAN NOT NULL,
    "withCorrection" BOOLEAN NOT NULL,
    "withResults" BOOLEAN NOT NULL,
    "dateStart" TIMESTAMP(3),
    "dateEnd" TIMESTAMP(3),

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "responseId" TEXT,
    "dateStart" TIMESTAMP(3) NOT NULL,
    "dateEnd" TIMESTAMP(3),
    "order" INTEGER NOT NULL,
    "isCorrect" BOOLEAN,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "QuestionGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE SET NULL ON UPDATE CASCADE;
