import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductActions from "./ProductActions";
import styles from "./product.module.css";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) return { title: "Product Not Found — Valemonte" };
    return {
        title: `${product.name} — Valemonte`,
        description: product.description || `Shop ${product.name} from Valemonte's luxury Italian menswear collection.`,
    };
}

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }) {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
        where: { slug },
        include: {
            category: true,
            collection: true,
            images: { orderBy: { sortOrder: "asc" } },
            variants: { orderBy: { size: "asc" } },
        },
    });

    if (!product) notFound();

    // Serialize for client component
    const serializedVariants = product.variants.map((v) => ({
        id: v.id,
        size: v.size,
        stock: v.stock,
    }));

    const serializedProduct = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: Number(product.price),
        imageUrl: product.images[0]?.url || null,
    };

    return (
        <>
        <Navbar />
        <div className={styles.page}>
            <Link href="/shop" className={styles.backLink}>
                ← Back to Shop
            </Link>

            <div className={styles.layout}>
                {/* Gallery */}
                <div className={styles.gallery}>
                    {product.images.length > 0 ? (
                        product.images.map((img) => (
                            <div key={img.id} className={styles.mainImage}>
                                <img src={img.url} alt={img.alt || product.name} />
                            </div>
                        ))
                    ) : (
                        <div className={styles.imagePlaceholder}>
                            {product.category.name}
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className={styles.details}>
                    <Link href={`/shop?category=${product.category.slug}`} className={styles.category}>
                        {product.category.name}
                    </Link>
                    <h1 className={styles.name}>{product.name}</h1>
                    <p className={styles.price}>
                        €{Number(product.price).toLocaleString("en-US", { minimumFractionDigits: 0 })}
                    </p>

                    <div className={styles.divider} />

                    {product.description && (
                        <p className={styles.description}>{product.description}</p>
                    )}

                    <ProductActions variants={serializedVariants} product={serializedProduct} />

                    {/* Meta */}
                    <div className={styles.divider} />
                    <div className={styles.meta}>
                        {product.fabric && (
                            <div className={styles.metaRow}>
                                <span className={styles.metaLabel}>Fabric</span>
                                <span className={styles.metaValue}>{product.fabric}</span>
                            </div>
                        )}
                        {product.careInfo && (
                            <div className={styles.metaRow}>
                                <span className={styles.metaLabel}>Care</span>
                                <span className={styles.metaValue}>{product.careInfo}</span>
                            </div>
                        )}
                        {product.collection && (
                            <div className={styles.metaRow}>
                                <span className={styles.metaLabel}>Collection</span>
                                <Link
                                    href={`/collections/${product.collection.slug}`}
                                    className={styles.metaValue}
                                    style={{ color: "var(--clr-gold-muted)", textDecoration: "none" }}
                                >
                                    {product.collection.name}
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        <Footer />
        </>
    );
}
