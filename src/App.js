import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Home";
import Studio from "./Studio";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/studio" element={<Studio />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
