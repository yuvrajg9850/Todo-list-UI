import React from "react";
import Header from "./Header.jsx";
import TodoContainer from "./TodoContainer.jsx";
import Footer from "./Footer.jsx";
import Navbar from './Navbar.jsx'

function Todo() {
  return (
    <>
      <Header />
      <Navbar />
      <TodoContainer />
      <Footer />
    </>
  );
}

export default Todo;
