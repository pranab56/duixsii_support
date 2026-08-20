export const saveToken = (token: string): void => {
    localStorage.setItem("drebalAdmin", token);
};

export const getToken = (): string | null => {
    return localStorage.getItem("drebalAdmin");
};

export const removeToken = (): void => {
    localStorage.removeItem("drebalAdmin");
    localStorage.removeItem("adminLoginId");
};

export const isAuthenticated = (): boolean => {
    return !!getToken();
};
