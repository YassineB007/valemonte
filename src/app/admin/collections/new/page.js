import Link from "next/link";
import { createCollection } from "../../actions";
import styles from "../../admin.module.css";
import formStyles from "../../products/new/form.module.css";

export const metadata = { title: "New Collection | Valemonte Admin" };

export default function NewCollectionPage() {
    return (
        <div>
            <div className={styles.pageHeader}>
                <div>
                    <Link href="/admin/collections" style={{ color: "var(--clr-cream-dim)", textDecoration: "none", fontSize: "12px", marginBottom: "16px", display: "inline-block" }}>← Back to Collections</Link>
                    <h1 className={styles.title}>New Collection</h1>
                    <p className={styles.subtitle}>Create a new seasonal or thematic collection.</p>
                </div>
            </div>

            <form action={createCollection} className={formStyles.form}>
                <div className={formStyles.grid}>
                    <div className={formStyles.field}>
                        <label htmlFor="name" className={formStyles.label}>Name</label>
                        <input id="name" name="name" type="text" className={formStyles.input} placeholder="e.g. The Riviera Edit" required />
                    </div>

                    <div className={formStyles.field}>
                        <label htmlFor="season" className={formStyles.label}>Season</label>
                        <input id="season" name="season" type="text" className={formStyles.input} placeholder="e.g. SS24" required />
                    </div>
                </div>

                <div className={formStyles.field} style={{ marginTop: "24px" }}>
                    <label htmlFor="description" className={formStyles.label}>Description</label>
                    <textarea id="description" name="description" className={formStyles.textarea} rows="4" placeholder="Describe the inspiration behind this collection..."></textarea>
                </div>

                <div className={formStyles.grid} style={{ marginTop: "24px" }}>
                    <div className={formStyles.field}>
                        <label htmlFor="coverFile" className={formStyles.label}>Cover Image</label>
                        <input id="coverFile" name="coverFile" type="file" accept="image/*" className={formStyles.input} style={{ padding: "10px" }} />
                    </div>

                    <div className={formStyles.field}>
                        <label htmlFor="isActive" className={formStyles.label}>Status</label>
                        <select id="isActive" name="isActive" className={formStyles.input} defaultValue="false">
                            <option value="false">Draft (Hidden)</option>
                            <option value="true">Active (Visible)</option>
                        </select>
                    </div>
                </div>

                <div style={{ marginTop: "48px", display: "flex", gap: "16px" }}>
                    <button type="submit" className={styles.actionBtn}>Create Collection</button>
                    <Link href="/admin/collections" className={styles.actionBtn} style={{ background: "transparent", border: "1px solid var(--clr-cream-ghost)", color: "var(--clr-cream)" }}>Cancel</Link>
                </div>
            </form>
        </div>
    );
}
