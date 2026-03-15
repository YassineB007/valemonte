import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🧹 Removing unverified stock images...\n");

    const result = await prisma.productImage.deleteMany({});

    console.log(`✓ Removed ${result.count} images.`);
    console.log("✅ The shop will now use the clean text placeholders.");
}

main()
    .catch((e) => {
        console.error("Error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
