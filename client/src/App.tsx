import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout.tsx";
<<<<<<< HEAD

import {ASAROUTES,MAGASINIERROUTES,ADMINROUTES} from "./routes/index.tsx";
=======
import {ASAROUTES,MAGASINIERROUTES,RSR,DIRECTOR,CONSOMATEUR} from "./routes/index.tsx";
>>>>>>> aadca5b038b356a56f0ae69523035f05159894ae
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

          {CONSOMATEUR}
          {RSR}
          {DIRECTOR}

          {MAGASINIERROUTES}
          
          {CHFEFSERVICE}
        </Route>
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;