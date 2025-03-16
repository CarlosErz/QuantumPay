import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

const Login = ({ setIsAdmin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        const result = await login(username, password);
        if (result && result.isAdmin) {
            setIsAdmin(true);
            alert("Inicio de sesión exitoso");
            navigate("/"); // Redirige al home
        } else {
            setError("Credenciales incorrectas o no eres administrador");
        }
    };

    return (
        <div className="flex items-center justify-center w-full min-h-screen bg-gray-900">
            {/* Contenedor interno para el formulario */}
            <div className="bg-gray-800 p-6 rounded shadow-lg w-full max-w-sm text-white">
                <h2 className="text-2xl font-bold mb-4 text-center">Iniciar Sesión</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="p-2 border border-gray-700 rounded bg-gray-700 focus:outline-none"
                        required
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-2 border border-gray-700 rounded bg-gray-700 focus:outline-none"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-semibold"
                    >
                        Iniciar Sesión
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
