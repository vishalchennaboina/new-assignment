import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import api from "../api/axios.js";
import { useAuth } from "../auth/AuthContext.jsx";
import Loader from "../components/Loader.jsx";

const Dashboard = () => {
  const { user, setUser, loadProfile } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      status: "pending",
    },
  });

  const fetchTasks = async () => {
    const { data } = await api.get("/tasks");
    setTasks(data.tasks);
  };

  const loadData = async () => {
    try {
      await loadProfile();
      await fetchTasks();
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredTasks = useMemo(() => {
    const term = search.toLowerCase();
    return tasks.filter((task) =>
      [task.title, task.description].some((field) => field?.toLowerCase().includes(term))
    );
  }, [tasks, search]);

  const handleTaskSubmit = async (formData) => {
    setActionLoading(true);
    setMessage("");
    setErrorMessage("");

    try {
      if (editingTaskId) {
        const { data } = await api.put(`/tasks/${editingTaskId}`, formData);
        setTasks((prev) => prev.map((task) => (task._id === editingTaskId ? data.task : task)));
        setMessage("Task updated successfully");
      } else {
        const { data } = await api.post("/tasks", formData);
        setTasks((prev) => [data.task, ...prev]);
        setMessage("Task created successfully");
      }
      setEditingTaskId(null);
      reset({ title: "", description: "", status: "pending" });
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Task action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (task) => {
    setEditingTaskId(task._id);
    setValue("title", task.title);
    setValue("description", task.description);
    setValue("status", task.status);
  };

  const handleDelete = async (taskId) => {
    setActionLoading(true);
    setMessage("");
    setErrorMessage("");

    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
      setMessage("Task deleted successfully");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Delete failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusToggle = async (task) => {
    const updatedStatus = task.status === "pending" ? "completed" : "pending";
    try {
      const { data } = await api.put(`/tasks/${task._id}`, {
        title: task.title,
        description: task.description,
        status: updatedStatus,
      });
      setTasks((prev) => prev.map((item) => (item._id === task._id ? data.task : item)));
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Status update failed");
    }
  };

  const handleProfileUpdate = async (event) => {
    event.preventDefault();
    setActionLoading(true);
    setMessage("");
    setErrorMessage("");

    const formData = new FormData(event.target);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
    };

    try {
      const { data } = await api.put("/me", payload);
      setUser(data.user);
      setMessage("Profile updated successfully");
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Profile update failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <Loader message="Loading dashboard..." />;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
      <section className="grid gap-6 lg:grid-cols-[1fr_2fr]">
        <div className="rounded-2xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-slate-900">Profile</h2>
          <p className="text-sm text-slate-500">Update your personal details.</p>
          <form className="mt-4 space-y-4" onSubmit={handleProfileUpdate}>
            <div>
              <label className="text-sm font-medium text-slate-700">Name</label>
              <input
                name="name"
                defaultValue={user?.name}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input
                name="email"
                defaultValue={user?.email}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                placeholder="you@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={actionLoading}
              className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {actionLoading ? "Saving..." : "Save profile"}
            </button>
          </form>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Tasks</h2>
              <p className="text-sm text-slate-500">Create, update, and track tasks.</p>
            </div>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm sm:w-56"
              placeholder="Search tasks"
            />
          </div>

          {message ? (
            <div className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
              {message}
            </div>
          ) : null}
          {errorMessage ? (
            <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </div>
          ) : null}

          <form className="mt-4 grid gap-3 md:grid-cols-[2fr_3fr_1fr_auto]" onSubmit={handleSubmit(handleTaskSubmit)}>
            <div>
              <input
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                placeholder="Task title"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title ? (
                <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
              ) : null}
            </div>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              placeholder="Description"
              {...register("description")}
            />
            <select
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              {...register("status")}
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
            <button
              type="submit"
              disabled={actionLoading}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {editingTaskId ? "Update" : "Add"}
            </button>
          </form>

          <div className="mt-6 space-y-3">
            {filteredTasks.length === 0 ? (
              <p className="rounded-lg border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
                No tasks found. Try adding a new task.
              </p>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleStatusToggle(task)}
                        className={`h-3 w-3 rounded-full ${
                          task.status === "completed" ? "bg-emerald-500" : "bg-amber-400"
                        }`}
                        aria-label="Toggle task status"
                      />
                      <p className="text-sm font-semibold text-slate-900">{task.title}</p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          task.status === "completed"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{task.description || "No description"}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(task)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(task._id)}
                      className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
