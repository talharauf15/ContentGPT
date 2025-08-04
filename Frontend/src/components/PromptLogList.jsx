import { useEffect, useState } from "react";
import {
  User,
  MessageSquare,
  Clock,
  Sparkles,
  Search,
  RefreshCw,
} from "lucide-react";
import { getAllPromptLogs } from "../api/promptLogAPI";
import { useUser } from "@clerk/clerk-react";
import "./PromptLogList.css";
import ReactMarkdown from "react-markdown";

const PromptLogList = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [expandedResponses, setExpandedResponses] = useState({}); 

  const { user } = useUser();

  const fetchLogs = async () => {
    try {
      if (!user) return;
      setLoading(true);
      const res = await getAllPromptLogs(user.id);
      setLogs(res.data);
    } catch (error) {
      console.error("❌ Failed to fetch prompt logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (!user) return;
      const res = await getAllPromptLogs(user.id);
      setLogs(res.data);
    } catch (error) {
      console.error("❌ Failed to refresh prompt logs:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) fetchLogs();
  }, [user]);

  const filteredLogs = logs.filter((log) =>
    log.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.response.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now - date) / 1000);
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const isResponseExpanded = (logId) => expandedResponses[logId];

  const toggleResponseExpand = (logId) => {
    setExpandedResponses((prev) => ({
      ...prev,
      [logId]: !prev[logId],
    }));
  };

  if (loading) {
    return (
      <div className="prompt-log-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading prompt logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="prompt-log-container">
      <div className="header">
        <div className="header-content">
          <div className="title-section">
            <Sparkles className="title-icon" />
            <h1>Prompt Logs</h1>
            <span className="log-count">{filteredLogs.length} entries</span>
          </div>
          <button
            className={`refresh-btn ${refreshing ? "refreshing" : ""}`}
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className="refresh-icon" />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="filters">
          <div className="search-box">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search prompts and responses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredLogs.length === 0 ? (
        <div className="empty-state">
          <MessageSquare className="empty-icon" />
          <h3>No logs found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="logs-grid">
          {filteredLogs.map((log, index) => (
            <div
              key={log._id}
              className="log-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="log-card-header">
                <div className="user-info">
                  <User className="user-icon" />
                  <div className="user-details">
                    <span className="user-name">{log.userName}</span>
                    <span className="user-id">ID: {log.userId}</span>
                  </div>
                </div>
                <div className="timestamp">
                  <Clock className="clock-icon" />
                  <span>{formatTimeAgo(log.createdAt)}</span>
                </div>
              </div>

              <div className="log-content">
                <div className="prompt-section">
                  <h4>Prompt</h4>
                  <p className="prompt-text">
                    {log.prompt}
                  </p>
                </div>

                <div className="response-section">
                  <h4>Response</h4>
                  <div className="response-text">
                    {isResponseExpanded(log._id)
                      ? <ReactMarkdown>{log.response}</ReactMarkdown>
                      : log.response.length > 200
                      ? <ReactMarkdown>{log.response.slice(0, 200) + "..."}</ReactMarkdown>
                      : <ReactMarkdown>{log.response}</ReactMarkdown>}
                  </div>
                  {log.response.length > 200 && (
                    <button
                      className="expand-btn"
                      onClick={() => toggleResponseExpand(log._id)}
                    >
                      {isResponseExpanded(log._id) ? "Show less" : "Read more"}
                    </button>
                  )}
                </div>
              </div>

              <div className="log-card-footer">
                <span className="created-date">
                  {new Date(log.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromptLogList;
