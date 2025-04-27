import React, { useState, useEffect } from "react";
import "../styles/todoContainer.css";

function TodoContainer() {

  const LOCAL_STORAGE_KEY = "todo-list" 

  const [inputValue, setInputVal] = useState("");
  const [allTodos, setAllTodos] = useState([]);

  function writeTodo(e) {
    setInputVal(e.target.value);
  }

  function addAllTodos() {
    setAllTodos([...allTodos, inputValue]);
    setInputVal('');
  }

  useEffect(() => {
    const retriveTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
    if (retriveTodos.length > 0)
      setAllTodos(retriveTodos)
  }, []);//On pageload

  useEffect(() =>{
    if (allTodos.length > 0)
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allTodos))
  }, [allTodos]);//when the stateVariable changes

  function deleteTodo(id) {
    console.log(id)
    setAllTodos((allTodos) => 
      allTodos.filter((todo, index) => {
        return id != index;
      })
    );
  }

  return (
    <>
      <div className="container">
        <input
          className="input-text"
          value={inputValue}
          onChange={writeTodo}
          placeholder="Enter your text here"
        />
        <button className="input-button" onClick={addAllTodos}>
          Add Task
        </button>
        {allTodos.map((todo, index) => {
          return (
            <div className="todos" key={index}> 
              <div className="task">{index+1}. {todo}</div>
              <input className="checkbox" type="checkbox" />
              <button className="delete-button" onClick={() => deleteTodo(index)}>Delete</button>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default TodoContainer;
