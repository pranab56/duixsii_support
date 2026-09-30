export const saveToken = (token: string): void => {
    if (!token) return;
    localStorage.setItem("Denior-support-token", token);
    localStorage.setItem("accessToken", token);
    // Set cookies so any middleware or external handler can access it
    document.cookie = `Denior-support-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    document.cookie = `Denior-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
};

export const getToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("Denior-support-token") || localStorage.getItem("accessToken") || null;
};

export const removeToken = (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("Denior-support-token");
    localStorage.removeItem("accessToken");
    // Remove cookies
    document.cookie = "Denior-support-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "Denior-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};

