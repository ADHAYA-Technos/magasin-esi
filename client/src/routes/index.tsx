import { ReactNode } from "react";
import { Route } from "react-router-dom";
import PageWrapper from "../components/layout/PageWrapper.tsx";
import serviceAchatsRoutes from "./asaRoutes.tsx";
import consommateurRoutes from "./consommateurRoutes.tsx";
import magasinierRoutes from "./magasinierRoutes.tsx";
import rsrRoutes from "./rsrRoutes.tsx";
import adminRoutes from "./adminRoutes.tsx";
import directorRoutes from "./directorRoutes.tsx";
import { RouteType } from "./config";


import React, { useState, useEffect } from 'react';

const generateRoute = (routes: RouteType[]): ReactNode => {
  return routes.map((route, index) => (
    route.index ? (
      <Route
        index
        path={route.path}
        element={<PageWrapper state={route.state}>
          {route.element}
        </PageWrapper>}
        key={index}
      />
    ) : (
      <Route
        path={route.path}
        element={
          <PageWrapper state={route.child ? undefined : route.state}>
            {route.element}
          </PageWrapper>
        }
        key={index}
      >
        {route.child && (
          generateRoute(route.child)
        )}
      </Route>
    )
  ));
};
export const ASAROUTES: ReactNode = generateRoute(serviceAchatsRoutes);
export const ADMINROUTES: ReactNode = generateRoute(adminRoutes);
export const MAGASINIERROUTES: ReactNode = generateRoute(magasinierRoutes);
export const  RSR: ReactNode = generateRoute(rsrRoutes);
export const DIRECTOR: ReactNode = generateRoute(directorRoutes);
export const CONSOMATEUR: ReactNode = generateRoute(consommateurRoutes);




