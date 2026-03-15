"use client";

import { useActionState } from "react";
import { signUp } from "@/app/auth/actions";
import Link from "next/link";
import styles from "./signup.module.css";

export default function SignupPage() {
    const [state, formAction, isPending] = useActionState(signUp, null);

    if (state?.success) {
        return (
            <div className={styles.page}>
                <Link href="/" className={styles.backLink}>Valemonte</Link>
                <div className={styles.card}>
                    <div style={{ textAlign: "center", padding: "20px 0" }}>
                        <div style={{ fontSize: "48px", marginBottom: "24px" }}>✉️</div>
                        <h1 className={styles.heading}>Verify Your Email</h1>
                        <p className={styles.subtitle} style={{ marginBottom: "16px" }}>
                            We&apos;ve sent a confirmation link to your email address.
                        </p>
                        <p className={styles.subtitle} style={{ marginBottom: "32px" }}>
                            Please check your inbox and click the link to activate your account.
                        </p>
                        <p className={styles.footer} style={{ marginTop: "0" }}>
                            Didn&apos;t receive the email? Check your spam folder or try signing up again.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <Link href="/" className={styles.backLink}>Valemonte</Link>
            <div className={styles.card}>
                <h1 className={styles.heading}>Create Account</h1>
                <p className={styles.subtitle}>Join the house of Valemonte</p>

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
                                placeholder="First"
                            />
                        </div>
                        <div className={styles.field}>
                            <label className={styles.label} htmlFor="lastName">Last Name</label>
                            <input
                                className={styles.input}
                                id="lastName"
                                name="lastName"
                                type="text"
                                placeholder="Last"
                            />
                        </div>
                    </div>

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
                            placeholder="At least 6 characters"
                            minLength={6}
                            required
                        />
                    </div>

                    <button className={styles.submitBtn} type="submit" disabled={isPending}>
                        {isPending ? "Creating Account..." : "Create Account"}
                    </button>
                </form>

                <p className={styles.footer}>
                    Already have an account?{" "}
                    <Link href="/login" className={styles.footerLink}>Sign in</Link>
                </p>
            </div>
        </div>
    );
}
