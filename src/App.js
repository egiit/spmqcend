import { Route, Routes } from "react-router-dom";
import ProtectedRouter from "./auth/ProtectedRouter";
import MainLayout from "./components/MainLayout";
import QcMap from "./map/QcMap";
import Login from "./page/Login";
import Main from "./page/Main";
import { Message } from "./partial/Message";
import { Flasher } from "react-universal-flash";

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
      </Route>
    </Routes>
  );
}

export default App;
