/*
  Warnings:

  - A unique constraint covering the columns `[controlPort]` on the table `Stream` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Stream" ADD COLUMN     "controlPort" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Stream_controlPort_key" ON "Stream"("controlPort");
