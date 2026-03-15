"use client";

import { useActionState } from "react";
import { signIn } from "@/app/auth/actions";
import Link from "next/link";
import styles from "./login.module.css";

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(signIn, null);

    return (
        <div className={styles.page}>
            <Link href="/" className={styles.backLink}>Valemonte</Link>
            <div className={styles.card}>
                <h1 className={styles.heading}>Welcome Back</h1>
                <p className={styles.subtitle}>Sign in to your Valemonte account</p>

                {state?.error && <div className={styles.error}>{state.error}</div>}

                <form className={styles.form} action={formAction}>
                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="email">Email</label>
                        <input
                            className={styles.input}
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            required
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label} htmlFor="password">Password</label>
                        <input
                            className={styles.input}
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button className={styles.submitBtn} type="submit" disabled={isPending}>
                        {isPending ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                <p className={styles.footer}>
                    <Link href="/forgot-password" className={styles.footerLink}>Forgot password?</Link>
                </p>
                <p className={styles.footer}>
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className={styles.footerLink}>Create one</Link>
                </p>
            </div>
        </div>
    );
}
