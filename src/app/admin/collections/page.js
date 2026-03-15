import prisma from "@/lib/prisma";
import Link from "next/link";
import styles from "../admin.module.css";

export const metadata = { title: "Collections | Valemonte Admin" };

export default async function AdminCollectionsPage() {
    const collections = await prisma.collection.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: { products: true }
            }
        }
    });

    return (
        <div>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>Collections</h1>
                    <p className={styles.subtitle}>Manage seasonal and thematic collections.</p>
                </div>
                <Link href="/admin/collections/new" className={styles.actionBtn}>
                    + New Collection
                </Link>
            </div>

            <div className={styles.card}>
                {collections.length === 0 ? (
                    <p style={{ color: "var(--clr-cream-dim)", padding: "24px", textAlign: "center" }}>No collections found.</p>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid var(--clr-border)" }}>
                                <th style={{ padding: "16px 24px", textAlign: "left", color: "var(--clr-cream-dim)", fontSize: "11px", fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase" }}>Name</th>
                                <th style={{ padding: "16px 24px", textAlign: "left", color: "var(--clr-cream-dim)", fontSize: "11px", fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase" }}>Season</th>
                                <th style={{ padding: "16px 24px", color: "var(--clr-cream-dim)", fontSize: "11px", fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase" }}>Products</th>
                                <th style={{ padding: "16px 24px", color: "var(--clr-cream-dim)", fontSize: "11px", fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase" }}>Status</th>
                                <th style={{ padding: "16px 24px", color: "var(--clr-cream-dim)", fontSize: "11px", fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {collections.map((c) => (
                                <tr key={c.id} style={{ borderBottom: "1px solid var(--clr-border)" }}>
                                    <td style={{ padding: "16px 24px", fontWeight: 500 }}>{c.name}</td>
                                    <td style={{ padding: "16px 24px", color: "var(--clr-cream-dim)" }}>{c.season}</td>
                                    <td style={{ padding: "16px 24px", textAlign: "center", color: "var(--clr-cream-dim)" }}>{c._count.products}</td>
                                    <td style={{ padding: "16px 24px", textAlign: "center" }}>
                                        {c.isActive ? (
                                            <span style={{ color: "#81C784", fontSize: "12px" }}>● Active</span>
                                        ) : (
                                            <span style={{ color: "var(--clr-cream-dim)", fontSize: "12px" }}>○ Draft</span>
                                        )}
                                    </td>
                                    <td style={{ padding: "16px 24px", textAlign: "right" }}>
                                        <Link href={`/admin/collections/${c.id}`} className={styles.actionBtn} style={{ background: "transparent", border: "1px solid var(--clr-cream-ghost)", color: "var(--clr-cream)", padding: "6px 12px", fontSize: "10px" }}>
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
