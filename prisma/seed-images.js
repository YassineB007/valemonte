import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// High-quality Unsplash product images (free to use)
const productImages = {
    "napoli-jacket": [
        { url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80", alt: "Napoli Jacket — front view" },
        { url: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=80", alt: "Napoli Jacket — detail" },
    ],
    "amalfi-trousers": [
        { url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80", alt: "Amalfi Trousers — front view" },
        { url: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80", alt: "Amalfi Trousers — detail" },
    ],
    "capri-shirt": [
        { url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80", alt: "Capri Linen Shirt — front view" },
        { url: "https://images.unsplash.com/photo-1598033129183-c4f50c736c10?w=800&q=80", alt: "Capri Linen Shirt — detail" },
    ],
    "sorrentino-blazer": [
        { url: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80", alt: "Sorrentino Blazer — front view" },
        { url: "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=800&q=80", alt: "Sorrentino Blazer — detail" },
    ],
    "vesuvio-chinos": [
        { url: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80", alt: "Vesuvio Chinos — front view" },
        { url: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80", alt: "Vesuvio Chinos — detail" },
    ],
    "positano-silk-tie": [
        { url: "https://images.unsplash.com/photo-1589756823695-278bc923a348?w=800&q=80", alt: "Positano Silk Tie" },
        { url: "https://images.unsplash.com/photo-1598971861713-54ad09c93e3c?w=800&q=80", alt: "Positano Silk Tie — detail" },
    ],
    "ravello-pocket-square": [
        { url: "https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=800&q=80", alt: "Ravello Pocket Square" },
    ],
    "roma-dress-shirt": [
        { url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80", alt: "Roma Dress Shirt — front view" },
        { url: "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&q=80", alt: "Roma Dress Shirt — detail" },
    ],
};

async function main() {
    console.log("🖼️  Adding product images...\n");

    for (const [slug, images] of Object.entries(productImages)) {
        const product = await prisma.product.findUnique({ where: { slug } });
        if (!product) {
            console.log(`⚠ Product "${slug}" not found, skipping`);
            continue;
        }

        // Delete existing images for this product
        await prisma.productImage.deleteMany({ where: { productId: product.id } });

        // Add new images
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

        console.log(`✓ ${product.name} — ${images.length} image(s)`);
    }

    console.log("\n✅ All product images added!");
}

main()
    .catch((e) => {
        console.error("Error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
