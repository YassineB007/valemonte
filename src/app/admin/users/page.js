import prisma from "@/lib/prisma";
import Link from "next/link";
import styles from "../admin.module.css";

export const metadata = { title: "Users | Valemonte Admin" };

export default async function AdminUsersPage() {
    const users = await prisma.profile.findMany({
        orderBy: { createdAt: "desc" },
    });

    return (
        <div>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.title}>System Users</h1>
                    <p className={styles.subtitle}>Manage registered users and elevate roles.</p>
                </div>
            </div>

            <div className={styles.card}>
                {users.length === 0 ? (
                    <p style={{ color: "var(--clr-cream-dim)", padding: "24px", textAlign: "center" }}>No users found.</p>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid var(--clr-border)" }}>
                                <th style={{ padding: "16px 24px", textAlign: "left", color: "var(--clr-cream-dim)", fontSize: "11px", fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase" }}>Name</th>
                                <th style={{ padding: "16px 24px", textAlign: "left", color: "var(--clr-cream-dim)", fontSize: "11px", fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase" }}>Email</th>
                                <th style={{ padding: "16px 24px", color: "var(--clr-cream-dim)", fontSize: "11px", fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase" }}>Role</th>
                                <th style={{ padding: "16px 24px", color: "var(--clr-cream-dim)", fontSize: "11px", fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id} style={{ borderBottom: "1px solid var(--clr-border)" }}>
                                    <td style={{ padding: "16px 24px", fontWeight: 500 }}>
                                        {u.firstName || u.lastName ? `${u.firstName || ""} ${u.lastName || ""}`.trim() : <span style={{ color: "var(--clr-cream-dim)", fontStyle: "italic" }}>Not provided</span>}
                                    </td>
                                    <td style={{ padding: "16px 24px", color: "var(--clr-cream-dim)" }}>{u.email}</td>
                                    <td style={{ padding: "16px 24px", textAlign: "center" }}>
                                        {u.role === "ADMIN" ? (
                                            <span style={{ color: "var(--clr-accent)", fontSize: "11px", padding: "4px 8px", border: "1px solid var(--clr-accent)", borderRadius: "100px", fontWeight: 600 }}>ADMIN</span>
                                        ) : (
                                            <span style={{ color: "var(--clr-cream-dim)", fontSize: "12px" }}>USER</span>
                                        )}
                                    </td>
                                    <td style={{ padding: "16px 24px", textAlign: "right" }}>
                                        <Link href={`/admin/users/${u.authId}`} className={styles.actionBtn} style={{ background: "transparent", border: "1px solid var(--clr-cream-ghost)", color: "var(--clr-cream)", padding: "6px 12px", fontSize: "10px" }}>
                                            Manage
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
