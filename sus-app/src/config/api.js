export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:4000";

export const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return token ? { Authorization: `Bearer ${token}` } : {};
};
