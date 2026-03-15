import styles from "./PhilosophySection.module.css";
import { storyblokEditable } from "@storyblok/react/rsc";

export default function PhilosophySection({ blok }) {
    const label = blok?.label || "Our Philosophy";
    const quote = blok?.quote || "True style doesn't shout. It's found in the impeccable stitch, the drape of fine wool, and the feeling of knowing you've arrived. Valemonte is for the man who understands that excellence is in the details.";

    return (
        <section id="philosophy" className={styles.philosophy} {...(blok ? storyblokEditable(blok) : {})}>
            <div className={styles.inner}>
                <span className={styles.label}>{label}</span>
                <p className={styles.quote}>{quote}</p>
            </div>
        </section>
    );
}
