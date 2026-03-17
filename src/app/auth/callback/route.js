import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type") || "signup";
    const next = searchParams.get("next") ?? "/verified";

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    if (token_hash && type) {
        const supabase = await createClient();
        const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type,
        });

        if (!error) {
            // If it's a recovery/reset password, we want to go exactly where "next" says
            return NextResponse.redirect(`${origin}${next}`);
        }
    }

    // If no code or error, redirect to login
    return NextResponse.redirect(`${origin}/login`);
}
