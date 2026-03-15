import prisma from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";
import { updateProduct } from "../../actions";
import styles from "../../admin.module.css";
import formStyles from "../new/form.module.css";

export const metadata = { title: "Edit Product | Valemonte Admin" };

export default async function EditProductPage({ params }) {
    const { id } = await params;

    const [product, categories, collections] = await Promise.all([
        prisma.product.findUnique({
            where: { id },
            include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
        }),
        prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
        prisma.collection.findMany({ orderBy: { createdAt: "desc" } }),
    ]);

    if (!product) notFound();

    // For the simple image approach, we'll grab the first image's URL
    const mainImageUrl = product.images[0]?.url || "";

    return (
        <div>
            <div className={styles.pageHeader}>
                <div>
                    <Link href="/admin/products" style={{ color: "var(--clr-cream-dim)", textDecoration: "none", fontSize: "12px", marginBottom: "16px", display: "inline-block" }}>← Back to Products</Link>
                    <h1 className={styles.title}>Edit Product</h1>
                    <p className={styles.subtitle}>Update details for {product.name}.</p>
                </div>
            </div>

            <form action={updateProduct} className={formStyles.form}>
                <input type="hidden" name="id" value={product.id} />

                <div className={formStyles.grid}>
                    <div className={formStyles.field}>
                        <label htmlFor="name" className={formStyles.label}>Name</label>
                        <input id="name" name="name" type="text" className={formStyles.input} defaultValue={product.name} required />
                    </div>

                    <div className={formStyles.field}>
                        <label htmlFor="price" className={formStyles.label}>Price (€)</label>
                        <input id="price" name="price" type="number" step="0.01" className={formStyles.input} defaultValue={Number(product.price)} required />
                    </div>

                    <div className={formStyles.field}>
                        <label htmlFor="categoryId" className={formStyles.label}>Category</label>
                        <select id="categoryId" name="categoryId" className={formStyles.input} defaultValue={product.categoryId} required>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className={formStyles.field}>
                        <label htmlFor="collectionId" className={formStyles.label}>Collection (Optional)</label>
                        <select id="collectionId" name="collectionId" className={formStyles.input} defaultValue={product.collectionId || ""}>
                            <option value="">None</option>
                            {collections.map((c) => (
                                <option key={c.id} value={c.id}>{c.name} ({c.season})</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={formStyles.field} style={{ marginTop: "24px" }}>
                    <label htmlFor="description" className={formStyles.label}>Description</label>
                    <textarea id="description" name="description" className={formStyles.textarea} rows="4" defaultValue={product.description || ""}></textarea>
                </div>

                <div className={formStyles.grid} style={{ marginTop: "24px" }}>
                    <div className={formStyles.field}>
                        <label htmlFor="fabric" className={formStyles.label}>Fabric</label>
                        <input id="fabric" name="fabric" type="text" className={formStyles.input} defaultValue={product.fabric || ""} />
                    </div>

                    <div className={formStyles.field}>
                        <label htmlFor="careInfo" className={formStyles.label}>Care Instructions</label>
                        <input id="careInfo" name="careInfo" type="text" className={formStyles.input} defaultValue={product.careInfo || ""} />
                    </div>
                </div>

                <div className={formStyles.grid} style={{ marginTop: "24px" }}>
                    <div className={formStyles.field}>
                        <label htmlFor="imageFile" className={formStyles.label}>Replace Image (Optional)</label>
                        <input id="imageFile" name="imageFile" type="file" accept="image/*" className={formStyles.input} style={{ padding: "10px" }} />
                        {mainImageUrl && <p style={{ fontSize: "11px", color: "var(--clr-cream-dim)", marginTop: "6px" }}>Current: {mainImageUrl.split("/").pop()}</p>}
                    </div>

                    <div className={formStyles.field}>
                        <label htmlFor="isActive" className={formStyles.label}>Status</label>
                        <select id="isActive" name="isActive" className={formStyles.input} defaultValue={product.isActive.toString()}>
                            <option value="true">Active (Visible in Shop)</option>
                            <option value="false">Draft (Hidden)</option>
                        </select>
                    </div>
                </div>

                <div style={{ marginTop: "48px", display: "flex", gap: "16px" }}>
                    <button type="submit" className={styles.actionBtn}>Save Changes</button>
                    <Link href="/admin/products" className={styles.actionBtn} style={{ background: "transparent", border: "1px solid var(--clr-cream-ghost)", color: "var(--clr-cream)" }}>Cancel</Link>
                </div>
            </form>
        </div>
    );
}
