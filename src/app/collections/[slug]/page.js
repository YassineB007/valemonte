import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCollectionBySlug } from "@/lib/cached-queries";
import styles from "../collections.module.css";

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const col = await getCollectionBySlug(slug);
    if (!col) return { title: "Collection Not Found — Valemonte" };
    return {
        title: `${col.name} — Valemonte`,
        description: col.description || `Explore the ${col.name} collection from Valemonte.`,
    };
}

export const revalidate = 120;

export default async function CollectionPage({ params }) {
    const { slug } = await params;

    const collection = await getCollectionBySlug(slug);

    if (!collection) notFound();

    return (
        <>
        <Navbar />
        <div className={styles.page}>
            <Link href="/collections" className={styles.backLink}>
                ← All Collections
            </Link>

            <div className={styles.collectionHeader}>
                {collection.season && (
                    <p className={styles.collectionSeason}>{collection.season}</p>
                )}
                <h1 className={styles.collectionName}>{collection.name}</h1>
                {collection.description && (
                    <p className={styles.collectionDesc}>{collection.description}</p>
                )}
            </div>


            {/* Products */}
            <h2 className={styles.sectionTitle}>
                All Products ({collection.products.length})
            </h2>
            <div className={styles.productGrid}>
                {collection.products.map((product) => (
                    <Link
                        key={product.id}
                        href={`/shop/${product.slug}`}
                        className={styles.productCard}
                    >
                        <div className={styles.productImageWrap}>
                            {product.images[0] ? (
                                <Image
                                    src={product.images[0].url}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 280px"
                                    style={{ objectFit: "cover" }}
                                />
                            ) : (
                                product.category.name
                            )}
                        </div>
                        <h3 className={styles.productName}>{product.name}</h3>
                        <p className={styles.productPrice}>
                            €{Number(product.price).toLocaleString("en-US", { minimumFractionDigits: 0 })}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
        <Footer />
        </>
    );
}
