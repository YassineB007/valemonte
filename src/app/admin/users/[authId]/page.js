import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateUserRole } from "../../actions";
import styles from "../../admin.module.css";
import formStyles from "../../products/new/form.module.css";

export const metadata = { title: "Manage User | Valemonte Admin" };

export default async function ManageUserPage({ params }) {
    const { authId } = await params;

    const targetUser = await prisma.profile.findUnique({
        where: { authId },
    });

    if (!targetUser) notFound();

    return (
        <div>
            <div className={styles.pageHeader}>
                <div>
                    <Link href="/admin/users" style={{ color: "var(--clr-cream-dim)", textDecoration: "none", fontSize: "12px", marginBottom: "16px", display: "inline-block" }}>← Back to Users</Link>
                    <h1 className={styles.title}>Manage User</h1>
                    <p className={styles.subtitle}>{targetUser.email}</p>
                </div>
            </div>

            <div className={styles.card} style={{ maxWidth: "600px" }}>
                <h2 style={{ fontSize: "18px", fontWeight: "300", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "24px", borderBottom: "1px solid var(--clr-border)", paddingBottom: "16px" }}>User Details</h2>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "16px", marginBottom: "32px", color: "var(--clr-cream-dim)" }}>
                    <strong style={{ color: "var(--clr-cream)" }}>Name:</strong>
                    <span>{targetUser.firstName || targetUser.lastName ? `${targetUser.firstName || ""} ${targetUser.lastName || ""}` : "N/A"}</span>

                    <strong style={{ color: "var(--clr-cream)" }}>Email:</strong>
                    <span>{targetUser.email}</span>

                    <strong style={{ color: "var(--clr-cream)" }}>Phone:</strong>
                    <span>{targetUser.phone || "N/A"}</span>

                    <strong style={{ color: "var(--clr-cream)" }}>Joined:</strong>
                    <span>{new Date(targetUser.createdAt).toLocaleDateString()}</span>
                </div>

                <h2 style={{ fontSize: "18px", fontWeight: "300", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "24px", borderBottom: "1px solid var(--clr-border)", paddingBottom: "16px" }}>System Role</h2>

                <form action={updateUserRole} className={formStyles.form}>
                    <input type="hidden" name="authId" value={targetUser.authId} />

                    <div className={formStyles.field}>
                        <p style={{ fontSize: "13px", lineHeight: "1.6", color: "var(--clr-cream-dim)", marginBottom: "16px" }}>
                            WARNING: Elevating a user to ADMIN grants them full access to the Valemonte dashboard, enabling them to edit products, collections, and other users.
                        </p>
                        <select id="role" name="role" className={formStyles.input} defaultValue={targetUser.role}>
                            <option value="USER">Base User (Shopper)</option>
                            <option value="ADMIN">System Administrator (Full Access)</option>
                        </select>
                    </div>

                    <div style={{ marginTop: "32px" }}>
                        <button type="submit" className={styles.actionBtn}>Update Permissions</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
