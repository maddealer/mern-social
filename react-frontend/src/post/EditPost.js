import React, { Component } from "react";
import { singlePost, update } from "./apiPost";
import { isAuthenticated } from "./../auth/index";
import { Redirect, Link } from "react-router-dom";

class EditPost extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      title: "",
      body: "",
      photo: "",
      redirectToHome: false,
      error: "",
      photoUrl: "",
    };
  }

  init = (postId) => {
    // const token = isAuthenticated().token;
    singlePost(postId).then((data) => {
      if (data.error) {
        this.setState({ redirectToProfile: true });
      } else {
        console.log(data);
        this.setState({
          id: data._id,
          title: data.title,
          body: data.body,
          photoUrl: data.photo,
        });
      }
    });
  };

  componentDidMount() {
    this.postData = new FormData();

    const postId = this.props.match.params.postId;
    this.init(postId);
  }

  isValid = () => {
    const { title, body, photo } = this.state;

    if (!photo) {
      this.setState({
        error: "Please upload a photo, this is the purpose of the app! :)",
      });
      return false;
    }

    if (title.length === 0 || body.length === 0) {
      this.setState({ error: "All fields are required!", loading: false });
      return false;
    }

    return true;
  };

  handleChange = (name) => (event) => {
    this.setState({ error: "" });
    const value = name === "photo" ? event.target.files[0] : event.target.value;

    this.postData.set(name, value);
    this.setState({
      [name]: value,
    });
  };

  clickSubmit = (e) => {
    e.preventDefault();

    if (this.isValid()) {
      this.setState({ loading: true });
      //console.log(user);
      const postId = this.state.id;
      const token = isAuthenticated().token;

      update(postId, token, this.postData).then((data) => {
        if (data.error) {
          this.setState({ error: data.error, loading: false });
        } else {
          this.setState({
            loading: false,
            title: "",
            body: "",
            photo: "",
            redirectToHome: true,
          });
          //console.log("New Post: ", data);
        }
      });
    }
  };

  editPostForm = (title, body) => {
    return (
      <form>
        <div className="form-group">
          <label className="text-muted">New Photo</label>
          <input
            onChange={this.handleChange("photo")}
            type="file"
            accept="image/*"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label className="text-muted">Title</label>
          <input
            onChange={this.handleChange("title")}
            type="text"
            className="form-control"
            value={title}
          />
        </div>

        <div className="form-group">
          <label className="text-muted">Body</label>
          <textarea
            onChange={this.handleChange("body")}
            type="text"
            className="form-control"
            value={body}
          />
        </div>
        <div className="d-inline-block">
          <button
            onClick={this.clickSubmit}
            className="btn btn-raised btn-primary mr-5"
          >
            Update Post
          </button>
          <Link className="btn btn-raised btn-info mr-5" to={`/`}>
            cancel
          </Link>
        </div>
      </form>
    );
  };

  render() {
    const {
      title,
      body,
      photoUrl,
      redirectToHome,
      error,
      loading,
    } = this.state;
    if (redirectToHome) {
      return <Redirect to={`/`} />;
    }
    return (
      <div className="container">
        <h2>Edit Post</h2>

        {loading ? (
          <div className="jumbotron text-center">Loading...</div>
        ) : (
          <>
            <h2>{title}</h2>
            <img
              src={photoUrl}
              alt=""
              className="img-thumbnail mb-3 img-responsive"
              //style={{ height: "400", width: "100%" }}
            />
            <div
              className="alert alert-danger"
              style={{ display: error ? "" : "none" }}
            >
              {error}
            </div>
            {this.editPostForm(title, body)}
          </>
        )}
      </div>
    );
  }
}

export default EditPost;
