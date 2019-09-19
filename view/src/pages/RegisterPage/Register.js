import React, { Component } from "react";
import "./Register.css";
import Image from "../../assets/52233.png";

class Register extends Component {
  constructor() {
    super();

    this.state = {
      email: "",
      password: "",
      error: ""
    };
  }

  onEmailChange = event => {
    this.setState({
      email: event.target.value
    });
  };

  onPasswordChange = event => {
    this.setState({
      password: event.target.value
    });
  };

  // Submit
  onSubmit = event => {
    event.preventDefault();
    const { saveUser, onPageChange } = this.props;
    const { email, password } = this.state;
    fetch(
      "https://cors-anywhere.herokuapp.com/https://teamjollof.herokuapp.com/api/auth/register",
      {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password
        })
      }
    )
      .then(res => res.json())
      .then(user => {
        if (user.authenticated === true) {
          saveUser(user);
          onPageChange("welcome");
        } else if (user.error) {
          this.setState({ error: user.error });
        }
      });
  };

  render() {
    const { error } = this.state;
    return (
      
        <div className="signup-form-con">
          <form onSubmit={this.onSubmit} method="post">
            <p>{error}</p>
            <h1 className="text-primary" style={{ textAlign: "center" }}>
              Get Started
            </h1>
            <div style={{ textAlign: "center" }}>
              <img src={Image} alt="" height="200px" width="200px" />
            </div>
            <label htmlFor="username" className="label-brk">
              Email
            </label>
            <input
              type="email"
              name="email"
              onChange={this.onEmailChange}
              id="email"
              required
            />
            <label htmlFor="password" className="label-brk">
              Password
            </label>
            <input
              type="password"
              name="password"
              onChange={this.onPasswordChange}
              id="password"
              required
            />
            <button className="btn-primary">Sign Up</button>
          </form>
        </div>
      
    );
  }
}
export default Register;
