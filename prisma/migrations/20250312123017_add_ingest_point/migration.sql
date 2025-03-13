-- AlterTable
ALTER TABLE "Stream" ADD COLUMN     "ingestPointId" TEXT;

-- CreateTable
CREATE TABLE "IngestPoint" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icecastServer" TEXT NOT NULL,
    "icecastMount" TEXT NOT NULL,

    CONSTRAINT "IngestPoint_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Stream" ADD CONSTRAINT "Stream_ingestPointId_fkey" FOREIGN KEY ("ingestPointId") REFERENCES "IngestPoint"("id") ON DELETE SET NULL ON UPDATE CASCADE;
