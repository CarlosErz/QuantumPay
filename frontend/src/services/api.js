const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
import { decodeToken } from "./utils";

/**
 * Función genérica para hacer peticiones a la API con manejo de autenticación.
 * @param {string} endpoint - Ruta del endpoint (ej. "/monedas/")
 * @param {string} method - Método HTTP (ej. "GET", "POST", "PUT", "DELETE")
 * @param {object} body - Cuerpo de la petición en caso de ser necesario (JSON)
 * @returns {Promise<any>} - Retorna la respuesta de la API en formato JSON
 */
export const apiRequest = async (endpoint, method = "GET", body = null) => {
    const token = localStorage.getItem("token"); // Recupera el token guardado
    const headers = {
        "Content-Type": "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const options = {
        method,
        headers,
    };

    if (body) {
        options.body = JSON.stringify(body);
        console.log(body);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        if (!response.ok) {
            throw new Error(`Error en ${method} ${endpoint}: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error en la API:", error);
        throw error;
    }
};

/**
 * Obtiene la lista de monedas.
 */
export const getCurrencies = async () => {
    return apiRequest("/monedas/");
};

/**
 * Función para iniciar sesión y obtener el token.
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña
 */
export const login = async (username, password) => {
    const formData = new URLSearchParams();
    formData.append("grant_type", "password");
    formData.append("username", username);
    formData.append("password", password);
    formData.append("scope", "");
    formData.append("client_id", "");
    formData.append("client_secret", "");

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error("Error en la autenticación");
        }

        const data = await response.json();

        // Guardar el token en localStorage
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", data.username)

        // Decodificar el token para obtener el rol
        const decodedToken = decodeToken(data.access_token);
        const isAdmin = decodedToken && decodedToken.sub === "admin"; // Ajusta según tu token

        localStorage.setItem("isAdmin", isAdmin);

        return { isAdmin };
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        return null;
    }
};


// services/api.js
export const updateTasas = async () => {
    const token = localStorage.getItem("token");
    const response = await fetch(
        `${API_URL}/actualizar-tasas`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error("Error actualizando las tasas");
    }

    // Retornamos el JSON que contiene "mensaje", "monedas_actualizadas", etc.
    return await response.json();
};
