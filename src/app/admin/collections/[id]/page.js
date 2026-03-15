import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateCollection } from "../../actions";
import styles from "../../admin.module.css";
import formStyles from "../../products/new/form.module.css";

export const metadata = { title: "Edit Collection | Valemonte Admin" };

export default async function EditCollectionPage({ params }) {
    const { id } = await params;

    const collection = await prisma.collection.findUnique({
        where: { id },
    });

    if (!collection) notFound();

    return (
        <div>
            <div className={styles.pageHeader}>
                <div>
                    <Link href="/admin/collections" style={{ color: "var(--clr-cream-dim)", textDecoration: "none", fontSize: "12px", marginBottom: "16px", display: "inline-block" }}>← Back to Collections</Link>
                    <h1 className={styles.title}>Edit Collection</h1>
                    <p className={styles.subtitle}>Update details for {collection.name}.</p>
                </div>
            </div>

            <form action={updateCollection} className={formStyles.form}>
                <input type="hidden" name="id" value={collection.id} />

                <div className={formStyles.grid}>
                    <div className={formStyles.field}>
                        <label htmlFor="name" className={formStyles.label}>Name</label>
                        <input id="name" name="name" type="text" className={formStyles.input} defaultValue={collection.name} required />
                    </div>

                    <div className={formStyles.field}>
                        <label htmlFor="season" className={formStyles.label}>Season</label>
                        <input id="season" name="season" type="text" className={formStyles.input} defaultValue={collection.season} required />
                    </div>
                </div>

                <div className={formStyles.field} style={{ marginTop: "24px" }}>
                    <label htmlFor="description" className={formStyles.label}>Description</label>
                    <textarea id="description" name="description" className={formStyles.textarea} rows="4" defaultValue={collection.description || ""}></textarea>
                </div>

                <div className={formStyles.grid} style={{ marginTop: "24px" }}>
                    <div className={formStyles.field}>
                        <label htmlFor="coverFile" className={formStyles.label}>Replace Cover Image (Optional)</label>
                        <input id="coverFile" name="coverFile" type="file" accept="image/*" className={formStyles.input} style={{ padding: "10px" }} />
                        {collection.coverImage && <p style={{ fontSize: "11px", color: "var(--clr-cream-dim)", marginTop: "6px" }}>Current: {collection.coverImage.split("/").pop()}</p>}
                    </div>

                    <div className={formStyles.field}>
                        <label htmlFor="isActive" className={formStyles.label}>Status</label>
                        <select id="isActive" name="isActive" className={formStyles.input} defaultValue={collection.isActive.toString()}>
                            <option value="true">Active (Visible)</option>
                            <option value="false">Draft (Hidden)</option>
                        </select>
                    </div>
                </div>

                <div style={{ marginTop: "48px", display: "flex", gap: "16px" }}>
                    <button type="submit" className={styles.actionBtn}>Save Changes</button>
                    <Link href="/admin/collections" className={styles.actionBtn} style={{ background: "transparent", border: "1px solid var(--clr-cream-ghost)", color: "var(--clr-cream)" }}>Cancel</Link>
                </div>
            </form>
        </div>
    );
}
