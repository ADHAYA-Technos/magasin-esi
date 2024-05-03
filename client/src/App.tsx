import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout.tsx";
<<<<<<< HEAD
import { ASAROUTES } from "./routes/index.tsx";
import { CONSOMATEUR } from "./routes/index.tsx";
import { MAGASINIERROUTES } from "./routes/index.tsx";
=======

import {ASAROUTES,MAGASINIERROUTES,ADMINROUTES} from "./routes/index.tsx";
>>>>>>> c6b1de4297cdce19a8d7cbccec53de73c3c1d24a
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
<<<<<<< HEAD
          {CONSOMATEUR}

=======
          {MAGASINIERROUTES}
>>>>>>> c6b1de4297cdce19a8d7cbccec53de73c3c1d24a
        </Route>
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;