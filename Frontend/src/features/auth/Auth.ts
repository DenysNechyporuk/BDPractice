export function getToken() {
    return localStorage.getItem("token") ?? sessionStorage.getItem("token");
}

export function saveToken(token: string) {
        localStorage.setItem("token", token);
}

export function logout() {
    localStorage.removeItem("token");
}

export function isAuthenticated() {
    return Boolean(getToken());
}