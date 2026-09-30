import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "" });
  const navigate = useNavigate();


  // 데이터 불러오기
  const loadUsers = async () => {
    const res = await axios.get("/users");
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // 새 유저 추가
  const addUser = async (e) => {
    e.preventDefault();
    await axios.post("/users", form);
    setForm({ name: "", email: "" });
    loadUsers();
  };

  // 유저 삭제
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    await axios.delete(`/users/${id}`);
    loadUsers();
  };

  const editUser = async (id) => {
    try {
        const res = await axios.get(`http://54.180.94.5:8081/users/${id}`);
        if(res.status !== 200) {
            throw new Error('Network response was not ok')
        };

        console.log('User data fetched successfully:', res);
        // const data = await res.json();

        navigate(`/edit/${id}`, { state: { user: res.data }});
    } catch (error) {
        console.error('Failed to fetch user:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2>User List</h2>

      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <button onClick={() => editUser(u.id)} className="btn btn-sm btn-info">Edit</button>{" "}
                <button onClick={() => deleteUser(u.id)} className="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Add New User</h3>
      <form onSubmit={addUser} className="row g-3">
        <div className="col-md-5">
          <input
            type="text"
            placeholder="Name"
            className="form-control"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="col-md-5">
          <input
            type="email"
            placeholder="Email"
            className="form-control"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-success w-100">Add</button>
        </div>
      </form>
    </div>
  );
}
