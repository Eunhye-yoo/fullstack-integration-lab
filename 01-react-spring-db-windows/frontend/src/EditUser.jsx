import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "" });

  // 특정 유저 정보 로드
  useEffect(() => {
    axios.get(`/users/${id}`).then((res) => {
      setForm({ name: res.data.name, email: res.data.email });
    });
  }, [id]);

  // 수정 요청
  const updateUser = async (e) => {
    e.preventDefault();
    await axios.put(`/users/${id}`, form);
    navigate("/");
  };

  return (
    <div className="container mt-4">
      <h2>Edit User</h2>
      <form onSubmit={updateUser} className="mb-3">
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="form-control"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Update</button>{" "}
        <button type="button" onClick={() => navigate("/")} className="btn btn-secondary">Cancel</button>
      </form>
    </div>
  );
}
