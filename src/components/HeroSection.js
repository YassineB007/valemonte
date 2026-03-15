import Link from "next/link";
import styles from "./HeroSection.module.css";
import { storyblokEditable } from "@storyblok/react/rsc";

export default function HeroSection({ blok }) {
    // If it's used statically without Storyblok, provide dummy data
    const title = blok?.title || "The Quiet Confidence of Mastery.";
    const ctaText = blok?.cta_text || "Explore the Collection";

    return (
        <section className={styles.hero} {...(blok ? storyblokEditable(blok) : {})}>
            <div className={styles.bg}>
                <div className={styles.gradient} />
                <div className={styles.texture} />
            </div>

            <div className={styles.content}>
                <h1 className={styles.heading} dangerouslySetInnerHTML={{ __html: title.replace(/\n/g, "<br />") }} />

                <Link href="/shop" className={styles.cta}>
                    {ctaText}
                </Link>
            </div>
        </section>
    );
}
