export function getToken() {
    return localStorage.getItem("token") ?? sessionStorage.getItem("token");
}

export function saveToken(token: string, remember?: boolean) {
    if (remember) {
        localStorage.setItem("token", token);
        sessionStorage.removeItem("token");
    } else {
        sessionStorage.setItem("token", token);
        localStorage.removeItem("token");
    }
}

export function logout() {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
}

export function isAuthenticated() {
    return Boolean(getToken());
}