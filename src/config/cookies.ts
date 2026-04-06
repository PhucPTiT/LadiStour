import { cookies } from "next/headers";

export async function getServerToken(): Promise<string> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) return "";

        return `Bearer ${token.replace(/[Bb]earer\s+/, "").trim()}`;
    } catch {
        return "";
    }
}