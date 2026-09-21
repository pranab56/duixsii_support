export const saveToken = (token: string): void => {
    if (!token) return;
    localStorage.setItem("douxsii-support-token", token);
    localStorage.setItem("accessToken", token);
    // Set cookies so any middleware or external handler can access it
    document.cookie = `douxsii-support-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    document.cookie = `douxsii-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
};

export const getToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("douxsii-support-token") || localStorage.getItem("accessToken") || null;
};

export const removeToken = (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("douxsii-support-token");
    localStorage.removeItem("accessToken");
    // Remove cookies
    document.cookie = "douxsii-support-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "douxsii-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};

