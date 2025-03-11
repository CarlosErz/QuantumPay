import "./App.css";
import CointsList from "./components/CointsList";
import CurrencyConverter from "./components/CurrencyConverter";

function App() {
  return (
    <>
      <div className="">
        <h1 className="text-center p-10 font-bold">QUANTUM<span className="text-cyan-400">PAY</span></h1>
        <CointsList />
        <CurrencyConverter />
      </div>

    </>
  );
}

export default App;
