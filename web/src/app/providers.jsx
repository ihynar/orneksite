"use client";

import { AuthProvider } from "../context/AuthContext";
import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Providers = ({ children }) => {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);
  return <AuthProvider>{children}</AuthProvider>;
};

export default Providers;
