import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRouter from "./auth/ProtectedRouter";
import MainLayout from "./components/MainLayout";
import QcMap from "./map/QcMap";
import Login from "./page/Login";
import { Message } from "./partial/Message";
import { Flasher } from "react-universal-flash";
import "./App.css";

const Main = lazy(() => import("./page/Main"));

const Reporting = lazy(() => import("./page/Reporting"));

const InputLog = lazy(() => import("./page/InputLog"));

const ConfirmSewing = lazy(() => import("./page/ConfirmSewing"));

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        element={
          <ProtectedRouter>
            <Flasher position="bottom_center">
              <Message />
            </Flasher>
            <QcMap>
              <MainLayout />
            </QcMap>
          </ProtectedRouter>
        }
      >
        <Route path="maininput" element={<Main />} />
        <Route path="/reporting" element={<Reporting />} />
        <Route path="/inputlog" element={<InputLog />} />
        <Route path="/confirmsewing" element={<ConfirmSewing />} />
      </Route>
    </Routes>
  );
}

export default App;
