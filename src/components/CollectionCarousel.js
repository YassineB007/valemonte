"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./CollectionSection.module.css";

export default function CollectionCarousel({ collections }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const total = collections.length;
    const collection = collections[activeIndex];

    const goTo = useCallback((newIndex) => {
        if (isTransitioning) return;
        setIsTransitioning(true);
        // Small delay for the fade-out/fade-in transition
        setTimeout(() => {
            setActiveIndex(newIndex);
            setTimeout(() => setIsTransitioning(false), 50);
        }, 300);
    }, [isTransitioning]);

    const goPrev = () => goTo((activeIndex - 1 + total) % total);
    const goNext = () => goTo((activeIndex + 1) % total);

    const seasonLabel = collection.season
        ? `${collection.season} Collection`
        : collection.name;

    return (
        <section id="collection" className={styles.collection}>
            <div className={styles.grid}>
                {/* Left — collection cover image */}
                <div className={styles.outfit}>
                    <div
                        className={`${styles.outfitInner} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}
                    >
                        {collection.coverImage ? (
                            <Image
                                src={collection.coverImage}
                                alt={`${collection.name} collection`}
                                className={styles.outfitImg}
                                fill
                                sizes="(max-width: 900px) 100vw, 45vw"
                                priority={activeIndex === 0}
                            />
                        ) : collection.products[0]?.imageUrl ? (
                            <Image
                                src={collection.products[0].imageUrl}
                                alt={collection.products[0].name}
                                className={styles.outfitImg}
                                fill
                                sizes="(max-width: 900px) 100vw, 45vw"
                                priority={activeIndex === 0}
                            />
                        ) : (
                            <div className={styles.outfitPlaceholder}>
                                <span className={styles.outfitPlaceholderText}>{collection.name}</span>
                            </div>
                        )}
                    </div>

                    <div className={styles.outfitGradient} />
                    <div className={styles.monogram}>
                        <span className={styles.seasonLabel}>{seasonLabel}</span>
                    </div>

                    {/* Navigation Arrows (only show if > 1 collection) */}
                    {total > 1 && (
                        <div className={styles.arrows}>
                            <button
                                className={styles.arrowBtn}
                                onClick={goPrev}
                                aria-label="Previous collection"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M15 18l-6-6 6-6" />
                                </svg>
                            </button>
                            <button
                                className={styles.arrowBtn}
                                onClick={goNext}
                                aria-label="Next collection"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </button>
                        </div>
                    )}

                    {/* Dot indicators */}
                    {total > 1 && (
                        <div className={styles.dots}>
                            {collections.map((_, i) => (
                                <button
                                    key={i}
                                    className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ""}`}
                                    onClick={() => goTo(i)}
                                    aria-label={`Go to collection ${i + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Right — product pieces from the active collection */}
                <div className={styles.pieces}>
                    <span className={styles.label}>The Collection</span>

                    <div
                        className={`${styles.list} ${isTransitioning ? styles.fadeOut : styles.fadeIn}`}
                    >
                        {collection.products.map((product, i) => (
                            <Link
                                key={product.id}
                                href={`/shop/${product.slug}`}
                                className={styles.item}
                            >
                                <div className={styles.swatch}>
                                    {product.imageUrl ? (
                                        <Image
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className={styles.swatchImg}
                                            fill
                                            sizes="90px"
                                        />
                                    ) : (
                                        <div className={styles.swatchPlaceholder}>
                                            {product.categoryName}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h3 className={styles.name}>{product.name}</h3>
                                    <p className={styles.desc}>
                                        {product.description
                                            ? product.description.length > 40
                                                ? product.description.slice(0, 40) + "…"
                                                : product.description
                                            : product.categoryName}
                                    </p>
                                    <span className={styles.cta}>Shop Now →</span>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Link to full collection page */}
                    <Link
                        href={`/collections/${collection.slug}`}
                        className={styles.viewAll}
                        key={collection.slug}
                    >
                        View Full Collection →
                    </Link>
                </div>
            </div>
        </section>
    );
}
