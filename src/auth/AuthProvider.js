import React, { useState, createContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";
// import axios from 'axios';
import jwt_decode from "jwt-decode";
import axios from "../axios/axios.js";
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [token, setToken] = useState("");
  const [expire, setExpire] = useState("");
  const [qcName, setQcName] = useState("");
  const [qcType, setQcType] = useState("");
  const [siteName, setSiteName] = useState("");
  const [lineName, setLineName] = useState("");
  const [idSiteLine, setIdSiteLine] = useState("");
  const [shift, setShift] = useState("");
  const [groupId, setGroupId] = useState("");

  useEffect(() => {
    const refreshToken = async () => {
      return await axios
        .get(`/tokenQc13`)
        .then((response) => {
          setToken(response.data.accessToken);
          const decoded = jwt_decode(response.data.accessToken);
          localStorage.setItem("token", response.data.accessToken);
          setUserId(decoded.userId);
          setUsername(decoded.username);
          setQcName(decoded.qcName);
          setExpire(decoded.exp);
          setQcType(decoded.qcType);
          setSiteName(decoded.siteName);
          setLineName(decoded.lineName);
          setIdSiteLine(decoded.idSiteLine);
          setShift(decoded.shift);
          setGroupId(decoded.groupId);
        })
        .catch((error) => {
          if (error.response) return navigate("/");
        });
    };
    setInterval(() => {
      if (localStorage.getItem("token")) {
        refreshToken();
      }
    }, 30 * 60 * 1000);
  }, []);

  const initialState = { spin: false };
  const reducer = (state, action) => {
    switch (action.type) {
      case "LAUNCH_LOADING":
        return { spin: action.payload };
      default:
        return state;
    }
  };

  const [loading, dispatchaut] = useReducer(reducer, initialState);

  const value = {
    userId,
    username,
    token,
    expire,
    qcName,
    qcType,
    siteName,
    lineName,
    idSiteLine,
    shift,
    groupId,
  };

  return (
    <AuthContext.Provider value={{ value, loading, dispatchaut }}>
      {children}
    </AuthContext.Provider>
  );
};
