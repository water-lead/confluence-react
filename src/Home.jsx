import React, { useState, useEffect } from "react";
import "./styles.css"; // Import your styles
import BackgroundVid from "./Assets/background-video.mp4";
import Logo from "./Assets/Logo.png";
import { useNavigate } from "react-router-dom";
import { setGlobalAccess } from "./features/authSlice";
import { useDispatch } from "react-redux";

const App = () => {
  const [requestBody, setRequestBody] = useState({
    email: "",
    password: "",
  });
  const [notification, setNotification] = useState("");
  const [access, setAccess] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  //for updating the global state
  useEffect(() => {
    if (access) {
      dispatch(setGlobalAccess(access));
    }
  }, [dispatch, access]);

  function showEmailInput() {
    document.getElementById("loginButton").style.display = "none";
    document.getElementById("emailInput").style.display = "block";
    document.getElementById("loginEmail").focus();
  }

  function showPasswordInput() {
    document.getElementById("emailInput").style.display = "none";
    document.getElementById("passwordInput").style.display = "block";
    document.getElementById("loginPassword").focus();
  }

  async function submitLoginForm() {
    try {
      const response = await fetch(
        "https://confluence-auth-8d9d6.uc.r.appspot.com/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      const data = await response.json();

      if (data.success) {
        setAccess(true);
        navigate("/studio");
      } else {
        setAccess(false);
        const notification = document.getElementById("notification");
        notification.style.display = "block";
        notification.innerText = "Incorrect login details. Please try again.";
      }
    } catch (error) {
      setAccess(false);
      console.error("Error:", error);
      const notification = document.getElementById("notification");
      notification.style.display = "block";
      notification.innerText = "You may not have access, please contact us.";
    }
  }

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
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      showPasswordInput();
                    }
                  }}
                  type="text"
                  id="loginEmail"
                  placeholder="E-mail Address"
                  onChange={(e) => {
                    setRequestBody((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }));
                  }}
                />
              </div>
              <div id="passwordInput" style={{ display: "none" }}>
                <input
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      submitLoginForm();
                    }
                  }}
                  type="password"
                  id="loginPassword"
                  placeholder="Password"
                  onChange={(e) => {
                    setRequestBody((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }));
                  }}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="notification" id="notification">
        {notification && <p>{notification}</p>}
      </div>
    </div>
  );
};

export default App;
