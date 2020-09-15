import React, { Component } from "react";
import { list } from "./apiPost";
import Moment from "react-moment";
import DefaultPost from "../images/manicure.png";
import { Link } from "react-router-dom";

class Posts extends Component {
  state = {
    posts: [],
    page: 1,
  };

  componentDidMount() {
    this.loadPosts(this.state.page);
  }

  loadPosts = (page) => {
    list(page).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data });
      }
    });
  };

  loadMore = (number) => {
    this.setState({ page: this.state.page + number });
    this.loadPosts(this.state.page + number);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  loadLess = (number) => {
    this.setState({ page: this.state.page - number });
    this.loadPosts(this.state.page - number);
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  renderPosts = (posts) => {
    return (
      <div className="row">
        {posts.map((post, i) => {
          // console.log("postPhoto ", post);
          const posterId = post.postedBy._id;
          const posterName = post.postedBy.name;
          return (
            <div className="card col-md-4" key={i}>
              <div className="card-body">
                <img
                  src={post.photo}
                  alt={post.title}
                  onError={(i) => {
                    i.target.src = `${DefaultPost}`;
                  }}
                  className="img-thumbnail mb-3"
                  style={{ height: "200px", width: "auto" }}
                />
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">{post.body.substring(0, 15)}...</p>
                <br />
                <p className="font-italic mark">
                  Posted by <Link to={`/user/${posterId}`}>{posterName} </Link>
                  <Moment fromNow>{post.created}</Moment>
                </p>
                <Link
                  to={`/post/${post._id}`}
                  className="btn btn-raised btn-primary btn-sn"
                >
                  Read more.....
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { posts, page } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">
          {!posts.length ? "No more posts!" : "Recent Posts"}
        </h2>
        {this.renderPosts(posts)}
        {page > 1 ? (
          <button
            className="btn btn-raised btn-warning mr-5 mt-5 mb-5"
            onClick={() => this.loadLess(1)}
          >
            Previous ({page - 1})
          </button>
        ) : (
          ""
        )}

        {posts.length ? (
          <button
            className="btn btn-raised btn-success mt-5 mb-5"
            onClick={() => this.loadMore(1)}
          >
            Next ({page + 1})
          </button>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default Posts;
