import React from "react";
import Header from "./Header.jsx";
import ProjectTaskContainer from "./ProjectTaskContainer.jsx";
import Footer from "./Footer.jsx";
import Navbar from './Navbar.jsx'

function Todo() {
  return (
    <>
      <Header />
      <Navbar />
      <ProjectTaskContainer/>
      <Footer />
    </>
  );
}

export default Todo;
