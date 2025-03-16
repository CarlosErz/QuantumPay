import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CointsList from "./components/CointsList";
import CurrencyConverter from "./components/CurrencyConverter";
import Login from "./components/Login";
import { updateTasas } from "./services/api";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(localStorage.getItem("isAdmin") === "true");
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login setIsAdmin={setIsAdmin} />} />
      <Route path="/" element={<MainApp isAdmin={isAdmin} />} />
    </Routes>
  );
}

// Modal para mostrar la respuesta de la actualización
function SuccessModal({ data, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md max-w-md w-full text-center">
        <h2 className="text-2xl font-bold mb-4 text-green-600">
          ¡Tasas actualizadas con éxito!
        </h2>
        <p className="text-gray-700 mb-2">{data.mensaje}</p>
        <p className="text-gray-700 mb-2">
          Monedas actualizadas: <strong>{data.monedas_actualizadas}</strong>
        </p>
        <p className="text-gray-700 mb-2">
          Monedas creadas: <strong>{data.monedas_creadas}</strong>
        </p>
        <p className="text-gray-700 mb-4">
          Última actualización: <strong>{data.ultima_actualizacion}</strong>
        </p>
        <button
          onClick={onClose}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded font-semibold"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

// Modal para confirmar cierre de sesión
function LogoutModal({ onClose, onLogout }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md max-w-sm w-full text-center text-gray-900">
        <h2 className="text-2xl font-bold mb-4">Cerrar Sesión</h2>
        <p className="mb-4">¿Estás seguro de que deseas cerrar sesión?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onLogout}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
          >
            Cerrar Sesión
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

function MainApp({ isAdmin }) {
  const [updateData, setUpdateData] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const navigate = useNavigate();
  // Se obtiene el username desde la key "user" en localStorage
  const username = localStorage.getItem("user");

  const handleUpdate = async () => {
    try {
      const result = await updateTasas();
      setUpdateData(result);
    } catch (error) {
      console.error(error);
      alert("Hubo un error al actualizar las tasas.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      {/* Navbar horizontal solo se muestra si hay usuario */}
      {username && (
        <nav className="fixed top-0 left-0 w-full bg-gray-800 p-4 flex items-center justify-between z-40">
          <div className="flex items-center">
            {/* Avatar redondo con la primera letra del username */}
            <div
              className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-2 cursor-pointer hover:bg-blue-700 transition-colors"
              onClick={() => setShowLogout(true)}
            >
              <span className="text-xl font-bold">
                {username.charAt(0).toUpperCase()}
              </span>
            </div>
            {/* Username al lado del avatar */}
            <span className="text-white font-semibold">{username}</span>
          </div>
          {isAdmin && (
            <button
              onClick={handleUpdate}
              className="bg-gradient-to-r from-green-400 to-green-500 text-white py-2 px-4 rounded shadow-lg hover:from-green-500 hover:to-green-600 hover:scale-105 transition-transform duration-300"
            >
              Actualizar Monedas
            </button>
          )}
        </nav>
      )}

      {/* Ajustar el espacio del contenido según si existe navbar */}
      <div className={username ? "pt-20" : ""}>
        <CointsList />
        <CurrencyConverter />
      </div>

      {/* Modal para la respuesta de actualización */}
      {updateData && (
        <SuccessModal data={updateData} onClose={() => setUpdateData(null)} />
      )}

      {/* Modal para cerrar sesión */}
      {showLogout && (
        <LogoutModal
          onClose={() => setShowLogout(false)}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}

export default App;
