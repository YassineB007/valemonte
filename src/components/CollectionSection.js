import styles from "./CollectionSection.module.css";
import Link from "next/link";
import prisma from "@/lib/prisma";
import CollectionCarousel from "./CollectionCarousel";
import { storyblokEditable } from "@storyblok/react/rsc";

export default async function CollectionSection({ blok }) {
    // Fetch ALL active collections with their top products
    const collections = await prisma.collection.findMany({
        where: { isActive: true },
        orderBy: { createdAt: "asc" },
        include: {
            products: {
                where: { isActive: true },
                include: {
                    category: true,
                    images: { orderBy: { sortOrder: "asc" }, take: 1 },
                },
                orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
                take: 3,
            },
        },
    });

    // Filter out collections that have no products at all
    const validCollections = collections.filter(c => c.products.length > 0);

    // If no collections with products exist, show a tasteful fallback
    if (validCollections.length === 0) {
        return (
            <section id="collection" className={styles.collection} {...(blok ? storyblokEditable(blok) : {})}>
                <div className={styles.emptyState}>
                    <span className={styles.label}>The Collection</span>
                    <h2 className={styles.emptyHeading}>Coming Soon</h2>
                    <p className={styles.emptyText}>
                        Our next collection is being crafted in the atelier. Stay tuned.
                    </p>
                    <Link href="/shop" className={styles.emptyLink}>
                        Browse the Shop →
                    </Link>
                </div>
            </section>
        );
    }

    // Serialize data for the client component (Decimal → string, Date → string)
    const serialized = validCollections.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        season: c.season,
        coverImage: c.coverImage,
        description: c.description,
        products: c.products.map(p => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            description: p.description,
            price: p.price.toString(),
            categoryName: p.category.name,
            imageUrl: p.images[0]?.url || null,
        })),
    }));

    return (
        <div {...(blok ? storyblokEditable(blok) : {})}>
            <CollectionCarousel collections={serialized} />
        </div>
    );
}
