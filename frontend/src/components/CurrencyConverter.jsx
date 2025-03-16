import { useState, useEffect } from "react";
import { getCurrencies } from "../services/api";

export default function CurrencyConverter() {
    const [monedas, setMonedas] = useState([]);
    const [monto, setMonto] = useState("1"); // Usar string para evitar problemas
    const [monedaOrigen, setMonedaOrigen] = useState("MXN"); // Predeterminado a Peso Mexicano
    const [monedaDestino, setMonedaDestino] = useState("USD"); // Predeterminado a Dólar
    const [resultado, setResultado] = useState(0);

    useEffect(() => {
        getCurrencies()
            .then(data => {
                setMonedas(data);
                convertir("1", "MXN", "USD"); // Conversión inicial
            })
            .catch(error => console.error("Error al obtener monedas:", error));
    }, []);

    useEffect(() => {
        if (monedas.length > 0 && monto !== "") {
            convertir(monto, monedaOrigen, monedaDestino);
        }
    }, [monto, monedaOrigen, monedaDestino, monedas]);

    const convertir = (amount, origen, destino) => {
        const montoNumerico = parseFloat(amount);
        if (isNaN(montoNumerico)) return; // Evita errores si el campo está vacío

        const monedaOrigenData = monedas.find(m => m.simbolo === origen);
        const monedaDestinoData = monedas.find(m => m.simbolo === destino);

        if (monedaOrigenData && monedaDestinoData) {
            const valorEnUsdOrigen = monedaOrigenData.valor_usd;
            const valorEnUsdDestino = monedaDestinoData.valor_usd;
            const montoConvertido = (montoNumerico / valorEnUsdOrigen) * valorEnUsdDestino;
            setResultado(montoConvertido.toFixed(2));
        }
    };

    return (
        <div className="ml-64 flex items-center justify-center min-h-screen p-6 bg-gray-900 text-white flex-col gap-10 ">
            <h1 className="text-center  font-bold text-5xl">
                QUANTUM<span className="text-cyan-400">PAY</span>
            </h1>
            <div className="max-w-lg p-6 bg-gray-900 rounded-lg shadow-lg border border-cyan-500 text-white">
                <h2 className="text-3xl font-semibold text-cyan-400 text-center mb-4">Conversor de Moneda</h2>

                {/* Entrada de Monto */}

                <div className="mb-4">
                    <label className="block text-gray-400 text-sm font-medium">Monto</label>
                    <input
                        type="text" // Cambiamos a "text" para evitar que el navegador fuerce valores numéricos
                        value={monto}
                        onChange={(e) => {
                            const newValue = e.target.value;
                            if (/^\d*\.?\d*$/.test(newValue)) { // Solo permitir números y punto decimal
                                setMonto(newValue);
                            }
                        }}
                        className="w-full p-3 mt-1 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-500"
                    />
                </div>

                {/* Selección de Moneda Origen */}
                <div className="mb-4">
                    <label className="block text-gray-400 text-sm font-medium">Moneda de Origen</label>
                    <select
                        value={monedaOrigen}
                        onChange={(e) => {
                            setMonedaOrigen(e.target.value);
                            convertir(monto, e.target.value, monedaDestino);
                        }}
                        className="w-full p-3 mt-1 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-500"
                    >
                        {monedas.map(m => (
                            <option key={m.simbolo} value={m.simbolo}>
                                {m.nombre} ({m.simbolo})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Selección de Moneda Destino */}
                <div className="mb-4">
                    <label className="block text-gray-400 text-sm font-medium">Moneda de Destino</label>
                    <select
                        value={monedaDestino}
                        onChange={(e) => {
                            setMonedaDestino(e.target.value);
                            convertir(monto, monedaOrigen, e.target.value);
                        }}
                        className="w-full p-3 mt-1 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-cyan-500"
                    >
                        {monedas.map(m => (
                            <option key={m.simbolo} value={m.simbolo}>
                                {m.nombre} ({m.simbolo})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Resultado de la Conversión */}
                <div className="text-center mt-6">
                    <p className="text-lg text-gray-300">Resultado:</p>
                    <p className="text-3xl font-bold text-cyan-400">{resultado} {monedaDestino}</p>
                </div>
            </div>
        </div>
    );
}
