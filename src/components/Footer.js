import Link from "next/link";
import styles from "./Footer.module.css";

const COLUMNS = [
    {
        title: "Shop",
        items: [
            { label: "Jackets", href: "/shop?category=jackets" },
            { label: "Shirts", href: "/shop?category=shirts" },
            { label: "Trousers", href: "/shop?category=trousers" },
            { label: "Accessories", href: "/shop?category=accessories" },
        ],
    },
    {
        title: "House",
        items: [
            { label: "Collections", href: "/collections" },
            { label: "Our Story", href: "/#philosophy" },
            { label: "Craftsmanship", href: "/#craftsmanship" },
        ],
    },
    {
        title: "Support",
        items: [
            { label: "My Account", href: "/account" },
            { label: "Contact", href: "mailto:hello@valemonte.com" },
        ],
    },
];

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <h2 className="sr-only">Site footer</h2>
                <div className={styles.grid}>
                    <div>
                        <p className={styles.brand}>Valemonte</p>
                        <p className={styles.tagline}>
                            Italian luxury menswear,
                            <br />
                            handcrafted in Naples since 1962.
                        </p>
                    </div>

                    {COLUMNS.map((col) => (
                        <nav key={col.title} aria-labelledby={`footer-${col.title}`}>
                            <h3 id={`footer-${col.title}`} className={styles.colTitle}>
                                {col.title}
                            </h3>
                            <ul className={styles.list}>
                                {col.items.map((item) => (
                                    <li key={item.label}>
                                        <Link href={item.href} className={styles.link}>{item.label}</Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    ))}
                </div>

                <div className={styles.bottom}>
                    <p className={styles.copyright}>&copy; 2026 Valemonte. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
