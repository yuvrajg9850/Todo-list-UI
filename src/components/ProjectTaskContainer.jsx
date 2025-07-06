import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/todoContainer.css";

function ProjectTaskContainer() {

  const [inputValue, setInputVal] = useState("");
  const [projectIdValue, setProjectIdValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  
  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    axios.get('https://localhost:7001/api/v1/projects').then(response => {
      setProjects(response.data)
      setLoadingProjects(false)
      if (response.data.length > 0){
        setProjectIdValue(response.data[0].id)
        getTasks(response.data[0].id)
        setLoadingTasks(false)
      }
    }).catch(error => {
      console.log('Error fetching projects.', error)
    })

  }, [])

  function getTasks(projectId){
    console.log('projects', projects)
    axios.get(`https://localhost:7001/api/v1/tasks?projectId=${projectId}`).then(response => {
      setTasks(response.data)
      setLoadingTasks(false)
    }).catch(error => {
        setLoadingTasks(false)
        setTasks([])
      console.log('Error fetching tasks.', error)
    })
  }
  
  function writeTodo(e) {
    setInputVal(e.target.value);
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      document.getElementById("myButton").click();
    }
  };

  function selectProject(projectId){
    setLoadingTasks(true)
    setProjectIdValue(projectId)
    getTasks(projectId)
  }

  return (
    <>
      <div className="container-layout">
        <div className="all-projects">
          <div className="project">All Projects</div>
          {loadingProjects ? <p>loading...</p> : (            
              projects.map(project => 
                (<button className="project-button" key={project.id} onClick={() => selectProject(project.id)}> {project.title}</button>)
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
          <button id="myButton" className="input-button">
            Add Task
          </button>
          <div>
            {loadingTasks ? (
                <p>Loading...</p>
            ) : (
                    tasks.length > 0 ?
                    <>
                        {
                        tasks.map((task, index) => (
                        <div className="todos" key={index}>
                            <div className="task">
                            {index + 1}. {task.title}
                            <input className="checkbox" type="checkbox" />
                            <button
                            className="delete-button"
                            onClick={() => deleteTodo(index)}
                            >
                            Delete
                            </button>
                            </div>
                        </div>
                        ))}
                    </>
                    : 
                    (
                        <p>No tasks found.</p>
                    )
                ) 
            }
            </div>          
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
