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

    const isCompletelyOutOfStock = variants.length > 0 && variants.every((v) => v.stock === 0);
    const requiresSizeSelection = variants.length > 0 && !selectedSize;
    const isDisabled = isCompletelyOutOfStock || requiresSizeSelection;

    let buttonText = "Add to Bag";
    if (isCompletelyOutOfStock) buttonText = "Out of Stock";
    else if (added) buttonText = "✓ Added";
    else if (requiresSizeSelection) buttonText = "Select a Size";

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
                                {v.size} {v.stock === 0 ? "(Out)" : ""}
                            </button>
                        ))}
                    </div>
                </>
            )}

            <button
                className={`${styles.addBtn} ${added ? styles.addBtnSuccess : ""}`}
                onClick={handleAdd}
                disabled={isDisabled}
                style={isDisabled ? { opacity: 0.5, cursor: "not-allowed" } : {}}
            >
                {buttonText}
            </button>
        </>
    );
}
