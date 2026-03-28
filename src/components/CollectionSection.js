import styles from "./CollectionSection.module.css";
import Link from "next/link";
import { getCollectionsForCarousel } from "@/lib/cached-queries";
import CollectionCarousel from "./CollectionCarousel";
import { storyblokEditable } from "@storyblok/react/rsc";

export default async function CollectionSection({ blok }) {
    const validCollections = await getCollectionsForCarousel();

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

    return (
        <div {...(blok ? storyblokEditable(blok) : {})}>
            <CollectionCarousel collections={validCollections} />
        </div>
    );
}
