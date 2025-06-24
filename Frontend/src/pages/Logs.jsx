import PromptLogList from "../components/PromptLogList";
import "./Logs.css"; // Add this line

const Logs = () => (
  <div>
    <h1 className="logs-page">Logs</h1>
    <PromptLogList />
  </div>
);

export default Logs;
