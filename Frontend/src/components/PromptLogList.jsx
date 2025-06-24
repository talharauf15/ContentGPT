// // import { useEffect, useState } from "react";
// // import { getAllPromptLogs } from "../api/promptLogAPI";
// // import { useUser } from "@clerk/clerk-react";

// // const PromptLogList = () => {
// //   const [logs, setLogs] = useState([]);
// //   const { user } = useUser(); // 🔐 Clerk user context

// //   useEffect(() => {
// //     async function fetchLogs() {
// //       if (!user) return;

// //       try {
// //         const res = await getAllPromptLogs(user.id); // ✅ Pass userId to API
// //         setLogs(res.data);
// //       } catch (error) {
// //         console.error("❌ Failed to fetch prompt logs:", error);
// //       }
// //     }

// //     fetchLogs();
// //   }, [user]); // 🔁 Re-run if user changes

// //   return (
// //     <div>
// //       <h2>🧾 Prompt Logs</h2>
// //       {logs.map((log) => (
// //         <div
// //           key={log._id}
// //           style={{
// //             border: "1px solid #ccc",
// //             marginBottom: "10px",
// //             padding: "10px",
// //             borderRadius: "8px",
// //           }}
// //         >
// //           <p><strong>User:</strong> {log.userName} (ID: {log.userId})</p>
// //           <p><strong>Prompt:</strong> {log.prompt}</p>
// //           <p><strong>Response:</strong> {log.response}</p>
// //           <p><em>Created At:</em> {new Date(log.createdAt).toLocaleString()}</p>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // export default PromptLogList;


// import { useEffect, useState } from "react";
// import { User, MessageSquare, Clock, Sparkles, Search, Filter, RefreshCw } from "lucide-react";
// import { getAllPromptLogs } from "../api/promptLogAPI";
// import { useUser } from "@clerk/clerk-react";
// import "./PromptLogList.css";

// const PromptLogList = () => {
//   const [logs, setLogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterUser, setFilterUser] = useState("");
//   const [refreshing, setRefreshing] = useState(false);


//   const { user } = useUser(); // ✅ Clerk user

//   // // Enhanced dummy data with more variety
//   // const dummyLogs = [
//   //   {
//   //     _id: "1",
//   //     userName: "Alice Johnson",
//   //     userId: "user_2k8x9m1",
//   //     prompt: "Create a responsive navigation component with React that includes mobile hamburger menu, dropdown submenus, and smooth animations",
//   //     response: "Here's a comprehensive responsive navigation component using React with mobile-first design principles. The component features a collapsible hamburger menu for mobile devices, smooth CSS transitions, and accessibility features including ARIA labels and keyboard navigation support. The navigation automatically adapts to different screen sizes and includes dropdown functionality for nested menu items.",
//   //     createdAt: new Date().toISOString(),
//   //   },
//   // ];

//   // // Mock API call with enhanced dummy data
//   // const getAllPromptLogs = async (userId) => {
//   //   return new Promise((resolve) => {
//   //     setTimeout(() => {
//   //       resolve({
//   //         data: dummyLogs
//   //       });
//   //     }, 1000); // Reduced timeout for faster loading
//   //   });
//   // };

//   const fetchLogs = async () => {
//     try {
//       if (!user) return;
//       setLoading(true);
//       const res = await getAllPromptLogs(user.id);
//       setLogs(res.data);
//     } catch (error) {
//       console.error("❌ Failed to fetch prompt logs:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     try {
//       if (!user) return;
//       const res = await getAllPromptLogs(user.id);
//       setLogs(res.data);
//     } catch (error) {
//       console.error("❌ Failed to refresh prompt logs:", error);
//     } finally {
//       setRefreshing(false);
//     }
//   };

//   useEffect(() => {
//     if (user) fetchLogs(); // ✅ Only fetch if user is available
//   }, [user]);

//   const filteredLogs = logs.filter(log => {
//     const matchesSearch = 
//       log.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       log.response.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesUser = 
//       filterUser === "" || 
//       log.userName.toLowerCase().includes(filterUser.toLowerCase());
//     return matchesSearch && matchesUser;
//   });

//   const formatTimeAgo = (dateString) => {
//     const now = new Date();
//     const date = new Date(dateString);
//     const diffInSeconds = Math.floor((now - date) / 1000);

//     if (diffInSeconds < 60) return "Just now";
//     if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
//     if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
//     return `${Math.floor(diffInSeconds / 86400)}d ago`;
//   };

//   const truncateText = (text, maxLength = 200) => {
//     if (text.length <= maxLength) return text;
//     return text.substring(0, maxLength) + "...";
//   };

//   if (loading) {
//     return (
//       <div className="prompt-log-container">
//         <div className="loading-state">
//           <div className="loading-spinner"></div>
//           <p>Loading prompt logs...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="prompt-log-container">
//       <div className="header">
//         <div className="header-content">
//           <div className="title-section">
//             <Sparkles className="title-icon" />
//             <h1>Prompt Logs</h1>
//             <span className="log-count">{filteredLogs.length} entries</span>
//           </div>
//           <button
//             className={`refresh-btn ${refreshing ? 'refreshing' : ''}`}
//             onClick={handleRefresh}
//             disabled={refreshing}
//           >
//             <RefreshCw className="refresh-icon" />
//             {refreshing ? 'Refreshing...' : 'Refresh'}
//           </button>
//         </div>

//         <div className="filters">
//           <div className="search-box">
//             <Search className="search-icon" />
//             <input
//               type="text"
//               placeholder="Search prompts and responses..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//           </div>
//           <div className="filter-box">
//             <Filter className="filter-icon" />
//             <input
//               type="text"
//               placeholder="Filter by user..."
//               value={filterUser}
//               onChange={(e) => setFilterUser(e.target.value)}
//             />
//           </div>
//         </div>
//       </div>

//       {filteredLogs.length === 0 ? (
//         <div className="empty-state">
//           <MessageSquare className="empty-icon" />
//           <h3>No logs found</h3>
//           <p>Try adjusting your search or filter criteria</p>
//         </div>
//       ) : (
//         <div className="logs-grid">
//           {filteredLogs.map((log, index) => (
//             <div
//               key={log._id}
//               className="log-card"
//               style={{ animationDelay: `${index * 0.1}s` }}
//             >
//               <div className="log-card-header">
//                 <div className="user-info">
//                   <User className="user-icon" />
//                   <div className="user-details">
//                     <span className="user-name">{log.userName}</span>
//                     <span className="user-id">ID: {log.userId}</span>
//                   </div>
//                 </div>
//                 <div className="timestamp">
//                   <Clock className="clock-icon" />
//                   <span>{formatTimeAgo(log.createdAt)}</span>
//                 </div>
//               </div>

//               <div className="log-content">
//                 <div className="prompt-section">
//                   <h4>Prompt</h4>
//                   <p className="prompt-text">{log.prompt}</p>
//                 </div>

//                 <div className="response-section">
//                   <h4>Response</h4>
//                   <p className="response-text">{truncateText(log.response)}</p>
//                   {log.response.length > 200 && (
//                     <button className="expand-btn">Read more</button>
//                   )}
//                 </div>
//               </div>

//               <div className="log-card-footer">
//                 <span className="created-date">
//                   {new Date(log.createdAt).toLocaleDateString('en-US', {
//                     year: 'numeric',
//                     month: 'short',
//                     day: 'numeric',
//                     hour: '2-digit',
//                     minute: '2-digit'
//                   })}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default PromptLogList;





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

const PromptLogList = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [expandedLogs, setExpandedLogs] = useState({}); // ⬅️ Track which logs are expanded

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

  const isExpanded = (logId) => expandedLogs[logId];

  const toggleExpand = (logId) => {
    setExpandedLogs((prev) => ({
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
                  <p className="prompt-text">{log.prompt}</p>
                </div>

                <div className="response-section">
                  <h4>Response</h4>
                  <p className="response-text">
                    {isExpanded(log._id)
                      ? log.response
                      : log.response.length > 200
                      ? log.response.slice(0, 200) + "..."
                      : log.response}
                  </p>
                  {log.response.length > 200 && (
                    <button
                      className="expand-btn"
                      onClick={() => toggleExpand(log._id)}
                    >
                      {isExpanded(log._id) ? "Show less" : "Read more"}
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
