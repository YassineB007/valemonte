import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Fixed images for products that had bad photos
const fixes = {
    "positano-silk-tie": [
        { url: "https://images.unsplash.com/photo-1590548784585-643d2b9f2925?w=800&q=80", alt: "Positano Silk Tie — navy silk" },
        { url: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800&q=80", alt: "Positano Silk Tie — detail" },
    ],
    "vesuvio-chinos": [
        { url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80", alt: "Vesuvio Chinos — cotton twill" },
        { url: "https://images.unsplash.com/photo-1610652492500-ded49ceeb378?w=800&q=80", alt: "Vesuvio Chinos — detail" },
    ],
    "amalfi-trousers": [
        { url: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&q=80", alt: "Amalfi Trousers — wool crepe" },
        { url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80", alt: "Amalfi Trousers — tailored fit" },
    ],
};

async function main() {
    console.log("🔄 Fixing product images...\n");

    for (const [slug, images] of Object.entries(fixes)) {
        const product = await prisma.product.findUnique({ where: { slug } });
        if (!product) {
            console.log(`⚠ Product "${slug}" not found`);
            continue;
        }

        await prisma.productImage.deleteMany({ where: { productId: product.id } });

        for (let i = 0; i < images.length; i++) {
            await prisma.productImage.create({
                data: {
                    productId: product.id,
                    url: images[i].url,
                    alt: images[i].alt,
                    sortOrder: i,
                },
            });
        }
        console.log(`✓ Fixed ${product.name}`);
    }

    console.log("\n✅ Images fixed!");
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
