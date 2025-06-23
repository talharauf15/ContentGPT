// import { useEffect, useState } from "react";
// import { createPromptLog } from "../api/promptLogAPI";
// import { getAllPrompts } from "../api/promptAPI";
// import { useUser } from "@clerk/clerk-react";

// const PromptForm = () => {
//   const [prompt, setPrompt] = useState("");
//   const [response, setResponse] = useState("");
//   const [prompts, setPrompts] = useState([]);
//   const [error, setError] = useState("");

//   const { user } = useUser(); // 🔑 Get Clerk user

//   // Fetch prompts from DB on load
//   useEffect(() => {
//     const fetchPrompts = async () => {
//       try {
//         const data = await getAllPrompts();
//         setPrompts(data);
//       } catch (err) {
//         console.error("❌ Failed to fetch prompts:", err);
//         setError("Failed to load prompts.");
//       }
//     };

//     fetchPrompts();
//   }, []);

//   // Handle prompt submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!user) {
//       setError("User not authenticated.");
//       return;
//     }

//     try {
//       const result = await createPromptLog({
//         prompt,
//         response,
//         userId: user.id, 
//         userName: user.username, 
//       });

//       setResponse(result.response);
//     } catch (error) {
//       console.error("❌ Error submitting prompt:", error);
//       setResponse("Failed to save prompt log.");
//     }
//   };

//   return (
//     <div>
//       <h2>📝 Submit a Prompt</h2>

//       <form onSubmit={handleSubmit}>
//         <textarea
//           value={prompt}
//           onChange={(e) => setPrompt(e.target.value)}
//           placeholder="Write your prompt or select below..."
//           rows={4}
//           style={{ width: "100%", marginBottom: "10px" }}
//         />

//         <button type="submit">Submit Prompt</button>
//       </form>

//       <hr />

//       <h3>📚 Or Choose from Saved Prompts</h3>
//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {prompts.length === 0 ? (
//         <p>No saved prompts yet.</p>
//       ) : (
//         <ul>
//           {prompts.map((item) => (
//             <li
//               key={item._id}
//               onClick={() => setPrompt(item.prompt)}
//               style={{
//                 cursor: "pointer",
//                 marginBottom: "5px",
//                 backgroundColor: "#f2f2f2",
//                 padding: "5px",
//                 borderRadius: "5px",
//               }}
//             >
//               {item.prompt}
//               <br />
//               <small>{new Date(item.createdAt).toLocaleString()}</small>
//             </li>
//           ))}
//         </ul>
//       )}

//       {response && (
//         <p style={{ marginTop: "20px" }}>
//           <strong>✅ LLM Response:</strong> {response}
//         </p>
//       )}
//     </div>
//   );
// };

// export default PromptForm;



import { useEffect, useState } from "react";
import { createPromptLog } from "../api/promptLogAPI";
import { getAllPrompts } from "../api/promptAPI";
import { useUser } from "@clerk/clerk-react";

const PromptForm = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [prompts, setPrompts] = useState([]);
  const [error, setError] = useState("");
  const [manualMode, setManualMode] = useState(true); // 🔁 Toggle state

  const { user } = useUser(); // 🔑 Get Clerk user

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const data = await getAllPrompts();
        setPrompts(data);
      } catch (err) {
        console.error("❌ Failed to fetch prompts:", err);
        setError("Failed to load prompts.");
      }
    };

    fetchPrompts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("User not authenticated.");
      return;
    }

    try {
      const result = await createPromptLog({
        prompt,
        response,
        userId: user.id,
        userName: user.username,
      });

      setResponse(result.response);
    } catch (error) {
      console.error("❌ Error submitting prompt:", error);
      setResponse("Failed to save prompt log.");
    }
  };

  // 🟢 When user clicks a saved prompt in 'closed' mode
  const handleSavedPromptClick = async (selectedPrompt) => {
    if (!user) {
      setError("User not authenticated.");
      return;
    }

    setPrompt(selectedPrompt); // Just for UI clarity
    try {
      const result = await createPromptLog({
        prompt: selectedPrompt,
        response,
        userId: user.id,
        userName: user.username,
      });

      setResponse(result.response);
    } catch (error) {
      console.error("❌ Error submitting saved prompt:", error);
      setResponse("Failed to save prompt log.");
    }
  };

  return (
    <div>
      <h2>📝 Prompt Submission</h2>

      <button onClick={() => setManualMode(!manualMode)}>
        {manualMode ? "🔄 Switch to Saved Prompt Mode" : "🖊️ Switch to Manual Prompt Mode"}
      </button>

      <hr />

      {/* Manual Prompt Mode */}
      {manualMode ? (
        <form onSubmit={handleSubmit}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Write your prompt..."
            rows={4}
            style={{ width: "100%", marginBottom: "10px" }}
          />
          <button type="submit">Submit Prompt</button>
        </form>
      ) : (
        <>
          <h3>📚 Choose from Saved Prompts</h3>
          {error && <p style={{ color: "red" }}>{error}</p>}

          {prompts.length === 0 ? (
            <p>No saved prompts yet.</p>
          ) : (
            <ul>
              {prompts.map((item) => (
                <li
                  key={item._id}
                  onClick={() => handleSavedPromptClick(item.prompt)}
                  style={{
                    cursor: "pointer",
                    marginBottom: "5px",
                    backgroundColor: "#f2f2f2",
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                >
                  {item.prompt}
                  <br />
                  <small>{new Date(item.createdAt).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {response && (
        <p style={{ marginTop: "20px" }}>
          <strong>✅ LLM Response:</strong> {response}
        </p>
      )}
    </div>
  );
};

export default PromptForm;
