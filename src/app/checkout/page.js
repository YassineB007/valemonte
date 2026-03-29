"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { processCheckout } from "./actions";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Main from "@/components/Main";
import styles from "./checkout.module.css";

export default function CheckoutPage() {
    const { items, total, clearCart, loaded } = useCart();
    const [status, setStatus] = useState("idle");
    const [errorMsg, setErrorMsg] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (items.length === 0) {
            setErrorMsg("Your cart is empty.");
            return;
        }

        setStatus("loading");
        setErrorMsg(null);
        
        const form = e.target;
        const formData = new FormData(form);

        const result = await processCheckout(formData, items, total);
        
        if (result.error) {
            setErrorMsg(result.error);
            setStatus("idle");
        } else if (result.success) {
            clearCart();
            setStatus("success");
        }
    };

    if (!loaded) return null;

    if (status === "success") {
        return (
            <>
                <Navbar />
                <Main className={styles.page}>
                    <div className={styles.container}>
                        <div className={styles.successState}>
                            <div className={styles.successIcon}>✓</div>
                            <h1 className={styles.heading}>Order Received</h1>
                            <p className={styles.successText}>
                                Thank you for your purchase. We have received your order and will begin processing it shortly.
                                <br/><br/>
                                <i>(Since this is a trial checkout, no payment was required, but the order has been created in the database and is visible to administrators.)</i>
                            </p>
                            <Link href="/shop" className={styles.submitBtn} style={{ display: "inline-block", textDecoration: "none" }}>
                                Return to Shop
                            </Link>
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
                        <h1 className={styles.heading}>Checkout</h1>
                        <p className={styles.subtitle}>
                            (Mock Trial - No Payment Required)
                        </p>
                    </div>

                    {errorMsg && <div className={styles.note} style={{ borderColor: "#e57373" }}>{errorMsg}</div>}

                    {items.length === 0 ? (
                        <div className={styles.note}>
                            Your bag is empty. <Link href="/shop" style={{ color: "var(--clr-gold-muted)" }}>Go shopping.</Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <h2 className={styles.subtitle} style={{ marginBottom: "12px", borderBottom: "1px solid var(--clr-cream-ghost)", paddingBottom: "12px" }}>Shipping Details</h2>
                            
                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="checkout-name">Full Name *</label>
                                <input id="checkout-name" name="name" type="text" className={styles.input} required autoComplete="name" />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="checkout-email">Email Address *</label>
                                <input id="checkout-email" name="email" type="email" className={styles.input} required autoComplete="email" />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label} htmlFor="checkout-address1">Address Line 1 *</label>
                                <input id="checkout-address1" name="addressLine1" type="text" className={styles.input} required autoComplete="address-line1" />
                            </div>

                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label} htmlFor="checkout-city">City *</label>
                                    <input id="checkout-city" name="addressCity" type="text" className={styles.input} required autoComplete="address-level2" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label} htmlFor="checkout-state">State/Province</label>
                                    <input id="checkout-state" name="addressState" type="text" className={styles.input} autoComplete="address-level1" />
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label} htmlFor="checkout-zip">Postal Code *</label>
                                    <input id="checkout-zip" name="addressZip" type="text" className={styles.input} required autoComplete="postal-code" />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label} htmlFor="checkout-country">Country *</label>
                                    <input id="checkout-country" name="addressCountry" type="text" className={styles.input} defaultValue="IT" required autoComplete="country-name" />
                                </div>
                            </div>

                            <div className={styles.note} style={{ marginTop: "24px" }}>
                                <strong>Order Summary:</strong><br/>
                                {items.length} items total<br/>
                                <br/>
                                <strong>Total Amount: €{total.toLocaleString("en-US", { minimumFractionDigits: 0 })}</strong>
                            </div>

                            <button type="submit" className={styles.submitBtn} disabled={status === "loading"}>
                                {status === "loading" ? "Processing..." : "Place Order (Trial)"}
                            </button>
                        </form>
                    )}
                </div>
            </Main>
            <Footer />
        </>
    );
}
