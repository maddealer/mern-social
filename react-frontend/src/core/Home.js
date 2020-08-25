import React from "react";
import Posts from "../post/Posts";

const Home = () => {
  return (
    <>
      <div className="container">
        <div className="jumbotron">
          <h2>Home</h2>
          <p className="lead">Welcome to React Frontend</p>
        </div>
        <Posts />
      </div>
    </>
  );
};
export default Home;
