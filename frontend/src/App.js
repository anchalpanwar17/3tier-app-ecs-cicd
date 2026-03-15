import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios.get(`${API}/tasks`).then(res => setTasks(res.data));
  }, [API]);

  const addTask = () => {
    axios.post(`${API}/tasks`, { title }).then(() => {
      setTitle("");
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Task App</h2>
      <input onChange={e => setTitle(e.target.value)} />
      <button onClick={addTask}>Add Task</button>
      <ul>
        {tasks.map(t => <li key={t.id}>{t.title}</li>)}
      </ul>
    </div>
  );
}

export default App;
