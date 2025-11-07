import React, { useState } from "react";
import { Box, Card, CardContent, Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import "./Authentification.css";
import { userLoginAPI, userRegistrationAPI } from "../services/allAPIs";


function Authentification({ register }) {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    password: "",
  });
  const handleLogin = async () => {
  try {
    const result = await userLoginAPI(userDetails); // userDetails = { email, password }

    swal("Welcome!", "Login Successful!", "success");

    // Store user data with id in localStorage
    localStorage.setItem("loggedUser", JSON.stringify({
      id: result.id,
      username: result.username,
      email: result.email
    }));

    // Redirect to dashboard or home
    navigate(`/dashboard/${result.id}`);
  } catch (error) {
    swal("Login Failed!", error.message, "error");
  }
};
  const addUser = async () => {
    const { username, email, password } = userDetails;

    if (username && email && password) {
      try {
        await userRegistrationAPI(userDetails);
        swal("Good job!", "User added successfully!", "success");
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } catch (err) {
        swal("Oops!", err.message || "Failed to add user!", "error");
      }
    } else {
      swal("Hold on!", "Please fill all the fields!", "warning");
    }
  };

  return (
    <Box className="auth-container">
      {/* Background Video */}
      <video autoPlay loop muted playsInline className="auth-video">
        <source src="/videos/FitTrack-bg.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <Box className="auth-overlay" />

      {/* Card */}
      <Box className="auth-card-container">
        <Card className="auth-card glass-card">
          <CardContent>
            <Typography
              variant="h4"
              textAlign="center"
              gutterBottom
              className="auth-title"
            >
              FitTrack {register ? "Register" : "Login"}
            </Typography>

            <form onSubmit={(e) => e.preventDefault()}>
              {register && (
                <Box className="auth-field">
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={userDetails.username}
                    onChange={(e) =>
                      setUserDetails({
                        ...userDetails,
                        username: e.target.value,
                      })
                    }
                  />
                </Box>
              )}

              <Box className="auth-field">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userDetails.email}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, email: e.target.value })
                  }
                />
              </Box>

              <Box className="auth-field">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={userDetails.password}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, password: e.target.value })
                  }
                />
              </Box>
              {
                register ?
                <Button
                  variant="contained"
                  fullWidth
                  className="auth-btn"
                  onClick={addUser}
                >
                  Register
                </Button>
                :
                <Button
                  variant="contained"
                  fullWidth
                  className="auth-btn"
                  onClick={handleLogin }
                >
                  Login
                </Button>
                }
            </form>

            <Typography textAlign="center" className="auth-link">
              {register ? (
                <>
                  Already have an account?{" "}
                  <Link to="/" className="auth-anchor">
                    Login
                  </Link>
                </>
              ) : (
                <>
                  Don’t have an account?{" "}
                  <Link to="/register" className="auth-anchor">
                    Register
                  </Link>
                </>
              )}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default Authentification;
