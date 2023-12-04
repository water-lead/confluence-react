import React, { useState } from "react";
import "./styles.css"; // Import your styles
import BackgroundVid from "./Assets/background-video.mp4";
import Logo from "./Assets/Logo.png";
import { useNavigate } from "react-router-dom";

const App = () => {
  const [requestBody, setRequestBody] = useState({});
  const [notification, setNotification] = useState("");

  const navigate = useNavigate();

  function showEmailInput() {
    document.getElementById("loginButton").style.display = "none";
    document.getElementById("emailInput").style.display = "block";
    document.getElementById("loginEmail").focus();
  }

  function showPasswordInput() {
    return new Promise((resolve) => {
      requestBody.email = document.getElementById("loginEmail").value;
      document.getElementById("emailInput").style.display = "none";
      document.getElementById("passwordInput").style.display = "block";
      document.getElementById("loginPassword").focus();
      resolve();
    });
  }

  async function submitLoginForm() {
    await showPasswordInput(); // Wait for showPasswordInput to complete before proceeding

    requestBody.password = document.getElementById("loginPassword").value;

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (data.success) {
        navigate("/studio");
      } else {
        const notification = document.getElementById("notification");
        notification.style.display = "block";
        notification.innerText = "Incorrect login details. Please try again.";
      }
    } catch (error) {
      console.error("Error:", error);
      const notification = document.getElementById("notification");
      notification.style.display = "block";
      notification.innerText = "You may not have access, please contact us.";
    }
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      if (document.getElementById("loginButton").style.display === "block") {
        showEmailInput();
      } else if (
        document.getElementById("emailInput").style.display === "block"
      ) {
        showPasswordInput();
      } else if (
        document.getElementById("passwordInput").style.display === "block"
      ) {
        submitLoginForm();
      }
    }
  });

  return (
    <div>
      {/* Background Video */}
      <div className="desktop-v">
        <video id="video-bg-desktop" autoPlay muted loop>
          <source src={BackgroundVid} type="video/mp4" />
        </video>
      </div>

      {/* Navigation Menu */}
      <nav className="menu">
        <div className="logo">
          <img src={Logo} alt="Token Studio Logo" />
        </div>
        <ul className="menu-items">
          <li>
            <a href="mailto:bmosuro@waterdesigns.io">CONTACT</a>
          </li>
        </ul>
      </nav>

      <div className="landing-content">
        {/* Landing Page Content */}
        <section className="landing-section" id="landing">
          <div id="firebaseui-auth-container">
            <div className="centered">
              <div id="loginButton">
                <button onClick={showEmailInput}>START HERE</button>
              </div>
              <div id="emailInput" style={{ display: "none" }}>
                <input
                  type="text"
                  id="loginEmail"
                  placeholder="E-mail Address"
                />
              </div>
              <div id="passwordInput" style={{ display: "none" }}>
                <input
                  type="password"
                  id="loginPassword"
                  placeholder="Password"
                />
              </div>
              <div className="notification" id="notification">
                {notification && <p>{notification}</p>}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;
