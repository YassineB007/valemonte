import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCollectionsList } from "@/lib/cached-queries";
import styles from "./collections.module.css";

export const metadata = {
    title: "Collections — Valemonte",
    description: "Explore Valemonte's seasonal collections of luxury Italian menswear.",
};

export const revalidate = 120;

export default async function CollectionsPage() {
    const collections = await getCollectionsList();

    return (
        <>
        <Navbar />
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.heading}>Collections</h1>
                <p className={styles.subtitle}>
                    Seasonal collections inspired by the art, coast, and culture of Italy
                </p>
            </div>

            {collections.length === 0 ? (
                <p className={styles.emptyState}>No collections yet</p>
            ) : (
                <div className={styles.grid}>
                    {collections.map((col) => (
                        <Link
                            key={col.id}
                            href={`/collections/${col.slug}`}
                            className={styles.card}
                        >
                            {col.coverImage ? (
                                <Image
                                    className={styles.cardImage}
                                    src={col.coverImage}
                                    alt={col.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 420px"
                                />
                            ) : (
                                <div className={styles.cardPlaceholder} />
                            )}
                            <div className={styles.cardOverlay}>
                                {col.season && (
                                    <span className={styles.cardSeason}>{col.season}</span>
                                )}
                                <h2 className={styles.cardName}>{col.name}</h2>
                                {col.description && (
                                    <p className={styles.cardDescription}>{col.description}</p>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
        <Footer />
        </>
    );
}
