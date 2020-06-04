import React, { Component } from "react";
import { isAuthenticated, signout } from "./../auth/index";
import { remove } from "../user/apiUser";
import { Redirect } from "react-router-dom";

class DeleteUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: false,
    };
  }

  deleteAccount = () => {
    const token = isAuthenticated().token;
    const userId = this.props.userId;

    remove(userId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        //signout
        signout(() => {
          console.log("user is deleted");
        });
        //redirect
        this.setState({ redirect: true });
      }
    });
  };

  deleteConfirmed = () => {
    let answer = window.confirm(
      "Are you sure you want to delete your account?"
    );

    if (answer) {
      this.deleteAccount();
    }
  };

  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
    return (
      <button
        onClick={this.deleteConfirmed}
        className="btn btn-raised btn-danger"
      >
        Delete Profile
      </button>
    );
  }
}

export default DeleteUser;
