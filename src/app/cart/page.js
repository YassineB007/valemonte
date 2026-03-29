"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Main from "@/components/Main";
import styles from "./cart.module.css";

export default function CartPage() {
    const { items, itemCount, total, removeItem, updateQuantity, loaded } = useCart();

    if (!loaded) {
        return (
            <>
                <Navbar />
                <Main className={styles.page}>
                    <div className={styles.container}>
                        <div className={styles.header}>
                            <h1 className={styles.heading}>Your Bag</h1>
                        </div>
                    </div>
                </Main>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <Main className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.header}>
                        <h1 className={styles.heading}>Your Bag</h1>
                        <p className={styles.subtitle}>
                            {itemCount === 0
                                ? "Your bag is empty"
                                : `${itemCount} item${itemCount > 1 ? "s" : ""}`}
                        </p>
                    </div>

                    {items.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>👜</div>
                            <p className={styles.emptyText}>
                                Your bag is waiting to be filled with beautiful things.
                            </p>
                            <Link href="/shop" className={styles.shopLink}>
                                Continue Shopping
                            </Link>
                        </div>
                    ) : (
                        <>
                            <div className={styles.items}>
                                {items.map((item) => (
                                    <div key={item.variantId} className={styles.item}>
                                        {item.imageUrl ? (
                                            <div className={styles.itemImageWrap}>
                                                <Image
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    fill
                                                    sizes="100px"
                                                    className={styles.itemImage}
                                                />
                                            </div>
                                        ) : (
                                            <div className={styles.itemImagePlaceholder}>
                                                No img
                                            </div>
                                        )}

                                        <div className={styles.itemDetails}>
                                            <Link
                                                href={`/shop/${item.slug}`}
                                                className={styles.itemName}
                                            >
                                                {item.name}
                                            </Link>
                                            <span className={styles.itemSize}>
                                                Size: {item.size}
                                            </span>
                                            <span className={styles.itemPrice}>
                                                €{item.price.toLocaleString("en-US", { minimumFractionDigits: 0 })}
                                            </span>

                                            <div className={styles.itemActions}>
                                                <button
                                                    type="button"
                                                    className={styles.qtyBtn}
                                                    onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                                                    aria-label={`Decrease quantity of ${item.name}`}
                                                >
                                                    −
                                                </button>
                                                <span className={styles.qtyValue}>
                                                    {item.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    className={styles.qtyBtn}
                                                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                                    aria-label={`Increase quantity of ${item.name}`}
                                                >
                                                    +
                                                </button>

                                                <button
                                                    type="button"
                                                    className={styles.removeBtn}
                                                    onClick={() => removeItem(item.variantId)}
                                                    aria-label={`Remove ${item.name} from bag`}
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={styles.summary}>
                                <div className={styles.summaryRow}>
                                    <span className={styles.summaryLabel}>Total</span>
                                    <span className={styles.summaryValue}>
                                        €{total.toLocaleString("en-US", { minimumFractionDigits: 0 })}
                                    </span>
                                </div>

                                <Link href="/checkout" className={styles.checkoutBtn} style={{ textAlign: "center", textDecoration: "none", display: "inline-block" }}>
                                    Proceed to Checkout
                                </Link>

                                <Link href="/shop" className={styles.continueShopping}>
                                    ← Continue Shopping
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </Main>
            <Footer />
        </>
    );
}
