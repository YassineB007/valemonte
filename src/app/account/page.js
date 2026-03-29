import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Main from "@/components/Main";
import AccountForm from "./AccountForm";
import styles from "./account.module.css";

export default async function AccountPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch profile from database
    let profile = await prisma.profile.findUnique({
        where: { authId: user.id },
    });

    // If profile doesn't exist yet (edge case), create it
    if (!profile) {
        profile = await prisma.profile.create({
            data: {
                authId: user.id,
                email: user.email,
            },
        });
    }

    return (
        <>
        <Navbar />
        <Main className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.heading}>My Account</h1>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Account Details</h2>
                    <p className={styles.info}>
                        Email: <span className={styles.infoValue}>{profile.email}</span>
                    </p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Profile</h2>
                    <AccountForm profile={profile} />
                </div>
            </div>
        </Main>
        <Footer />
        </>
    );
}
