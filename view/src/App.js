import React, { Component } from "react";
import "./App.css";

import Home from "./pages/LandingPage/Home";
import Welcome from "./pages/Welcome";
import Register from "./pages/RegisterPage/Register";
import Login from "./pages/LoginPage/Login";

class App extends Component {
  constructor() {
    super();

    this.state = {
      route: "",
      isSignedIn: false,
      user: {
        email: "",
        password: ""
      }
    };
  }

  // Func to save user
  saveUser = data => {
    this.setState({
      user: {
        email: data.email,
        password: data.password
      }
    });
  };

  onPageChange = route => {
    if (route === "welcome") {
      this.setState({ route: "welcome", isSignedIn: true });
    } else if (route === "register") {
      this.setState({ route: "register" });
    } else if(route === "signin") {
      this.setState({route: "signin"})
    }
  };

  render() {
    const { route, isSignedIn } = this.state;
    if (route === "welcome") {
      return <Welcome saveUser={this.saveUser}/>;
    } else if (route === "signin") {
      return (
        <Login saveUser={this.saveUser} onPageChange={this.onPageChange} />
      );
    } else if (route === "register") {
      return <Register saveUser={this.saveUser} onPageChange={this.onPageChange}/>;
    }

    return (
      <div className="App">
        <Home isSignedIn={isSignedIn} onPageChange={this.onPageChange} />
      </div>
    );
  }
}

export default App;
