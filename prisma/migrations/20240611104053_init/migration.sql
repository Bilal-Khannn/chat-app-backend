/*
  Warnings:

  - You are about to drop the column `displayName` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `User` table. All the data in the column will be lost.
  - Added the required column `display_name` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "displayName",
DROP COLUMN "profilePicture",
ADD COLUMN     "display_name" TEXT NOT NULL,
ADD COLUMN     "profile_picture" TEXT;
