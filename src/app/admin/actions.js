"use server";

import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { uploadFileToR2 } from "@/lib/r2";

export async function createProduct(formData) {
    const name = formData.get("name");
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const price = parseFloat(formData.get("price"));
    const categoryId = formData.get("categoryId");
    const collectionId = formData.get("collectionId") || null;
    const description = formData.get("description") || null;
    const fabric = formData.get("fabric") || null;
    const careInfo = formData.get("careInfo") || null;

    // Handle file upload to R2
    const imageFile = formData.get("imageFile");
    if (!name || isNaN(price) || !categoryId || !imageFile || imageFile.size === 0) {
        throw new Error("Missing required fields (including an image)");
    }

    const imageUrl = await uploadFileToR2(imageFile, "products");

    await prisma.product.create({
        data: {
            name,
            slug,
            price,
            categoryId,
            collectionId,
            description,
            fabric,
            careInfo,
            isActive: true,
            images: {
                create: {
                    url: imageUrl,
                    alt: `${name} product shot`,
                    sortOrder: 0,
                }
            }
        }
    });

    revalidatePath("/shop");
    revalidatePath("/admin/products");
    redirect("/admin/products");
}

export async function updateProduct(formData) {
    const id = formData.get("id");
    const name = formData.get("name");
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const price = parseFloat(formData.get("price"));
    const categoryId = formData.get("categoryId");
    const collectionId = formData.get("collectionId") || null;
    const description = formData.get("description") || null;
    const fabric = formData.get("fabric") || null;
    const careInfo = formData.get("careInfo") || null;
    const isActive = formData.get("isActive") === "true";

    if (!id || !name || isNaN(price) || !categoryId) {
        throw new Error("Missing required fields");
    }

    // Handle optional new image upload
    const imageFile = formData.get("imageFile");
    let newImageUrl = null;
    if (imageFile && imageFile.size > 0) {
        newImageUrl = await uploadFileToR2(imageFile, "products");
    }

    await prisma.$transaction(async (tx) => {
        await tx.product.update({
            where: { id },
            data: {
                name,
                slug,
                price,
                categoryId,
                collectionId,
                description,
                fabric,
                careInfo,
                isActive,
            }
        });

        // Only update image if a new file was uploaded
        if (newImageUrl) {
            const firstImage = await tx.productImage.findFirst({
                where: { productId: id },
                orderBy: { sortOrder: "asc" },
            });

            if (firstImage) {
                await tx.productImage.update({
                    where: { id: firstImage.id },
                    data: { url: newImageUrl, alt: `${name} product shot` },
                });
            } else {
                await tx.productImage.create({
                    data: {
                        productId: id,
                        url: newImageUrl,
                        alt: `${name} product shot`,
                        sortOrder: 0,
                    }
                });
            }
        }
    });

    revalidatePath("/shop");
    revalidatePath(`/shop/${slug}`);
    revalidatePath("/admin/products");
    redirect("/admin/products");
}

export async function createCollection(formData) {
    const name = formData.get("name");
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const season = formData.get("season");
    const description = formData.get("description") || null;
    const isActive = formData.get("isActive") === "true";

    if (!name || !season) {
        throw new Error("Missing required fields");
    }

    // Handle optional cover image upload
    const coverFile = formData.get("coverFile");
    let coverImage = null;
    if (coverFile && coverFile.size > 0) {
        coverImage = await uploadFileToR2(coverFile, "collections");
    }

    await prisma.collection.create({
        data: {
            name,
            slug,
            season,
            description,
            coverImage,
            isActive,
        }
    });

    revalidatePath("/collections");
    revalidatePath("/admin/collections");
    redirect("/admin/collections");
}

export async function updateCollection(formData) {
    const id = formData.get("id");
    const name = formData.get("name");
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const season = formData.get("season");
    const description = formData.get("description") || null;
    const isActive = formData.get("isActive") === "true";

    if (!id || !name || !season) {
        throw new Error("Missing required fields");
    }

    // Handle optional new cover image
    const coverFile = formData.get("coverFile");
    let coverImage = undefined; // undefined = don't change existing value
    if (coverFile && coverFile.size > 0) {
        coverImage = await uploadFileToR2(coverFile, "collections");
    }

    const updateData = {
        name,
        slug,
        season,
        description,
        isActive,
    };
    // Only overwrite coverImage if a new file was uploaded
    if (coverImage !== undefined) {
        updateData.coverImage = coverImage;
    }

    await prisma.collection.update({
        where: { id },
        data: updateData,
    });

    revalidatePath("/collections");
    revalidatePath(`/collections/${slug}`);
    revalidatePath("/admin/collections");
    redirect("/admin/collections");
}

export async function updateUserRole(formData) {
    const authId = formData.get("authId");
    const role = formData.get("role");

    if (!authId || !["USER", "ADMIN"].includes(role)) {
        throw new Error("Invalid request");
    }

    // Ensure the person making the request is an admin
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("Not authenticated");
    }

    const callingUser = await prisma.profile.findUnique({
        where: { authId: user.id },
    });

    if (callingUser?.role !== "ADMIN") {
        throw new Error("Unauthorized: Only admins can elevate roles");
    }

    // Prevent users from demoting themselves and locking themselves out
    if (authId === user.id && role === "USER") {
        throw new Error("Cannot demote your own account");
    }

    await prisma.profile.update({
        where: { authId },
        data: { role },
    });

    revalidatePath("/admin/users");
    redirect("/admin/users");
}
