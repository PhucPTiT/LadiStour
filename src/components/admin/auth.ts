export const ADMIN_AUTH_KEY = "stour_admin_auth";
export const ADMIN_AUTH_EVENT = "admin-auth-change";

export function getAdminAuth(): boolean {
    if (typeof window === "undefined") {
        return false;
    }

    return window.localStorage.getItem(ADMIN_AUTH_KEY) === "true";
}

export function setAdminAuth(value: boolean) {
    if (typeof window === "undefined") {
        return;
    }

    if (value) {
        window.localStorage.setItem(ADMIN_AUTH_KEY, "true");
        window.dispatchEvent(new Event(ADMIN_AUTH_EVENT));
        return;
    }

    window.localStorage.removeItem(ADMIN_AUTH_KEY);
    window.dispatchEvent(new Event(ADMIN_AUTH_EVENT));
}
