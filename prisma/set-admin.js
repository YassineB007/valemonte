import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    const email = process.argv[2];

    if (!email) {
        console.error("❌ Please provide an email address:");
        console.error("   node prisma/set-admin.js user@example.com");
        process.exit(1);
    }

    const profile = await prisma.profile.findUnique({ where: { email } });

    if (!profile) {
        console.error(`❌ Profile not found for email: ${email}`);
        process.exit(1);
    }

    await prisma.profile.update({
        where: { email },
        data: { role: "ADMIN" },
    });

    console.log(`✅ Success! ${email} is now an ADMIN.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
