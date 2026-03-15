import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import styles from "./admin.module.css";

export default async function AdminLayout({ children }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const profile = await prisma.profile.findUnique({
        where: { authId: user.id },
        select: { role: true },
    });

    if (profile?.role !== "ADMIN") {
        redirect("/"); // Block non-admins
    }

    return (
        <div className={styles.layout}>
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <Link href="/" className={styles.logo}>Valemonte</Link>
                    <span className={styles.badge}>Admin</span>
                </div>

                <nav className={styles.nav}>
                    <Link href="/admin" className={styles.navLink}>Dashboard</Link>
                    <Link href="/admin/products" className={styles.navLink}>Products</Link>
                    <Link href="/admin/collections" className={styles.navLink}>Collections</Link>
                    <Link href="/admin/orders" className={styles.navLink}>Orders</Link>
                    <Link href="/admin/users" className={styles.navLink}>Users</Link>
                </nav>

                <div className={styles.sidebarFooter}>
                    <p className={styles.userEmail}>{user.email}</p>
                    <Link href="/account" className={styles.navLink}>Back to Account</Link>
                </div>
            </aside>

            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
