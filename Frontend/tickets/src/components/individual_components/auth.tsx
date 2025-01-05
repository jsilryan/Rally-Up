import { jwtDecode } from "jwt-decode";

interface DecodedToken {
    exp: number;
    [key: string]: any;
}

export const isAuthenticated = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;

    try {
        const decodedToken = jwtDecode<DecodedToken>(token);  // Cast to DecodedToken
        const { exp } = decodedToken;

        if (Date.now() >= exp * 1000) {
            // Token has expired
            return false;
        }
        return true;
    } catch (e) {
        console.error("Invalid token:", e);
        return false;
    }
};
