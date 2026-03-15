"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "./CartContext";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
    { label: "Shop", href: "/shop" },
    { label: "Collections", href: "/collections" },
    { label: "Account", href: "/account" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const { itemCount } = useCart();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <>
        <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
            <div className={styles.inner}>
                {/* Left links */}
                <div className={styles.links}>
                    <Link href="/shop" className={styles.link}>Shop</Link>
                    <Link href="/collections" className={styles.link}>Collections</Link>
                </div>

                {/* Center logo */}
                <Link href="/" className={styles.logo}>
                    Valemonte
                </Link>

                {/* Right links */}
                <div className={styles.links}>
                    <Link href="/cart" className={styles.link}>
                        Bag{itemCount > 0 ? ` (${itemCount})` : ""}
                    </Link>
                    <Link href="/account" className={styles.iconBtn} aria-label="Account">
                        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M20 21a8 8 0 0 0-16 0" />
                        </svg>
                    </Link>
                </div>

                {/* Mobile toggle */}
                <button className={styles.mobileBtn} aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)}>
                    {menuOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <line x1="4" y1="4" x2="20" y2="20" />
                            <line x1="20" y1="4" x2="4" y2="20" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <line x1="0" y1="7" x2="24" y2="7" />
                            <line x1="0" y1="17" x2="24" y2="17" />
                        </svg>
                    )}
                </button>
            </div>
        </nav>

        {/* Mobile menu overlay */}
        {menuOpen && (
            <div className={styles.mobileMenu}>
                <div className={styles.mobileMenuInner}>
                    {NAV_LINKS.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={styles.mobileLink}
                            onClick={() => setMenuOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                    <Link
                        href="/cart"
                        className={styles.mobileLink}
                        onClick={() => setMenuOpen(false)}
                    >
                        Bag{itemCount > 0 ? ` (${itemCount})` : ""}
                    </Link>
                </div>
            </div>
        )}
        </>
    );
}
