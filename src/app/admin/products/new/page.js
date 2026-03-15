import prisma from "@/lib/prisma";
import Link from "next/link";
import { createProduct } from "../../actions";
import styles from "../../admin.module.css";
import formStyles from "./form.module.css";

export const metadata = { title: "New Product | Valemonte Admin" };

export default async function NewProductPage() {
    const [categories, collections] = await Promise.all([
        prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
        prisma.collection.findMany({ orderBy: { createdAt: "desc" } }),
    ]);

    return (
        <div>
            <div className={styles.pageHeader}>
                <div>
                    <Link href="/admin/products" style={{ color: "var(--clr-cream-dim)", textDecoration: "none", fontSize: "12px", marginBottom: "16px", display: "inline-block" }}>← Back to Products</Link>
                    <h1 className={styles.title}>New Product</h1>
                    <p className={styles.subtitle}>Add a new item to the shop catalog.</p>
                </div>
            </div>

            <form action={createProduct} className={formStyles.form}>
                <div className={formStyles.grid}>
                    <div className={formStyles.field}>
                        <label htmlFor="name" className={formStyles.label}>Name</label>
                        <input id="name" name="name" type="text" className={formStyles.input} placeholder="e.g. Roma Oxford Shirt" required />
                    </div>

                    <div className={formStyles.field}>
                        <label htmlFor="price" className={formStyles.label}>Price (€)</label>
                        <input id="price" name="price" type="number" step="0.01" className={formStyles.input} placeholder="1450.00" required />
                    </div>

                    <div className={formStyles.field}>
                        <label htmlFor="categoryId" className={formStyles.label}>Category</label>
                        <select id="categoryId" name="categoryId" className={formStyles.input} required>
                            <option value="">Select Category...</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className={formStyles.field}>
                        <label htmlFor="collectionId" className={formStyles.label}>Collection (Optional)</label>
                        <select id="collectionId" name="collectionId" className={formStyles.input}>
                            <option value="">None</option>
                            {collections.map((c) => (
                                <option key={c.id} value={c.id}>{c.name} ({c.season})</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={formStyles.field} style={{ marginTop: "24px" }}>
                    <label htmlFor="description" className={formStyles.label}>Description</label>
                    <textarea id="description" name="description" className={formStyles.textarea} rows="4" placeholder="Product details..."></textarea>
                </div>

                <div className={formStyles.grid} style={{ marginTop: "24px" }}>
                    <div className={formStyles.field}>
                        <label htmlFor="fabric" className={formStyles.label}>Fabric</label>
                        <input id="fabric" name="fabric" type="text" className={formStyles.input} placeholder="e.g. 100% Cashmere" />
                    </div>

                    <div className={formStyles.field}>
                        <label htmlFor="careInfo" className={formStyles.label}>Care Instructions</label>
                        <input id="careInfo" name="careInfo" type="text" className={formStyles.input} placeholder="e.g. Dry clean only" />
                    </div>
                </div>

                <div className={formStyles.field} style={{ marginTop: "24px" }}>
                    <label htmlFor="imageFile" className={formStyles.label}>Product Image</label>
                    <input id="imageFile" name="imageFile" type="file" accept="image/*" className={formStyles.input} required style={{ padding: "10px" }} />
                    <p className={styles.subtitle} style={{ fontSize: "11px" }}>Upload a high-quality product photo (JPG, PNG, WebP).</p>
                </div>

                <div style={{ marginTop: "48px", display: "flex", gap: "16px" }}>
                    <button type="submit" className={styles.actionBtn}>Create Product</button>
                    <Link href="/admin/products" className={styles.actionBtn} style={{ background: "transparent", border: "1px solid var(--clr-cream-ghost)", color: "var(--clr-cream)" }}>Cancel</Link>
                </div>
            </form>
        </div>
    );
}
