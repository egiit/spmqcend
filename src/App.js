import { Route, Routes } from "react-router-dom";
import ProtectedRouter from "./auth/ProtectedRouter";
import MainLayout from "./components/MainLayout";
import QcMap from "./map/QcMap";
import Login from "./page/Login";
import Main from "./page/Main";
import { Message } from "./partial/Message";
import { Flasher } from "react-universal-flash";
import Reporting from "./page/Reporting";
import InputLog from "./page/InputLog";
import "./App.css";

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
      </Route>
    </Routes>
  );
}

export default App;
