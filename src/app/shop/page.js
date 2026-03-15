import Link from "next/link";
import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./shop.module.css";

export const metadata = {
    title: "Shop — Valemonte",
    description: "Browse our collection of luxury Italian menswear. Handcrafted jackets, trousers, shirts, and accessories.",
};

export const dynamic = "force-dynamic";

export default async function ShopPage({ searchParams }) {
    const params = await searchParams;
    const categorySlug = params?.category;

    const categories = await prisma.category.findMany({
        orderBy: { sortOrder: "asc" },
    });

    const products = await prisma.product.findMany({
        where: {
            isActive: true,
            ...(categorySlug ? { category: { slug: categorySlug } } : {}),
        },
        include: {
            category: true,
            images: { orderBy: { sortOrder: "asc" }, take: 1 },
        },
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });

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
                                        <img
                                            className={styles.image}
                                            src={product.images[0].url}
                                            alt={product.images[0].alt || product.name}
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
