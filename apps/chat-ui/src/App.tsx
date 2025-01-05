import "./App.css";
import { Navbar } from "./components/app/navbar";
import { Views } from "./components/app/views";
import { useSocketSetup } from "./hooks/useSocketSetup";

function App() {
  useSocketSetup();

  return (
    <>
      <Navbar />
      <Views />
    </>
  );
}

export default App;
