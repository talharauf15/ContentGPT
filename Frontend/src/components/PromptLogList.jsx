import { useEffect, useState } from "react";
import { getAllPromptLogs } from "../api/promptLogAPI";
import { useUser } from "@clerk/clerk-react";

const PromptLogList = () => {
  const [logs, setLogs] = useState([]);
  const { user } = useUser(); // 🔐 Clerk user context

  useEffect(() => {
    async function fetchLogs() {
      if (!user) return;

      try {
        const res = await getAllPromptLogs(user.id); // ✅ Pass userId to API
        setLogs(res.data);
      } catch (error) {
        console.error("❌ Failed to fetch prompt logs:", error);
      }
    }

    fetchLogs();
  }, [user]); // 🔁 Re-run if user changes

  return (
    <div>
      <h2>🧾 Prompt Logs</h2>
      {logs.map((log) => (
        <div
          key={log._id}
          style={{
            border: "1px solid #ccc",
            marginBottom: "10px",
            padding: "10px",
            borderRadius: "8px",
          }}
        >
          <p><strong>User:</strong> {log.userName} (ID: {log.userId})</p>
          <p><strong>Prompt:</strong> {log.prompt}</p>
          <p><strong>Response:</strong> {log.response}</p>
          <p><em>Created At:</em> {new Date(log.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default PromptLogList;
