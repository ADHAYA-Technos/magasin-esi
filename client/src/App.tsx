import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout.tsx";
import { routes } from "./routes/index.tsx";
import React from "react";
import LoginSignUp from "./pages/LoginSignUp/LoginSignUp.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginSignUp />}>
          {routes}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;