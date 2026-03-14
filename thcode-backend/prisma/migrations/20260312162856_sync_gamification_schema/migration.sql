/*
  Warnings:

  - A unique constraint covering the columns `[nickname]` on the table `IdCard` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nickname` to the `IdCard` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IdCard" ADD COLUMN     "nickname" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "IdCard_nickname_key" ON "IdCard"("nickname");
