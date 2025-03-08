-- CreateEnum
CREATE TYPE "StreamState" AS ENUM ('Pending', 'Live', 'Complete');

-- CreateTable
CREATE TABLE "Stream" (
    "fixtureId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "state" "StreamState" NOT NULL DEFAULT 'Pending',

    CONSTRAINT "Stream_pkey" PRIMARY KEY ("fixtureId")
);

-- CreateTable
CREATE TABLE "HlsSegment" (
    "fixtureId" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "timestamp" INTEGER NOT NULL,
    "filename" TEXT NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "HlsSegment_pkey" PRIMARY KEY ("fixtureId","index")
);

-- AddForeignKey
ALTER TABLE "HlsSegment" ADD CONSTRAINT "HlsSegment_fixtureId_fkey" FOREIGN KEY ("fixtureId") REFERENCES "Stream"("fixtureId") ON DELETE CASCADE ON UPDATE NO ACTION;
