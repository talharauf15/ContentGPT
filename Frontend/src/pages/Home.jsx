import PromptForm from "../components/PromptForm";
import UserProfile from "./UserProfile";
import TestPromptAPI from "../components/testPromptAPI";

const Home = () => (
  <div>
    <h1>Prompt Submission</h1>
    <UserProfile/>
    <PromptForm />
<TestPromptAPI/>
  </div>
);

export default Home;
