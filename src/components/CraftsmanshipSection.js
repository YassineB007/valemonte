import styles from "./CraftsmanshipSection.module.css";
import Image from "next/image";

function CraftsmanshipRow({ label, heading, body, reversed, imageSrc, imageAlt }) {
    return (
        <div className={`${styles.row} ${reversed ? styles.reversed : ""}`}>
            <div className={styles.visual}>
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    className={styles.craftImg}
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>

            <div className={styles.text}>
                <span className={styles.label}>{label}</span>
                <h2 className={styles.heading}>{heading}</h2>
                <p className={styles.body}>{body}</p>
            </div>
        </div>
    );
}

import { storyblokEditable } from "@storyblok/react/rsc";

export default function CraftsmanshipSection({ blok }) {
    const row1Label = blok?.row1_label || "Craftsmanship";
    const row1Heading = blok?.row1_heading || "Handmade in Italy.";
    const row1Body = blok?.row1_body || "Third-generation tailors in our Naples atelier craft each garment through 220 individual steps. Fine fabrics meet extraordinary precision — every stitch carries the weight of tradition.";
    
    // For images, we try to use blok.row1_image?.filename from Storyblok, falling back to static
    const row1Img = blok?.row1_image?.filename || "/images/craft/hands.png";

    const row2Label = blok?.row2_label || "Detail";
    const row2Heading = blok?.row2_heading || "The Art of Detail.";
    const row2Body = blok?.row2_body || "From the roll of a lapel to the fall of a trouser break, every element is considered. True luxury lives in the details that only the wearer knows are there.";
    const row2Img = blok?.row2_image?.filename || "/images/craft/needle.png";

    return (
        <section id="craftsmanship" className={styles.craft} {...(blok ? storyblokEditable(blok) : {})}>
            <CraftsmanshipRow
                label={row1Label}
                heading={row1Heading}
                body={row1Body}
                imageSrc={row1Img}
                imageAlt="Master tailor measuring fabric"
            />

            <CraftsmanshipRow
                label={row2Label}
                heading={row2Heading}
                body={row2Body}
                reversed
                imageSrc={row2Img}
                imageAlt="Close up of bespoke suit stitching"
            />
        </section>
    );
}
