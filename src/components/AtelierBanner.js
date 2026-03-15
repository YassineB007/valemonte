import Link from "next/link";
import styles from "./AtelierBanner.module.css";
import { storyblokEditable } from "@storyblok/react/rsc";

export default function AtelierBanner({ blok }) {
    const label = blok?.label || "Visit Us";
    const heading = blok?.heading || "The Atelier";
    const body = blok?.body || "Step inside our Naples workshop, where generations of craft converge with modern design.";
    const ctaText = blok?.cta_text || "Explore Collections";
    const ctaLink = blok?.cta_link?.url || "/collections";

    return (
        <section className={styles.atelier} {...(blok ? storyblokEditable(blok) : {})}>
            <div className={styles.pattern} />

            <div className={styles.content}>
                <span className={styles.label}>{label}</span>
                <h2 className={styles.heading}>{heading}</h2>
                <p className={styles.body}>{body}</p>
                <Link href={ctaLink} className={styles.cta}>
                    {ctaText}
                </Link>
            </div>
        </section>
    );
}
