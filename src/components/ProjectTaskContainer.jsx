import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/todoContainer.css";

function ProjectTaskContainer() {
  const [inputValue, setInputVal] = useState("");
  const [projectIdValue, setProjectIdValue] = useState(0);
  const [taskRefresh, setTaskRefresh] = useState(true);
  const [taskIdValue, setTaskIdValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [taskStats, setStats] = useState([0, 0, 10]);

  const [tasks, setTasks] = useState([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    axios
      .get("https://localhost:7001/api/v1/projects")
      .then((response) => {
        setProjects(response.data);
        if (response.data.length > 0) {
          setProjectIdValue(response.data[0].id);
          setLoadingProjects(false);
        }
      })
      .catch((error) => {
        console.log("Error fetching projects.", error);
      });
  }, []);

  useEffect(() => {
    if (projectIdValue !== 0) {
      getTasks(projectIdValue);
    }
  }, [taskIdValue, projectIdValue, taskRefresh]);

  function getTasks(projectId) {
    setLoadingTasks(true);
    axios
      .get(`https://localhost:7001/api/v1/tasks?projectId=${projectId}`)
      .then((response) => {
        setTasks(response.data);
        setLoadingTasks(false);
      })
      .catch((error) => {
        setLoadingTasks(false);
        setTasks([]);
        console.log("Error fetching tasks.", error);
      });
  }

  function addTask() {
    setLoadingTasks(true);
    let title = inputValue;
    axios
      .post("https://localhost:7001/api/v1/Tasks", {
        title: title,
        description: "No Descriptoin",
        projectId: projectIdValue,
      })
      .then((response) => {
        setTaskIdValue(response.data.id);
        console.log("Task created:", response);
      })
      .catch((error) => console.error("Error:", error));
    setInputVal("");
  }

  function deleteTask(taskId) {
    setLoadingTasks(true);
    axios
      .delete(`https://localhost:7001/api/v1/Tasks/${taskId}`)
      .then((response) => {
        setTaskIdValue(response.data.id);
        console.log("Task created:", response);
      })
      .catch((error) => console.error("Error:", error));
    setInputVal("");
    setTaskRefresh(!taskRefresh);
  }

  function updateTask(task){
    setLoadingTasks(true);
    axios
      .put(`https://localhost:7001/api/v1/Tasks/${task.id}`, {
        title: task.title,
        description: task.description,
        isCompleted: !task.isCompleted,
        projectId: projectIdValue,
      })
      .then((response) => {
        setTaskRefresh(!taskRefresh);
        console.log("Task updated:", response);
      })
      .catch((error) => console.error("Error:", error));
  }

  function captureTitle(e) {
    const title = e.target.value;
    setInputVal(title);
  }

  function changeCompleteStatus(task){
    updateTask(task)
  } 

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      document.getElementById("myButton").click();
    }
  };

  function selectProject(projectId) {
    setProjectIdValue(projectId);
  }

  return (
    <>
      <div className="container-layout">
        <div className="all-projects">
          <div className="project">All Projects</div>
          {loadingProjects ? (
            <p>loading...</p>
          ) : (
            projects.map((project) => (
              <button
                className="project-button"
                key={project.id}
                onClick={() => selectProject(project.id)}
              >
                {project.title}
              </button>
            ))
          )}
        </div>
        <div className="container">
          <input
            className="input-text"
            value={inputValue}
            onChange={captureTitle}
            placeholder="Enter your text here"
            onKeyDown={handleKeyPress}
          />
          <button
            id="myButton"
            className="input-button"
            onClick={() => addTask()}
          >
            Add Task
          </button>
          {loadingTasks ? (
            <p>loading...</p>
          ) : tasks.length ? (
            tasks
            .sort((a, b) => new Date(b.createdTs) - new Date(a.createdTs))
            .map((task, index) => (
              <div className="todos" key={index}>
                <div className="task">
                  {index + 1}. {task.title}
                  <input className="checkbox"
                   checked={task.isCompleted}
                   onChange={() => changeCompleteStatus(task)}
                   type="checkbox" />
                  <button
                    className="delete-button"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>no task found</p>
          )}
        </div>
        <div className="completion">
          <div className="completion-heading">Total</div>
          <div className="completion-stats">
            <div className="completion-done">{taskStats[0] = tasks.filter((t) => t.isCompleted === true).length}</div>
            <div>/</div>
            <div className="completion-todo">{taskStats[1] = tasks.length}</div>
          </div>
          <div className="completion-percentage">{taskStats[2] = ((taskStats[0]/taskStats[1])*100).toFixed(2)}</div>
        </div>
      </div>
    </>
  );
}

export default ProjectTaskContainer;
