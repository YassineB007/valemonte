import prisma from "@/lib/prisma";
import styles from "./admin.module.css";

export const metadata = { title: "Admin Dashboard | Valemonte" };

export default async function AdminDashboard() {
    const [productCount, userCount, collectionCount] = await Promise.all([
        prisma.product.count(),
        prisma.profile.count(),
        prisma.collection.count(),
    ]);

    return (
        <div>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>Dashboard Overview</h1>
                    <p className={styles.subtitle}>Welcome to the Valemonte command center.</p>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
                <div style={{ padding: "32px", border: "1px solid var(--clr-cream-ghost)", background: "rgba(255,255,255,0.02)" }}>
                    <p className={styles.subtitle} style={{ textTransform: "uppercase", letterSpacing: "2px", fontSize: "10px", marginTop: 0 }}>Total Products</p>
                    <p style={{ fontSize: "36px", margin: "16px 0 0", fontWeight: 300 }}>{productCount}</p>
                </div>

                <div style={{ padding: "32px", border: "1px solid var(--clr-cream-ghost)", background: "rgba(255,255,255,0.02)" }}>
                    <p className={styles.subtitle} style={{ textTransform: "uppercase", letterSpacing: "2px", fontSize: "10px", marginTop: 0 }}>Registered Users</p>
                    <p style={{ fontSize: "36px", margin: "16px 0 0", fontWeight: 300 }}>{userCount}</p>
                </div>

                <div style={{ padding: "32px", border: "1px solid var(--clr-cream-ghost)", background: "rgba(255,255,255,0.02)" }}>
                    <p className={styles.subtitle} style={{ textTransform: "uppercase", letterSpacing: "2px", fontSize: "10px", marginTop: 0 }}>Collections</p>
                    <p style={{ fontSize: "36px", margin: "16px 0 0", fontWeight: 300 }}>{collectionCount}</p>
                </div>
            </div>
        </div>
    );
}
