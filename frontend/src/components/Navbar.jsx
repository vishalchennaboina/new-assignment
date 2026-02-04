import React from "react";
import { useAuth } from "../auth/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <div>
        <p className="text-lg font-semibold text-slate-900">Task Manager</p>
        <p className="text-xs text-slate-500">Intern assignment dashboard</p>
      </div>
      {user ? (
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600">Hi, {user.name}</span>
          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
