/*
  Warnings:

  - A unique constraint covering the columns `[reference]` on the table `families` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reference]` on the table `subfamilies` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `reference` to the `families` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference` to the `subfamilies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."families" ADD COLUMN     "reference" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."subfamilies" ADD COLUMN     "reference" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "families_reference_key" ON "public"."families"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "subfamilies_reference_key" ON "public"."subfamilies"("reference");
