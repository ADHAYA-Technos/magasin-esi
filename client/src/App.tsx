import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout.tsx";

import {ASAROUTES,MAGASINIERROUTES,ADMINROUTES} from "./routes/index.tsx";
import React from "react";
import LoginSignUp from "./pages/LoginSignUp/LoginSignUp.tsx";
import EmailConfirmation from "./pages/LoginSignUp/emailConfirmation.tsx";
function App() {
  
  return (

    <BrowserRouter>
      <Routes>

       
         <Route path="/emailConfirmation" element={<EmailConfirmation />}/>
      
        <Route path="/login" element={<LoginSignUp />}/>
       <Route path="/" element={<MainLayout />}>
       
          {ASAROUTES}
          {MAGASINIERROUTES}
        </Route>
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;