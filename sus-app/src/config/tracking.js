import { API_BASE_URL, getAuthHeaders } from "./api";

const SESSION_KEY = "sc_session_id";

export const getSessionId = () => {
  let sessionId = localStorage.getItem(SESSION_KEY);

  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }

  return sessionId;
};

export const trackInteraction = async (event) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    await fetch(`${API_BASE_URL}/api/interactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({
        sessionId: getSessionId(),
        userId: user?._id,
        ...event
      })
    });
  } catch (error) {
    console.warn("Interaction tracking failed", error);
  }
};
