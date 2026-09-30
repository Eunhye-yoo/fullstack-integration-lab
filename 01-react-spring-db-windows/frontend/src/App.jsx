import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserList from "./UserList";
import EditUser from "./EditUser";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserList />} />
        <Route path="/edit/:id" element={<EditUser />} />
      </Routes>
    </BrowserRouter>
  );
}
