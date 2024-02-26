/*
  Warnings:

  - You are about to alter the column `editLevel` on the `girl` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `girl` MODIFY `editLevel` ENUM('Nulo', 'Leve', 'Editado') NOT NULL;
