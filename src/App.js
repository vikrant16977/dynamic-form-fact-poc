import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminPage from "./pages/AdminPage"
import UserPage from "./pages/UserPage";
import { FormProvider } from "./context/FormContext";

const App = () => {
  return (
    <FormProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/admin" />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/form" element={<UserPage />} />
        </Routes>
      </Router>
    </FormProvider>
  );
};

export default App;
