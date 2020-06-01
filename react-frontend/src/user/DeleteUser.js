import React, { Component } from "react";

class DeleteUser extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <button className="btn btn-raised btn-danger">Delete Profile</button>
    );
  }
}

export default DeleteUser;
