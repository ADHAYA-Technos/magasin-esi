import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout.tsx";
import { routes } from "./routes/index.tsx";
import React from "react";
import LoginSignUp from "./pages/LoginSignUp/LoginSignUp.tsx";
import Admin from "./Admin.js";
import EmailConfirmation from "./pages/LoginSignUp/emailConfirmation.tsx";
function App() {
  return (
    <BrowserRouter>
      <Routes>

       
         <Route path="/emailConfirmation" element={<EmailConfirmation />}/>
      
        <Route path="/" element={<MainLayout />}>
          {routes}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;