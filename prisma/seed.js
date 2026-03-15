import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🌱 Seeding database...\n");

    // ── Categories ──
    const categories = await Promise.all([
        prisma.category.upsert({
            where: { slug: "jackets" },
            update: {},
            create: { name: "Jackets", slug: "jackets", description: "Neapolitan-cut jackets, unstructured blazers, and sport coats.", sortOrder: 1 },
        }),
        prisma.category.upsert({
            where: { slug: "trousers" },
            update: {},
            create: { name: "Trousers", slug: "trousers", description: "High-waisted trousers, pleated dress pants, and casual chinos.", sortOrder: 2 },
        }),
        prisma.category.upsert({
            where: { slug: "shirts" },
            update: {},
            create: { name: "Shirts", slug: "shirts", description: "Hand-cut dress shirts and casual linen shirts.", sortOrder: 3 },
        }),
        prisma.category.upsert({
            where: { slug: "accessories" },
            update: {},
            create: { name: "Accessories", slug: "accessories", description: "Ties, pocket squares, belts, and cufflinks.", sortOrder: 4 },
        }),
    ]);

    const [jackets, trousers, shirts, accessories] = categories;
    console.log("✓ Categories created");

    // ── Collection ──
    const ss26 = await prisma.collection.upsert({
        where: { slug: "ss26" },
        update: {},
        create: {
            name: "Spring/Summer 2026",
            slug: "ss26",
            description: "Inspired by the sun-drenched coasts of Southern Italy. Light fabrics, relaxed silhouettes, and earthy Mediterranean tones.",
            season: "SS26",
            coverImage: "/images/collection/outfit.png",
            isActive: true,
        },
    });
    console.log("✓ Collection created");

    // ── Products ──

    const napoliJacket = await prisma.product.upsert({
        where: { slug: "napoli-jacket" },
        update: {},
        create: {
            name: "Napoli Jacket",
            slug: "napoli-jacket",
            description: "Our signature unstructured Neapolitan jacket. Soft shoulders, patch pockets, and a natural drape that moves with you. Handmade in our Naples atelier.",
            price: 1450.00,
            fabric: "Super 150s Wool — Loro Piana",
            careInfo: "Dry clean only",
            categoryId: jackets.id,
            collectionId: ss26.id,
            isFeatured: true,
        },
    });

    const amalfiTrousers = await prisma.product.upsert({
        where: { slug: "amalfi-trousers" },
        update: {},
        create: {
            name: "Amalfi Trousers",
            slug: "amalfi-trousers",
            description: "High-waisted, single-pleated trousers with a relaxed taper. Side adjusters for a clean waistline. The perfect companion to our Napoli jacket.",
            price: 680.00,
            fabric: "Lightweight Wool Crepe",
            careInfo: "Dry clean only",
            categoryId: trousers.id,
            collectionId: ss26.id,
            isFeatured: true,
        },
    });

    const capriShirt = await prisma.product.upsert({
        where: { slug: "capri-shirt" },
        update: {},
        create: {
            name: "Capri Linen Shirt",
            slug: "capri-shirt",
            description: "A relaxed spread-collar shirt in washed Italian linen. One-piece collar, mother-of-pearl buttons, and a gentle hand feel that improves with every wear.",
            price: 420.00,
            fabric: "100% Italian Linen — Albini",
            careInfo: "Machine wash cold, hang dry",
            categoryId: shirts.id,
            collectionId: ss26.id,
            isFeatured: true,
        },
    });

    const sorrentinoJacket = await prisma.product.upsert({
        where: { slug: "sorrentino-blazer" },
        update: {},
        create: {
            name: "Sorrentino Blazer",
            slug: "sorrentino-blazer",
            description: "A half-lined summer blazer in breathable hopsack weave. Notch lapels, two-button closure, and a slightly shorter cut for effortless summer styling.",
            price: 1280.00,
            fabric: "Cotton-Linen Hopsack",
            careInfo: "Dry clean only",
            categoryId: jackets.id,
            collectionId: ss26.id,
        },
    });

    const vesuvioTrousers = await prisma.product.upsert({
        where: { slug: "vesuvio-chinos" },
        update: {},
        create: {
            name: "Vesuvio Chinos",
            slug: "vesuvio-chinos",
            description: "Garment-dyed cotton chinos with a slim taper. Soft hand feel, flat front, and a subtle vintage wash. Perfect from the office to the aperitivo.",
            price: 380.00,
            fabric: "Garment-Dyed Cotton Twill",
            careInfo: "Machine wash cold",
            categoryId: trousers.id,
            collectionId: ss26.id,
        },
    });

    const silkTie = await prisma.product.upsert({
        where: { slug: "positano-silk-tie" },
        update: {},
        create: {
            name: "Positano Silk Tie",
            slug: "positano-silk-tie",
            description: "Seven-fold silk tie, handmade in our Naples workshop. Self-tipped and unlined for a luxurious drape. A subtle micro-pattern in deep navy.",
            price: 195.00,
            fabric: "100% Printed Silk",
            careInfo: "Dry clean only",
            categoryId: accessories.id,
            collectionId: ss26.id,
        },
    });

    const pocketSquare = await prisma.product.upsert({
        where: { slug: "ravello-pocket-square" },
        update: {},
        create: {
            name: "Ravello Pocket Square",
            slug: "ravello-pocket-square",
            description: "Hand-rolled edges on fine Italian silk. A rich cream base with a subtle geometric border. The finishing touch for any jacket.",
            price: 95.00,
            fabric: "100% Silk Twill",
            careInfo: "Dry clean only",
            categoryId: accessories.id,
            collectionId: ss26.id,
        },
    });

    const dressShirt = await prisma.product.upsert({
        where: { slug: "roma-dress-shirt" },
        update: {},
        create: {
            name: "Roma Dress Shirt",
            slug: "roma-dress-shirt",
            description: "A structured cutaway-collar dress shirt in crisp Thomas Mason poplin. French cuffs, hand-sewn buttonholes, and a fitted silhouette.",
            price: 490.00,
            fabric: "Thomas Mason Royal Oxford",
            careInfo: "Machine wash cold, iron while damp",
            categoryId: shirts.id,
            collectionId: ss26.id,
        },
    });

    console.log("✓ Products created");

    // ── Product Variants (sizes) ──
    const sizes = ["46", "48", "50", "52", "54", "56"];
    const products = [napoliJacket, amalfiTrousers, capriShirt, sorrentinoJacket, vesuvioTrousers, dressShirt];

    for (const product of products) {
        for (const size of sizes) {
            const sku = `${product.slug}-${size}`.toUpperCase().replace(/-/g, "_");
            await prisma.productVariant.upsert({
                where: { sku },
                update: {},
                create: {
                    productId: product.id,
                    size,
                    sku,
                    stock: Math.floor(Math.random() * 10) + 2,
                },
            });
        }
    }

    // Accessories get "One Size"
    for (const product of [silkTie, pocketSquare]) {
        const sku = `${product.slug}-OS`.toUpperCase().replace(/-/g, "_");
        await prisma.productVariant.upsert({
            where: { sku },
            update: {},
            create: {
                productId: product.id,
                size: "One Size",
                sku,
                stock: Math.floor(Math.random() * 20) + 5,
            },
        });
    }
    console.log("✓ Variants created");

    // ── Outfits ──
    const mediterranean = await prisma.outfit.upsert({
        where: { slug: "the-mediterranean" },
        update: {},
        create: {
            name: "The Mediterranean",
            slug: "the-mediterranean",
            description: "Our signature summer look. The Napoli jacket paired with Amalfi trousers and a Capri linen shirt — effortless Italian elegance.",
            collectionId: ss26.id,
            coverImage: "/images/collection/outfit.png",
        },
    });

    const businessman = await prisma.outfit.upsert({
        where: { slug: "the-riviera" },
        update: {},
        create: {
            name: "The Riviera",
            slug: "the-riviera",
            description: "A refined summer combination. The Sorrentino blazer over Vesuvio chinos with a Roma dress shirt — from boardroom to coastal dinner.",
            collectionId: ss26.id,
        },
    });

    // Outfit Items
    const outfitItems = [
        { outfitId: mediterranean.id, productId: napoliJacket.id, sortOrder: 1 },
        { outfitId: mediterranean.id, productId: amalfiTrousers.id, sortOrder: 2 },
        { outfitId: mediterranean.id, productId: capriShirt.id, sortOrder: 3 },
        { outfitId: businessman.id, productId: sorrentinoJacket.id, sortOrder: 1 },
        { outfitId: businessman.id, productId: vesuvioTrousers.id, sortOrder: 2 },
        { outfitId: businessman.id, productId: dressShirt.id, sortOrder: 3 },
    ];

    for (const item of outfitItems) {
        await prisma.outfitItem.upsert({
            where: { outfitId_productId: { outfitId: item.outfitId, productId: item.productId } },
            update: {},
            create: item,
        });
    }
    console.log("✓ Outfits created");

    console.log("\n✅ Seed complete!");
}

main()
    .catch((e) => {
        console.error("Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
