import {jwtDecode} from "jwt-decode";


export function getToken() {
    return localStorage.getItem("token") ?? sessionStorage.getItem("token");
}

export function saveToken(token: string) {
        localStorage.setItem("token", token);
}

export function logout() {
    localStorage.removeItem("token");
    window.location.href = "/";
}

export function isAuthenticated() {
    return Boolean(getToken());
}

export function isTokenExpired(token = getToken()) {
    if (!token) return true;

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000; 
        
        if (!decoded.exp) {
            return true;
        }

        return decoded.exp < currentTime;
    } catch (error) {
        return true;
    }
}