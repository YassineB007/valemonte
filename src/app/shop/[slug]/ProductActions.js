"use client";

import { useState } from "react";
import { useCart } from "@/components/CartContext";
import styles from "./product.module.css";

export default function ProductActions({ variants, product }) {
    const [selectedSize, setSelectedSize] = useState(null);
    const [added, setAdded] = useState(false);
    const { addItem } = useCart();

    const handleAdd = () => {
        if (!selectedSize && variants.length > 0) return;

        const variant = variants.find((v) => v.id === selectedSize);

        addItem({
            id: product.id,
            variantId: selectedSize || product.id,
            name: product.name,
            slug: product.slug,
            size: variant?.size || "One Size",
            price: product.price,
            imageUrl: product.imageUrl,
        });

        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    return (
        <>
            {variants.length > 0 && (
                <>
                    <p className={styles.sectionLabel}>Size</p>
                    <div className={styles.sizes}>
                        {variants.map((v) => (
                            <button
                                key={v.id}
                                className={`${styles.sizeBtn} ${v.stock === 0 ? styles.sizeBtnOut : ""} ${selectedSize === v.id ? styles.sizeBtnActive : ""}`}
                                disabled={v.stock === 0}
                                onClick={() => setSelectedSize(v.id)}
                            >
                                {v.size}
                            </button>
                        ))}
                    </div>
                </>
            )}

            <button
                className={`${styles.addBtn} ${added ? styles.addBtnSuccess : ""}`}
                onClick={handleAdd}
                disabled={variants.length > 0 && !selectedSize}
                style={variants.length > 0 && !selectedSize ? { opacity: 0.5, cursor: "not-allowed" } : {}}
            >
                {added ? "✓ Added to Bag" : variants.length > 0 && !selectedSize ? "Select a Size" : "Add to Bag"}
            </button>
        </>
    );
}
