import React from "react";

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="rounded-xl bg-white p-6 shadow">
        <p className="text-sm font-medium text-slate-600">{message}</p>
      </div>
    </div>
  );
};

export default Loader;
