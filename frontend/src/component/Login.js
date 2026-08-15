import { useContext, useState } from "react";
import {
  Grid,
  TextField,
  Button,
  Typography,
  makeStyles,
  Paper,
} from "@material-ui/core";
import axios from "axios";
import { Redirect } from "react-router-dom";

import PasswordInput from "../lib/PasswordInput";
import EmailInput from "../lib/EmailInput";
import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    minHeight: "80vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    padding: "48px 40px",
    borderRadius: "20px",
    maxWidth: "400px",
    width: "100%",
  },
  inputBox: {
    width: "100%",
  },
  submitButton: {
    width: "100%",
    borderRadius: "20px",
    padding: "12px",
    fontWeight: 700,
    fontSize: "1rem",
    textTransform: "none",
  },
  title: {
    fontWeight: 800,
    color: "#1a237e",
  },
}));

const Login = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);

  const [loggedin, setLoggedin] = useState(isAuth());

  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  const [inputErrorHandler, setInputErrorHandler] = useState({
    email: {
      error: false,
      message: "",
    },
    password: {
      error: false,
      message: "",
    },
  });

  const handleInput = (key, value) => {
    setLoginDetails({
      ...loginDetails,
      [key]: value,
    });
  };

  const handleInputError = (key, status, message) => {
    setInputErrorHandler({
      ...inputErrorHandler,
      [key]: {
        error: status,
        message: message,
      },
    });
  };

  const handleLogin = () => {
    const verified = !Object.keys(inputErrorHandler).some((obj) => {
      return inputErrorHandler[obj].error;
    });
    if (verified) {
      axios
        .post(apiList.login, loginDetails)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("type", response.data.type);
          setLoggedin(isAuth());
          setPopup({
            open: true,
            severity: "success",
            message: "Logged in successfully",
          });
          console.log(response);
        })
        .catch((err) => {
          setPopup({
            open: true,
            severity: "error",
            message: err.response.data.message,
          });
          console.log(err.response);
        });
    } else {
      setPopup({
        open: true,
        severity: "error",
        message: "Incorrect Input",
      });
    }
  };

  return loggedin ? (
    <Redirect to="/" />
  ) : (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", width: "100%" }}>
      <Paper elevation={4} className={classes.body}>
        <Grid container direction="column" spacing={3} alignItems="center">
          <Grid item>
            <Typography variant="h4" className={classes.title}>
              Welcome Back
            </Typography>
            <Typography align="center" style={{ color: "#888", marginTop: "4px" }}>Sign in to your account</Typography>
          </Grid>
          <Grid item style={{ width: "100%" }}>
            <EmailInput
              label="Email"
              value={loginDetails.email}
              onChange={(event) => handleInput("email", event.target.value)}
              inputErrorHandler={inputErrorHandler}
              handleInputError={handleInputError}
              className={classes.inputBox}
              style={{ width: "100%" }}
            />
          </Grid>
          <Grid item style={{ width: "100%" }}>
            <PasswordInput
              label="Password"
              value={loginDetails.password}
              onChange={(event) => handleInput("password", event.target.value)}
              className={classes.inputBox}
              style={{ width: "100%" }}
            />
          </Grid>
          <Grid item style={{ width: "100%" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleLogin()}
              className={classes.submitButton}
            >
              Sign In
            </Button>
          </Grid>
          <Grid item>
            <Typography style={{ color: "#888", fontSize: "0.9rem" }}>
              Don't have an account?{" "}
              <a href="/signup" style={{ color: "#1565c0", fontWeight: 700, textDecoration: "none" }}>Sign up free</a>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default Login;
