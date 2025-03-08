/*
  Warnings:

  - A unique constraint covering the columns `[filename]` on the table `HlsSegment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "HlsSegment_filename_key" ON "HlsSegment"("filename");
