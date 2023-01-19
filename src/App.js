import { Route, Routes } from "react-router-dom";
import ProtectedRouter from "./auth/ProtectedRouter";
import MainLayout from "./components/MainLayout";
import QcMap from "./map/QcMap";
import Login from "./page/Login";
import Main from "./page/Main";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        element={
          <ProtectedRouter>
            <MainLayout />
          </ProtectedRouter>
        }
      >
        <Route element={<QcMap />}>
          <Route path="maininput" element={<Main />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
