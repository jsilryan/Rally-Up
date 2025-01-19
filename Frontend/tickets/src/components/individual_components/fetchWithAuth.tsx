import { jwtDecode } from "jwt-decode"
import { serverLink } from "../../constants";

const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
    let token: string | null = localStorage.getItem('accessToken');

    if (!token || isExpired(token)) {
        const refreshToken: string | null = localStorage.getItem('refreshToken');

        if (!refreshToken) {
            console.error("Refresh token is missing. Redirecting to login...");
            redirectToLogin();
            throw new Error("Authentication required");
        }

        try {
            const response = await fetch(`${serverLink}/refresh_token`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ refreshToken }),
            });

            if (!response.ok) {
                console.error("Failed to refresh token. Redirecting to login...");
                redirectToLogin();
                throw new Error("Authentication required");
            }

            const data = await response.json();
            token = data.accessToken;

            if (token) {
                localStorage.setItem('accessToken', token);
            } else {
                throw new Error("Access token not received");
            }
        } catch (error) {
            console.error("Error refreshing token:", error);
            redirectToLogin();
            throw error;
        }
    }

    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
        },
    });
};

const isExpired = (token: string): boolean => {
    try {
        const { exp } = jwtDecode<{ exp: number }>(token); // Add typing for decoded token
        return Date.now() >= exp * 1000;
    } catch (error) {
        console.error("Invalid token:", error);
        return true;
    }
};

const redirectToLogin = (): void => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = "/login";
};

export default fetchWithAuth;