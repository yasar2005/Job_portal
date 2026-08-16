import { useContext, useState } from "react";
import {
  Grid, Button, Typography, makeStyles, Paper,
} from "@material-ui/core";
import axios from "axios";
import { Redirect, useHistory } from "react-router-dom";
import BusinessIcon from "@material-ui/icons/Business";

import PasswordInput from "../lib/PasswordInput";
import EmailInput from "../lib/EmailInput";
import { SetPopupContext } from "../App";
import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";

const useStyles = makeStyles(() => ({
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px 16px",
  },
  card: {
    padding: "48px 40px",
    borderRadius: "20px",
    maxWidth: "420px",
    width: "100%",
  },
  submitBtn: {
    borderRadius: "20px",
    padding: "12px",
    fontWeight: 700,
    fontSize: "1rem",
    textTransform: "none",
  },
  badge: {
    background: "#e8f0fe",
    color: "#1565c0",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "0.78rem",
    fontWeight: 700,
    display: "inline-block",
    marginBottom: "16px",
  },
}));

const RecruiterLogin = () => {
  const classes = useStyles();
  const history = useHistory();
  const setPopup = useContext(SetPopupContext);
  const [loggedin] = useState(isAuth());

  const [loginDetails, setLoginDetails] = useState({ email: "", password: "" });
  const [inputErrorHandler, setInputErrorHandler] = useState({
    email: { error: false, message: "" },
    password: { error: false, message: "" },
  });

  const handleLogin = () => {
    const hasError = Object.values(inputErrorHandler).some((f) => f.error);
    if (hasError) {
      setPopup({ open: true, severity: "error", message: "Please fix the errors" });
      return;
    }
    axios
      .post(apiList.login, loginDetails)
      .then((res) => {
        if (res.data.type !== "recruiter") {
          setPopup({ open: true, severity: "error", message: "This account is not a recruiter account. Use applicant login." });
          return;
        }
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("type", res.data.type);
        setPopup({ open: true, severity: "success", message: "Welcome back! 👋" });
        history.push("/home");
      })
      .catch((err) => {
        setPopup({ open: true, severity: "error", message: err.response?.data?.message || "Login failed" });
      });
  };

  if (loggedin) return <Redirect to="/home" />;

  return (
    <div className={classes.page}>
      <Paper elevation={4} className={classes.card}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
          <BusinessIcon style={{ color: "#1565c0", fontSize: "2rem" }} />
          <Typography variant="h5" style={{ fontWeight: 800, color: "#1a237e" }}>
            Recruiter Login
          </Typography>
        </div>
        <span className={classes.badge}>For Employers & Recruiters</span>

        <Grid container direction="column" spacing={2}>
          <Grid item>
            <EmailInput
              label="Work Email" value={loginDetails.email} fullWidth
              onChange={(e) => setLoginDetails({ ...loginDetails, email: e.target.value })}
              inputErrorHandler={inputErrorHandler}
              handleInputError={(key, status, msg) =>
                setInputErrorHandler({ ...inputErrorHandler, [key]: { error: status, message: msg } })
              }
            />
          </Grid>
          <Grid item>
            <PasswordInput
              label="Password" value={loginDetails.password} fullWidth
              onChange={(e) => setLoginDetails({ ...loginDetails, password: e.target.value })}
            />
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" fullWidth
              className={classes.submitBtn}
              onClick={handleLogin}
            >
              Sign In as Recruiter
            </Button>
          </Grid>
          <Grid item style={{ textAlign: "center" }}>
            <Typography style={{ color: "#888", fontSize: "0.9rem" }}>
              No account?{" "}
              <a href="/recruiter/signup" style={{ color: "#1565c0", fontWeight: 700, textDecoration: "none" }}>
                Register as Recruiter
              </a>
            </Typography>
            <Typography style={{ color: "#888", fontSize: "0.9rem", marginTop: "6px" }}>
              Are you a job seeker?{" "}
              <a href="/login" style={{ color: "#1565c0", fontWeight: 700, textDecoration: "none" }}>
                Applicant Login
              </a>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default RecruiterLogin;
