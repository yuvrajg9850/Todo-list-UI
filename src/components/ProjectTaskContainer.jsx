import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/todoContainer.css";

function ProjectTaskContainer() {
  const LOCAL_STORAGE_KEY = "todo-list";

  const [inputValue, setInputVal] = useState("");
  const [allTodos, setAllTodos] = useState([]);

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    axios.get('https://localhost:7001/api/v1/projects').then(response => {
      setProjects(response.data)
      setLoadingProjects(false)
    }).catch(error => {
      console.log('Error fetching projects.', error)
    })
  }, [])

  useEffect(() =>{
    if (projects.length > 0){
    axios.get(`https://localhost:7001/api/v1/tasks?projectId=${projects[0].id}`).then(response => {
      setTasks(response.data)
      setTasks(response.data)
      setLoadingTasks(false)
    }).catch(error => {
      console.log('Error fetching tasks.', error)
    })
  }
  }, [])
  
  function writeTodo(e) {
    setInputVal(e.target.value);
  }

  function addAllTodos() {
    if (inputValue.length > 0) {
      setAllTodos([...allTodos, inputValue]);
      setInputVal("");
    }
  }

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allTodos));
  }, [allTodos]); //when the stateVariable changes

  useEffect(() => {
    const retriveTodos = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    console.log(retriveTodos)
    if (retriveTodos.length != 0) {
      setAllTodos(retriveTodos);
    }
  }, []); //On pageload

  function deleteTodo(id) {
    setAllTodos((allTodos) =>
      allTodos.filter((todo, index) => {
        return id != index;
      })
    );
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      document.getElementById("myButton").click();
    }
  };

  return (
    <>
      <div className="container-layout">
        <div className="all-projects">
          <div className="project">All Projects</div>
          {loadingProjects ? <p>loading...</p> : (            
              projects.map(project => 
                (<button className="project-button" key={project.id}>{project.title}</button>)
              )                       
          )}
        </div>
        <div className="container">
          <input
            className="input-text"
            value={inputValue}
            onChange={writeTodo}
            placeholder="Enter your text here"
            onKeyDown={handleKeyPress}
          />
          <button id="myButton" className="input-button" onClick={addAllTodos}>
            Add Task
          </button>
          {allTodos.map((todo, index) => {
            return (
              <div className="todos" key={index}>
                <div className="task">
                  {index + 1}. {todo}
                </div>
                <input className="checkbox" type="checkbox" />
                <button
                  className="delete-button"
                  onClick={() => deleteTodo(index)}
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
        <div className="completion">
          <div className="completion-heading">Total</div>
          <div className="completion-stats">
            <div className="completion-done">6</div>
            <div>/</div>
            <div className="completion-todo">10</div>
          </div>
          <div className="completion-percentage">50%</div>
        </div>
      </div>
    </>
  );
}

export default ProjectTaskContainer;
