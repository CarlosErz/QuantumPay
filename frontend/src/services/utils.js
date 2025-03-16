export const decodeToken = (token) => {
    try {
      const base64Url = token.split(".")[1]; // Extraer la parte del payload
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
  
      return JSON.parse(jsonPayload); // Convertir a objeto JSON
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  };
  