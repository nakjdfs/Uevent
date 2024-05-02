import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { privateRoutes, publicRoutes } from "./routes";
import { useContextProvider } from "../components/ContextProvider";

const AppRouter = () => {
    const {userData} = useContextProvider();
    return (
        <Routes>
            {userData.role != "Guest" && privateRoutes.map(({ path, Component }) =>
                <Route key={path} path={path} element={<Component />} exact />
            )}
            {publicRoutes.map(({ path, Component }) =>
                <Route key={path} path={path} element={<Component />} exact />
            )}
            <Route path={'*'} element={<Navigate to={"/"} />} />
        </Routes>
    )
}

export default AppRouter;