"use client";

import { useActionState, useTransition } from "react";
import { signOut, updateProfile } from "@/app/auth/actions";
import styles from "./account.module.css";

export default function AccountForm({ profile }) {
    const [state, formAction, isPending] = useActionState(updateProfile, null);
    const [isSigningOut, startSignOut] = useTransition();

    return (
        <>
            {state?.success && <div className={styles.success}>Profile updated successfully.</div>}
            {state?.error && <div className={styles.error}>{state.error}</div>}

            <form className={styles.form} action={formAction}>
                <div className={styles.fieldRow}>
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="firstName">First Name</label>
                        <input
                            className={styles.input}
                            id="firstName"
                            name="firstName"
                            type="text"
                            defaultValue={profile.firstName || ""}
                            placeholder="First name"
                        />
                    </div>
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="lastName">Last Name</label>
                        <input
                            className={styles.input}
                            id="lastName"
                            name="lastName"
                            type="text"
                            defaultValue={profile.lastName || ""}
                            placeholder="Last name"
                        />
                    </div>
                </div>

                <div className={styles.field}>
                    <label className={styles.label} htmlFor="phone">Phone</label>
                    <input
                        className={styles.input}
                        id="phone"
                        name="phone"
                        type="tel"
                        defaultValue={profile.phone || ""}
                        placeholder="+39 ..."
                    />
                </div>

                <button className={styles.saveBtn} type="submit" disabled={isPending}>
                    {isPending ? "Saving..." : "Save Changes"}
                </button>
            </form>

            <div style={{ marginTop: "16px" }}>
                <button
                    className={styles.logoutBtn}
                    type="button"
                    disabled={isSigningOut}
                    onClick={() => startSignOut(() => signOut())}
                >
                    {isSigningOut ? "Signing Out..." : "Sign Out"}
                </button>
            </div>
        </>
    );
}
