import { getCurrencies } from "../services/api";
import { useEffect, useState, useRef } from "react";

export default function CointsList() {
    const [monedas, setMonedas] = useState([]);
    const imgRefs = useRef({}); // Referencias a imágenes para el Intersection Observer

    useEffect(() => {
        getCurrencies()
            .then((data) => {
                setMonedas(data);
            })
            .catch(error => console.error("Error al cargar monedas:", error));
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src; // Cargar la imagen cuando sea visible
                        observer.unobserve(img); // Dejar de observarla
                    }
                });
            },
            { rootMargin: "50px" } // Cargar un poco antes de que aparezca en pantalla
        );

        // Observar todas las imágenes
        Object.values(imgRefs.current).forEach((img) => {
            if (img) observer.observe(img);
        });

        return () => observer.disconnect();
    }, [monedas]); // Se ejecuta cuando cambian las monedas

    return (
        <div className="max-w-3xl mx-auto p-6 bg-gray-900 rounded-lg shadow-md border border-gray-700">
            <h2 className="text-3xl font-semibold text-cyan-400 text-center mb-4">Lista de Monedas</h2>
            <ul className="space-y-3">
                {monedas.map((moneda) => (
                    <li
                        key={moneda.id}
                        className="flex items-center p-4 bg-gray-800 rounded-lg shadow-md border border-gray-600 hover:border-cyan-400 hover:shadow-lg transition"
                    >
                        <img
                            ref={(el) => (imgRefs.current[moneda.id] = el)}
                            data-src={`https://flagcdn.com/w40/${moneda.simbolo.toLowerCase().slice(0, 2)}.png`}
                            alt={moneda.nombre}
                            className="w-10 h-6 rounded-md border border-gray-500 opacity-0 transition-opacity duration-700"
                            onLoad={(e) => e.target.classList.add("opacity-100")}
                        />
                        <span className="ml-4 text-lg font-medium text-gray-200">
                            {moneda.nombre} <span className="text-cyan-400">({moneda.simbolo})</span>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};
