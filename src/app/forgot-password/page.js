"use client";

import { useActionState } from "react";
import { resetPassword } from "@/app/auth/actions";
import Link from "next/link";
import Main from "@/components/Main";
import styles from "../login/login.module.css";

export default function ForgotPasswordPage() {
    const [state, formAction, isPending] = useActionState(resetPassword, null);

    if (state?.success) {
        return (
            <Main className={styles.page}>
                <Link href="/" className={styles.backLink}>Valemonte</Link>
                <div className={styles.card}>
                    <h1 className={styles.heading}>Check Your Email</h1>
                    <p className={styles.subtitle}>
                        We&apos;ve sent a password reset link to your email address. Click
                        the link to set a new password.
                    </p>
                    <p className={styles.footer}>
                        <Link href="/login" className={styles.footerLink}>
                            Back to Sign In
                        </Link>
                    </p>
                </div>
            </Main>
        );
    }

    return (
        <Main className={styles.page}>
            <Link href="/" className={styles.backLink}>Valemonte</Link>
            <div className={styles.card}>
                <h1 className={styles.heading}>Forgot Password</h1>
                <p className={styles.subtitle}>
                    Enter your email and we&apos;ll send you a reset link
                </p>

                {state?.error && <div className={styles.error}>{state.error}</div>}

                <form className={styles.form} action={formAction}>
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="email">
                            Email
                        </label>
                        <input
                            className={styles.input}
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    <button className={styles.submitBtn} type="submit" disabled={isPending}>
                        {isPending ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>

                <p className={styles.footer}>
                    Remember your password?{" "}
                    <Link href="/login" className={styles.footerLink}>
                        Sign in
                    </Link>
                </p>
            </div>
        </Main>
    );
}
