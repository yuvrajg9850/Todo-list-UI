import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/todoContainer.css";
import Task from "./Task";

function ProjectTaskContainer() {
  const [inputValue, setInputVal] = useState("");
  const [projectIdValue, setProjectIdValue] = useState(0);
  const [taskRefresh, setTaskRefresh] = useState(true);
  const [taskIdValue, setTaskIdValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

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

  function captureTitle(e) {
    const title = e.target.value;
    setInputVal(title);
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
                {" "}
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
            tasks.map((task, index) => (
                //<Task task={task} index={index}></Task>
                <div className="todos" key={index}>
                <div className="task">
                  {index + 1}. {task.title}
                  <input className="checkbox" type="checkbox" />
                  <button
                    className="delete-button"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (<p>no task found</p>)}
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
