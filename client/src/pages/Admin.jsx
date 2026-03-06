import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const {
    user,
    setShowLogin,
    isAuthLoading,
    fetchAdminUsers,
    adminCreateUser,
    adminUpdateCredits,
    adminDeleteUser,
    fetchAdminStats
  } = useContext(AppContext);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [creditsDraft, setCreditsDraft] = useState({});
  const [stats, setStats] = useState({ totalUsers: 0, totalCreditsUsed: 0, totalShortLinks: 0 });
  const [loginLogs, setLoginLogs] = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [createForm, setCreateForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    creditBalance: "5",
  });

  const loadUsers = async () => {
    setLoading(true);
    const list = await fetchAdminUsers();
    setUsers(list);
    const draft = {};
    list.forEach((u) => {
      draft[u._id] = String(u.creditBalance ?? 0);
    });
    setCreditsDraft(draft);
    setLoading(false);
  };

  const loadStats = async () => {
    setStatsLoading(true);
    const data = await fetchAdminStats();
    setStats(data.stats || { totalUsers: 0, totalCreditsUsed: 0 });
    setLoginLogs(data.recentLogins || []);
    setStatsLoading(false);
  };

  useEffect(() => {
    if (user?.role === "admin") {
      loadUsers();
      loadStats();
    }
  }, [user]);

  if (isAuthLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center gap-4">
        <h1 className="text-2xl font-semibold">Admin Access</h1>
        <p className="text-gray-600">Please login to continue.</p>
        <button
          onClick={() => setShowLogin(true)}
          className="bg-zinc-800 text-white px-6 py-2 rounded-full"
        >
          Login
        </button>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center gap-4">
        <h1 className="text-2xl font-semibold">Access Denied</h1>
        <p className="text-gray-600">You do not have admin permissions.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-zinc-800 text-white px-6 py-2 rounded-full"
        >
          Go Home
        </button>
      </div>
    );
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    if (isCreating) return;
    setIsCreating(true);
    const payload = {
      name: createForm.name.trim(),
      email: createForm.email.trim(),
      password: createForm.password,
      role: createForm.role,
      creditBalance: Math.min(15, Number(createForm.creditBalance || 0)),
    };
    const created = await adminCreateUser(payload);
    if (created) {
      setCreateForm({ name: "", email: "", password: "", role: "user", creditBalance: "5" });
      setShowCreateModal(false);
      loadUsers();
      loadStats();
    }
    setIsCreating(false);
  };

  const handleUpdateCredits = async (id) => {
    if (updatingId) return;
    setUpdatingId(id);
    const value = Math.min(15, Number(creditsDraft[id]));
    const updated = await adminUpdateCredits(id, value);
    if (updated) {
      setUsers((prev) => prev.map((u) => (u._id === id ? updated : u)));
      setCreditsDraft((prev) => ({ ...prev, [id]: String(updated.creditBalance) }));
    }
    setUpdatingId("");
  };

  const handleDeleteUser = async (id) => {
    if (deletingId) return;
    setDeletingId(id);
    const ok = await adminDeleteUser(id);
    if (ok) {
      setUsers((prev) => prev.filter((u) => u._id !== id));
      loadStats();
    }
    setDeletingId("");
  };

  return (
    <div className="py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-2">Admin Panel</h1>
        <p className="text-gray-600">Manage users and credits</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Total Users</p>
          <p className="text-2xl font-semibold">{statsLoading ? "..." : stats.totalUsers}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Credits Used</p>
          <p className="text-2xl font-semibold">{statsLoading ? "..." : stats.totalCreditsUsed}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5">
          <p className="text-sm text-gray-500">Short Links</p>
          <p className="text-2xl font-semibold">{statsLoading ? "..." : stats.totalShortLinks}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Login Logs</p>
            <p className="text-2xl font-semibold">{statsLoading ? "..." : loginLogs.length}</p>
          </div>
          <button
            onClick={loadStats}
            className="text-sm px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200"
            disabled={statsLoading}
          >
            {statsLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Users</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={loadUsers}
            className="text-sm px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200"
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-sm px-4 py-2 rounded-full bg-blue-600 text-white"
          >
            Add New User
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-10">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Role</th>
                <th className="py-2">Credits</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b">
                  <td className="py-3">{u.name}</td>
                  <td className="py-3">{u.email}</td>
                  <td className="py-3 capitalize">{u.role}</td>
                  <td className="py-3">
                    <input
                      type="number"
                      min="0"
                      max="15"
                      className="border rounded-lg p-1 w-24"
                      value={creditsDraft[u._id] ?? ""}
                      onChange={(e) => setCreditsDraft({ ...creditsDraft, [u._id]: e.target.value })}
                    />
                    <p className="text-xs text-gray-400 mt-1">Max 15</p>
                  </td>
                  <td className="py-3 flex gap-2">
                    <button
                      onClick={() => handleUpdateCredits(u._id)}
                      className="px-3 py-1 rounded-full bg-blue-600 text-white disabled:opacity-60"
                      disabled={updatingId === u._id}
                    >
                      {updatingId === u._id ? "Updating..." : "Update"}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(u._id)}
                      className="px-3 py-1 rounded-full bg-red-600 text-white disabled:opacity-60"
                      disabled={deletingId === u._id}
                    >
                      {deletingId === u._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && !loading && (
            <p className="text-gray-500 mt-4">No users found.</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Login Logs</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-500 border-b">
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Role</th>
                <th className="py-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {loginLogs.map((log) => (
                <tr key={`${log.email}-${log.createdAt}`} className="border-b">
                  <td className="py-3">{log.name}</td>
                  <td className="py-3">{log.email}</td>
                  <td className="py-3 capitalize">{log.role}</td>
                  <td className="py-3">{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {loginLogs.length === 0 && !statsLoading && (
            <p className="text-gray-500 mt-4">No login logs found.</p>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow p-6 w-full max-w-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Create User</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-sm text-gray-500"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="border rounded-lg p-2"
                placeholder="Full Name"
                value={createForm.name}
                onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                required
              />
              <input
                className="border rounded-lg p-2"
                placeholder="Email"
                type="email"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                required
              />
              <input
                className="border rounded-lg p-2"
                placeholder="Password"
                type="password"
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                required
              />
              <div className="flex gap-3">
                <select
                  className="border rounded-lg p-2 flex-1"
                  value={createForm.role}
                  onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
                <input
                  className="border rounded-lg p-2 w-32"
                  placeholder="Credits"
                  type="number"
                  min="0"
                  max="15"
                  value={createForm.creditBalance}
                  onChange={(e) => setCreateForm({ ...createForm, creditBalance: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 flex gap-3">
                <button
                  className="bg-blue-600 text-white px-6 py-2 rounded-full disabled:opacity-60"
                  disabled={isCreating}
                >
                  {isCreating ? "Creating..." : "Create User"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="bg-gray-100 px-6 py-2 rounded-full"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
