"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function processCheckout(formData, cartItems, totalAmount) {
    try {
        const supabase = await createClient();
        const { data } = await supabase.auth.getUser();
        
        let profileId = null;
        if (data?.user) {
            const profile = await prisma.profile.findUnique({
                where: { authId: data.user.id },
            });
            if (profile) {
                profileId = profile.id;
            }
        }

        const name = formData.get("name");
        const email = formData.get("email");
        const addressLine1 = formData.get("addressLine1");
        const addressCity = formData.get("addressCity");
        const addressState = formData.get("addressState") || null;
        const addressZip = formData.get("addressZip");
        const addressCountry = formData.get("addressCountry");

        // Simple validation
        if (!name || !email || !addressLine1 || !addressCity || !addressZip || !addressCountry) {
            return { error: "Please fill out all required fields." };
        }
        if (!cartItems || cartItems.length === 0) {
            return { error: "Your cart is empty." };
        }

        // Create the order in a transaction
        const order = await prisma.$transaction(async (tx) => {
            // Validate stock and prepare order items
            const orderItemsInput = [];
            for (const item of cartItems) {
                const variant = await tx.productVariant.findUnique({
                    where: { id: item.variantId },
                });
                
                if (!variant || variant.stock < item.quantity) {
                    throw new Error(`Insufficient stock for ${item.name} (${item.size})`);
                }

                // Decrement stock
                await tx.productVariant.update({
                    where: { id: item.variantId },
                    data: { stock: variant.stock - item.quantity },
                });

                orderItemsInput.push({
                    productId: item.id,
                    productName: item.name,
                    variantId: item.variantId,
                    size: item.size,
                    quantity: item.quantity,
                    price: item.price,
                });
            }

            // Create Order
            return await tx.order.create({
                data: {
                    profileId,
                    status: "PENDING",
                    totalAmount,
                    customerName: name,
                    customerEmail: email,
                    addressLine1,
                    addressCity,
                    addressState,
                    addressZip,
                    addressCountry,
                    items: {
                        create: orderItemsInput,
                    },
                },
            });
        });

        return { success: true, orderId: order.id };
    } catch (err) {
        console.error(err);
        return { error: err.message || "An unexpected error occurred during checkout." };
    }
}
