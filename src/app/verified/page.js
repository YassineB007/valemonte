import Link from "next/link";
import styles from "../login/login.module.css";

export default function VerifiedPage() {
    return (
        <div className={styles.page}>
            <Link href="/" className={styles.backLink}>Valemonte</Link>
            <div className={styles.card}>
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <div style={{ fontSize: "48px", marginBottom: "24px" }}>✓</div>
                    <h1 className={styles.heading}>Email Verified</h1>
                    <p className={styles.subtitle} style={{ marginBottom: "32px" }}>
                        Your account has been successfully verified. You can now sign in and start exploring.
                    </p>
                    <Link
                        href="/login"
                        className={styles.submitBtn}
                        style={{ display: "inline-block", textDecoration: "none", textAlign: "center" }}
                    >
                        Sign In to Your Account
                    </Link>
                </div>
            </div>
        </div>
    );
}
