import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateOrderStatus } from "../../actions";
import styles from "../../admin.module.css";
import formStyles from "../../products/new/form.module.css";

export const metadata = { title: "Order Details | Valemonte Admin" };

export default async function OrderDetailPage({ params }) {
    const { id } = await params;

    const order = await prisma.order.findUnique({
        where: { id },
        include: { 
            items: true,
            profile: true
        },
    });

    if (!order) notFound();

    return (
        <div>
            <div className={styles.pageHeader}>
                <div>
                    <Link href="/admin/orders" style={{ color: "var(--clr-cream-dim)", textDecoration: "none", fontSize: "12px", marginBottom: "16px", display: "inline-block" }}>← Back to Orders</Link>
                    <h1 className={styles.title}>Order #{order.id.split("-")[0].toUpperCase()}</h1>
                    <p className={styles.subtitle}>Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "32px" }}>
                <div>
                    <div className={styles.card} style={{ marginBottom: "32px" }}>
                        <h2 style={{ fontSize: "16px", fontWeight: "300", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "24px", borderBottom: "1px solid var(--clr-border)", paddingBottom: "16px" }}>Order Items</h2>
                        
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid var(--clr-border)" }}>
                                    <th style={{ padding: "12px 0", textAlign: "left", color: "var(--clr-cream-dim)", fontSize: "11px", fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase" }}>Product</th>
                                    <th style={{ padding: "12px 0", textAlign: "center", color: "var(--clr-cream-dim)", fontSize: "11px", fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase" }}>Size</th>
                                    <th style={{ padding: "12px 0", textAlign: "center", color: "var(--clr-cream-dim)", fontSize: "11px", fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase" }}>Qty</th>
                                    <th style={{ padding: "12px 0", textAlign: "right", color: "var(--clr-cream-dim)", fontSize: "11px", fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase" }}>Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map((item) => (
                                    <tr key={item.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                                        <td style={{ padding: "16px 0", fontSize: "14px" }}>{item.productName}</td>
                                        <td style={{ padding: "16px 0", textAlign: "center", fontSize: "14px", color: "var(--clr-cream-dim)" }}>{item.size}</td>
                                        <td style={{ padding: "16px 0", textAlign: "center", fontSize: "14px" }}>{item.quantity}</td>
                                        <td style={{ padding: "16px 0", textAlign: "right", fontSize: "14px" }}>€{Number(item.price).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="3" style={{ padding: "24px 0 0", textAlign: "right", color: "var(--clr-cream-dim)", fontSize: "14px" }}>Total Amount:</td>
                                    <td style={{ padding: "24px 0 0", textAlign: "right", fontSize: "18px", fontWeight: 500, color: "var(--clr-accent)" }}>€{Number(order.totalAmount).toLocaleString()}</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    <div className={styles.card}>
                        <h2 style={{ fontSize: "16px", fontWeight: "300", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "24px", borderBottom: "1px solid var(--clr-border)", paddingBottom: "16px" }}>Shipping Details</h2>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
                            <div>
                                <h3 style={{ fontSize: "11px", color: "var(--clr-cream-dim)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Customer</h3>
                                <p style={{ fontSize: "14px", marginBottom: "4px" }}>{order.customerName}</p>
                                <p style={{ fontSize: "13px", color: "var(--clr-cream-dim)" }}>{order.customerEmail}</p>
                            </div>
                            <div>
                                <h3 style={{ fontSize: "11px", color: "var(--clr-cream-dim)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>Address</h3>
                                <p style={{ fontSize: "14px", marginBottom: "4px" }}>{order.addressLine1}</p>
                                <p style={{ fontSize: "14px", marginBottom: "4px" }}>{order.addressCity}, {order.addressState || ""}</p>
                                <p style={{ fontSize: "14px", marginBottom: "4px" }}>{order.addressZip}</p>
                                <p style={{ fontSize: "14px", color: "var(--clr-cream-dim)" }}>{order.addressCountry}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className={styles.card}>
                        <h2 style={{ fontSize: "16px", fontWeight: "300", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "24px", borderBottom: "1px solid var(--clr-border)", paddingBottom: "16px" }}>Order Status</h2>
                        <form action={updateOrderStatus}>
                            <input type="hidden" name="id" value={order.id} />
                            <div className={formStyles.field}>
                                <select name="status" className={formStyles.input} defaultValue={order.status} style={{ background: "rgba(255,255,255,0.05)" }}>
                                    <option value="PENDING">Pending</option>
                                    <option value="PROCESSING">Processing</option>
                                    <option value="SHIPPED">Shipped</option>
                                    <option value="DELIVERED">Delivered</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                            </div>
                            <button type="submit" className={styles.actionBtn} style={{ width: "100%", marginTop: "16px" }}>Update status</button>
                        </form>
                        
                        <div style={{ marginTop: "32px", borderTop: "1px solid var(--clr-border)", paddingTop: "24px" }}>
                            <h3 style={{ fontSize: "11px", color: "var(--clr-cream-dim)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "16px" }}>Internal Info</h3>
                            <div style={{ fontSize: "12px", color: "var(--clr-cream-dim)", display: "flex", flexDirection: "column", gap: "8px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span>Internal ID:</span>
                                    <span style={{ fontFamily: "monospace" }}>{order.id}</span>
                                </div>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span>Account Type:</span>
                                    <span>{order.profileId ? "Registered User" : "Guest Checkout"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
