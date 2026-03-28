import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProductBySlug } from "@/lib/cached-queries";
import ProductActions from "./ProductActions";
import styles from "./product.module.css";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) return { title: "Product Not Found — Valemonte" };
    return {
        title: `${product.name} — Valemonte`,
        description: product.description || `Shop ${product.name} from Valemonte's luxury Italian menswear collection.`,
    };
}

export const revalidate = 120;

export default async function ProductPage({ params }) {
    const { slug } = await params;

    const product = await getProductBySlug(slug);

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
                        product.images.map((img, i) => (
                            <div key={img.id} className={styles.mainImage}>
                                <Image
                                    src={img.url}
                                    alt={img.alt || product.name}
                                    fill
                                    sizes="(max-width: 900px) 100vw, 50vw"
                                    priority={i === 0}
                                />
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
