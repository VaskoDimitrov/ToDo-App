import React, { useState, useEffect } from "react";
import "./App.css";  // you will style it later

function App() {
  const [todos, setTodos] = useState([]);
  const [filterUser, setFilterUser] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc"); // ascending by default
  const [completedSortOrder, setCompletedSortOrder] = useState("newest");


  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then(response => response.json())
      .then(data => setTodos(data))
      .catch(error => console.error("Error fetching todos:", error));
  }, []);

  const handleComplete = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: true, completedAt: new Date() } : todo
    ));
  };

  const handleUncomplete = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: false, completedAt: null } : todo
    ));
  };

  return (
    <div className="App">
  <h1>Todo React App</h1>

  <div className="controls">
    <label>Filter by User ID:</label>
    <select onChange={(e) => setFilterUser(e.target.value)}>
      <option value="all">All</option>
      {/* Later we can auto-generate userId options */}
    </select>

    <label>Sort Todos:</label>
    <select onChange={(e) => setSortOrder(e.target.value)}>
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
    </select>

    <select onChange={(e) => setCompletedSortOrder(e.target.value)}>
      <option value="newest">Newest First</option>
      <option value="oldest">Oldest First</option>
    </select>
  </div>

  <div className="container">
    <div className="left-side">
      <h2>Uncompleted Todos</h2>
      {todos
  .filter(todo => !todo.completed)
  .filter(todo => filterUser === "all" || todo.userId === Number(filterUser))
  .sort((a, b) => {
    if (sortOrder === "asc") {
      return a.title.localeCompare(b.title);
    } else {
      return b.title.localeCompare(a.title);
    }
  })
  .map(todo => (
    <div key={todo.id} className="todo-item">
      <p>{todo.title}</p>
      <button onClick={() => handleComplete(todo.id)}>Complete</button>
    </div>
))}

    </div>

    <div className="right-side">
      <h2>Completed Todos</h2>
      {todos
  .filter(todo => todo.completed)  // Only completed todos
  .filter(todo => filterUser === "all" || todo.userId === Number(filterUser))  // Filter by user
  .sort((a, b) => {
    // This sorts based on completedAt date
    if (!a.completedAt || !b.completedAt) return 0; // If no date, don't move
    if (completedSortOrder === "newest") {
      return new Date(b.completedAt) - new Date(a.completedAt);  // Newest first
    } else {
      return new Date(a.completedAt) - new Date(b.completedAt);  // Oldest first
    }
  })
  .map(todo => (
    <div key={todo.id} className="todo-item">
      <div style={{ textAlign: "left" }}>
        <p>{todo.title}</p>
        {todo.completedAt && (
          <small>Completed on: {new Date(todo.completedAt).toLocaleDateString()}</small>
        )}
      </div>
      <button onClick={() => handleUncomplete(todo.id)}>Undo</button>
    </div>
))}
    </div>
  </div>
</div>
  );
}

export default App;

