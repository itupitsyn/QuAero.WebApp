"use client";

import { useThemeMode } from "flowbite-react";
import { ToastContainer as ToastContainerToastify } from "react-toastify";

export const ToastContainer = () => {
  const { mode } = useThemeMode();

  return <ToastContainerToastify theme={mode} />;
};
