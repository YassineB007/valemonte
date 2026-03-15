"use server";

import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function signUp(prevState, formData) {
    const supabase = await createClient();

    const email = formData.get("email");
    const password = formData.get("password");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");

    // 1. Create auth user in Supabase
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
        },
    });

    if (error) {
        return { error: error.message };
    }

    // 2. Create profile in our database
    if (data.user) {
        try {
            await prisma.profile.create({
                data: {
                    authId: data.user.id,
                    email,
                    firstName: firstName || null,
                    lastName: lastName || null,
                },
            });
        } catch (dbError) {
            console.error("Profile creation error:", dbError);
            return { error: "Account created but profile setup failed. Please contact support." };
        }
    }

    return { success: true };
}

export async function signIn(prevState, formData) {
    const supabase = await createClient();

    const email = formData.get("email");
    const password = formData.get("password");

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    redirect("/account");
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/");
}

export async function updateProfile(prevState, formData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated" };
    }

    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const phone = formData.get("phone");

    try {
        await prisma.profile.update({
            where: { authId: user.id },
            data: {
                firstName: firstName || null,
                lastName: lastName || null,
                phone: phone || null,
            },
        });
    } catch (dbError) {
        console.error("Profile update error:", dbError);
        return { error: "Failed to update profile." };
    }

    return { success: true };
}

export async function resetPassword(prevState, formData) {
    const supabase = await createClient();
    const email = formData.get("email");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback?next=/reset-password`,
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true };
}

export async function updatePassword(prevState, formData) {
    const supabase = await createClient();
    const password = formData.get("password");
    const confirm = formData.get("confirm");

    if (password !== confirm) {
        return { error: "Passwords do not match." };
    }

    if (password.length < 6) {
        return { error: "Password must be at least 6 characters." };
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
        return { error: error.message };
    }

    redirect("/account");
}
