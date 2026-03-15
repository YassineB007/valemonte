import prisma from "@/lib/prisma";
import Link from "next/link";
import styles from "../admin.module.css";

export const metadata = { title: "Manage Products | Valemonte Admin" };

export default async function AdminProductsPage() {
    const products = await prisma.product.findMany({
        include: { category: true, collection: true, variants: true },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>Products</h1>
                    <p className={styles.subtitle}>Manage your catalog, prices, and status.</p>
                </div>
                <Link href="/admin/products/new" className={styles.actionBtn}>
                    + New Product
                </Link>
            </div>

            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--clr-cream-ghost)" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid var(--clr-cream-ghost)" }}>
                            <th style={{ padding: "16px 24px", color: "var(--clr-cream-dim)", fontSize: "11px", fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase" }}>Name</th>
                            <th style={{ padding: "16px 24px", color: "var(--clr-cream-dim)", fontSize: "11px", fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase" }}>Category</th>
                            <th style={{ padding: "16px 24px", color: "var(--clr-cream-dim)", fontSize: "11px", fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase" }}>Price</th>
                            <th style={{ padding: "16px 24px", color: "var(--clr-cream-dim)", fontSize: "11px", fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase" }}>Stock</th>
                            <th style={{ padding: "16px 24px", color: "var(--clr-cream-dim)", fontSize: "11px", fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase" }}>Status</th>
                            <th style={{ padding: "16px 24px", color: "var(--clr-cream-dim)", fontSize: "11px", fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((p) => {
                            const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
                            return (
                            <tr key={p.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                <td style={{ padding: "16px 24px" }}>
                                    <div style={{ fontWeight: 400 }}>{p.name}</div>
                                    <div style={{ fontSize: "11px", color: "var(--clr-cream-dim)", marginTop: "4px" }}>{p.slug}</div>
                                </td>
                                <td style={{ padding: "16px 24px", color: "var(--clr-cream-dim)", fontSize: "13px" }}>{p.category.name}</td>
                                <td style={{ padding: "16px 24px", color: "var(--clr-cream)", fontSize: "13px" }}>
                                    €{Number(p.price).toLocaleString("en-US", { minimumFractionDigits: 0 })}
                                </td>
                                <td style={{ padding: "16px 24px", color: totalStock > 0 ? "var(--clr-cream-dim)" : "#e57373", fontSize: "13px" }}>
                                    {totalStock} in stock
                                </td>
                                <td style={{ padding: "16px 24px" }}>
                                    {p.isActive ? (
                                        <span style={{ color: "#81C784", fontSize: "12px" }}>● Active</span>
                                    ) : (
                                        <span style={{ color: "var(--clr-cream-dim)", fontSize: "12px" }}>○ Draft</span>
                                    )}
                                </td>
                                <td style={{ padding: "16px 24px", textAlign: "right" }}>
                                    <Link href={`/admin/products/${p.id}`} className={styles.actionBtn} style={{ background: "transparent", border: "1px solid var(--clr-cream-ghost)", color: "var(--clr-cream)", padding: "6px 12px", fontSize: "10px" }}>
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
