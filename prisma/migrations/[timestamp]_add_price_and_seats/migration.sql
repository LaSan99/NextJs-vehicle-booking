-- First add the columns as nullable
ALTER TABLE "Vehicle" ADD COLUMN "pricePerDay" FLOAT;
ALTER TABLE "Vehicle" ADD COLUMN "seatCount" INTEGER;

-- Update existing records with default values
UPDATE "Vehicle" SET 
  "pricePerDay" = 45.00,
  "seatCount" = 5
WHERE "pricePerDay" IS NULL OR "seatCount" IS NULL;

-- Now make the columns required
ALTER TABLE "Vehicle" ALTER COLUMN "pricePerDay" SET NOT NULL;
ALTER TABLE "Vehicle" ALTER COLUMN "seatCount" SET NOT NULL; 