"use client";

import { useActionState } from "react";
import { updatePassword } from "@/app/auth/actions";
import Link from "next/link";
import Main from "@/components/Main";
import styles from "../login/login.module.css";

export default function ResetPasswordPage() {
    const [state, formAction, isPending] = useActionState(updatePassword, null);

    return (
        <Main className={styles.page}>
            <Link href="/" className={styles.backLink}>Valemonte</Link>
            <div className={styles.card}>
                <h1 className={styles.heading}>New Password</h1>
                <p className={styles.subtitle}>Enter your new password below</p>

                {state?.error && <div className={styles.error}>{state.error}</div>}

                <form className={styles.form} action={formAction}>
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="password">
                            New Password
                        </label>
                        <input
                            className={styles.input}
                            id="password"
                            name="password"
                            type="password"
                            placeholder="At least 6 characters"
                            minLength={6}
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="confirm">
                            Confirm Password
                        </label>
                        <input
                            className={styles.input}
                            id="confirm"
                            name="confirm"
                            type="password"
                            placeholder="Re-enter password"
                            minLength={6}
                            required
                        />
                    </div>

                    <button className={styles.submitBtn} type="submit" disabled={isPending}>
                        {isPending ? "Updating..." : "Set New Password"}
                    </button>
                </form>
            </div>
        </Main>
    );
}
