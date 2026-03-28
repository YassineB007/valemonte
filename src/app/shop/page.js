import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getShopCategories, getShopProducts } from "@/lib/cached-queries";
import styles from "./shop.module.css";

export const metadata = {
    title: "Shop — Valemonte",
    description: "Browse our collection of luxury Italian menswear. Handcrafted jackets, trousers, shirts, and accessories.",
};

export const revalidate = 120;

export default async function ShopPage({ searchParams }) {
    const params = await searchParams;
    const categorySlug = params?.category;

    const [categories, products] = await Promise.all([
        getShopCategories(),
        getShopProducts(categorySlug),
    ]);

    return (
        <>
        <Navbar />
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.heading}>Shop</h1>
                <p className={styles.subtitle}>
                    Impeccably crafted menswear, made by hand in our Naples atelier
                </p>
            </div>

            <div className={styles.layout}>
                {/* Sidebar */}
                <aside className={styles.sidebar}>
                    <h2 className={styles.sidebarTitle}>Categories</h2>
                    <ul className={styles.categoryList}>
                        <li>
                            <Link
                                href="/shop"
                                className={`${styles.categoryItem} ${!categorySlug ? styles.categoryItemActive : ""}`}
                            >
                                All
                            </Link>
                        </li>
                        {categories.map((cat) => (
                            <li key={cat.id}>
                                <Link
                                    href={`/shop?category=${cat.slug}`}
                                    className={`${styles.categoryItem} ${categorySlug === cat.slug ? styles.categoryItemActive : ""}`}
                                >
                                    {cat.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Product Grid */}
                <div className={styles.grid}>
                    {products.length === 0 ? (
                        <div className={styles.emptyState}>No products found</div>
                    ) : (
                        products.map((product) => (
                            <Link
                                key={product.id}
                                href={`/shop/${product.slug}`}
                                className={styles.card}
                            >
                                <div className={styles.imageWrap}>
                                    {product.isFeatured && (
                                        <span className={styles.featuredBadge}>Featured</span>
                                    )}
                                    {product.images[0] ? (
                                        <Image
                                            className={styles.image}
                                            src={product.images[0].url}
                                            alt={product.images[0].alt || product.name}
                                            fill
                                            sizes="(max-width: 768px) 50vw, 280px"
                                        />
                                    ) : (
                                        <div className={styles.imagePlaceholder}>
                                            {product.category.name}
                                        </div>
                                    )}
                                </div>
                                <h3 className={styles.productName}>{product.name}</h3>
                                <p className={styles.productCategory}>{product.category.name}</p>
                                <p className={styles.productPrice}>
                                    €{Number(product.price).toLocaleString("en-US", { minimumFractionDigits: 0 })}
                                </p>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
        <Footer />
        </>
    );
}
