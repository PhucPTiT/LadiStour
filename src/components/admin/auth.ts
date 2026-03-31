import { getCookie, clearCookie } from "@/config/base-service";

export const ADMIN_AUTH_EVENT = "admin-auth-change";

/**
 * Get admin authentication status by checking for valid token
 */
export function getAdminAuth(): boolean {
    if (typeof window === "undefined") {
        return false;
    }

    const token = getCookie("token");
    const isAuthed = !!token;

    if (process.env.NODE_ENV === "development") {
        console.log("[getAdminAuth] token:", token ? "exists" : "null", "isAuthed:", isAuthed);
    }

    return isAuthed;
}

/**
 * Clear admin authentication (remove token)
 * This is typically called on logout
 */
export function clearAdminAuth(): void {
    if (typeof window === "undefined") {
        return;
    }

    clearCookie("token");
    window.dispatchEvent(new Event(ADMIN_AUTH_EVENT));
}

/**
 * Get the authentication token from cookies
 */
export function getAuthToken(): string | undefined {
    if (typeof window === "undefined") {
        return undefined;
    }

    return getCookie("token");
}

