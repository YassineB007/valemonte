export const dynamic = "force-dynamic";

import prisma from "@/lib/prisma";
import styles from "../admin.module.css";

export const metadata = { title: "Manage Orders | Valemonte Admin" };

export default async function AdminOrdersPage() {
    const orders = await prisma.order.findMany({
        include: { items: true },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>Orders</h1>
                    <p className={styles.subtitle}>View recent shop orders and trials.</p>
                </div>
            </div>

            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--clr-cream-ghost)" }}>
                {orders.length === 0 ? (
                    <div style={{ padding: "40px", textAlign: "center", color: "var(--clr-cream-dim)" }}>
                        No orders yet.
                    </div>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid var(--clr-cream-ghost)" }}>
                                <th style={{ padding: "16px 24px", color: "var(--clr-cream-dim)", fontSize: "11px", fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase" }}>Order ID</th>
                                <th style={{ padding: "16px 24px", color: "var(--clr-cream-dim)", fontSize: "11px", fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase" }}>Customer</th>
                                <th style={{ padding: "16px 24px", color: "var(--clr-cream-dim)", fontSize: "11px", fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase" }}>Amount</th>
                                <th style={{ padding: "16px 24px", color: "var(--clr-cream-dim)", fontSize: "11px", fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase" }}>Status</th>
                                <th style={{ padding: "16px 24px", color: "var(--clr-cream-dim)", fontSize: "11px", fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase", textAlign: "right" }}>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((o) => (
                                <tr key={o.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                    <td style={{ padding: "16px 24px" }}>
                                        <div style={{ fontWeight: 400, fontFamily: "monospace", fontSize: "12px", color: "var(--clr-gold-muted)" }}>#{o.id.split("-")[0]}</div>
                                        <div style={{ fontSize: "11px", color: "var(--clr-cream-dim)", marginTop: "4px" }}>
                                            {o.items.length} item(s)
                                        </div>
                                    </td>
                                    <td style={{ padding: "16px 24px" }}>
                                        <div style={{ color: "var(--clr-cream)", fontSize: "13px" }}>{o.customerName}</div>
                                        <div style={{ color: "var(--clr-cream-dim)", fontSize: "11px" }}>{o.customerEmail}</div>
                                    </td>
                                    <td style={{ padding: "16px 24px", color: "var(--clr-cream)", fontSize: "13px" }}>
                                        €{Number(o.totalAmount).toLocaleString("en-US", { minimumFractionDigits: 0 })}
                                    </td>
                                    <td style={{ padding: "16px 24px" }}>
                                        <span style={{ color: o.status === "PENDING" ? "#FBC02D" : "var(--clr-cream)", fontSize: "12px" }}>
                                            {o.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: "16px 24px", textAlign: "right", color: "var(--clr-cream-dim)", fontSize: "13px" }}>
                                        {new Date(o.createdAt).toLocaleDateString()}
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
