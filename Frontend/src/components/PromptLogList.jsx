import { useEffect, useState } from "react";
import { getAllPromptLogs } from "../api/promptLogAPI";

const PromptLogList = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    async function fetchLogs() {
      const res = await getAllPromptLogs();
      setLogs(res.data);
    }

    fetchLogs();
  }, []);

  return (
    <div>
      <h2>Prompt Logs</h2>
      {logs.map((log) => (
        <div key={log._id} style={{ border: "1px solid #ccc", marginBottom: "10px", padding: "10px" }}>
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
