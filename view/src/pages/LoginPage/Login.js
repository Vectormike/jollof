import React, { Component } from "react";
import "./Login.css";
import groupImg from "../../assets/23851.png";

class Login extends Component {
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
      "https://cors-anywhere.herokuapp.com/https://teamjollof.herokuapp.com/api/auth/login",
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
    const {onPageChange} = this.props;
    const { error } = this.state;
    return (
      <div className="Login">
        <div className="form-con">
          <form onSubmit={this.onSubmit} method="post">
            <p style={{ color: "red" }}>{error}</p>
            <h1 className="text-primary">Login</h1>
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

            <label htmlFor="remember" className="label-brk">
              <input type="checkbox" name="remember" id="remember" />
              Remember Me
            </label>
            <button className="btn-primary">Login</button>
            <button className="btn-transparent-default">Forgot Password</button>
            <button onClick={() => onPageChange('register')} className="btn-transparent-primary">
              Don't have an account?
            </button>
          </form>
        </div>
        <div className="img-con">
          <img src={groupImg} alt="" />
        </div>
      </div>
    );
  }
}

export default Login;
