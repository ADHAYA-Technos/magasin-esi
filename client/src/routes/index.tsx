import { ReactNode } from "react";
import { Route } from "react-router-dom";
import PageWrapper from "../components/layout/PageWrapper.tsx";
import adminRoutes from "./appRoutes.tsx";
import serviceAchatsRoutes from "./asaRoutes.tsx";
import magasinierRoutes from "./magasinierRoutes.tsx";
import { RouteType } from "./config";
import  chef_serviceRoutes from "./chef_serviceRoutes.tsx";


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
export const CHFEFSERVICE: ReactNode = generateRoute(chef_serviceRoutes);
export const MAGASINIERROUTES: ReactNode = generateRoute(magasinierRoutes);


