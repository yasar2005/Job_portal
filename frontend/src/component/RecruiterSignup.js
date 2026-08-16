import { useState, useContext } from "react";
import {
  Grid, TextField, Button, Typography, makeStyles, Paper, Divider,
} from "@material-ui/core";
import axios from "axios";
import { Redirect, useHistory } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/material.css";
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
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "40px 16px",
  },
  card: {
    padding: "40px",
    borderRadius: "20px",
    maxWidth: "520px",
    width: "100%",
  },
  sectionLabel: {
    fontWeight: 700,
    color: "#1a237e",
    marginTop: "16px",
    marginBottom: "8px",
    fontSize: "0.9rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  submitBtn: {
    borderRadius: "20px",
    padding: "12px",
    fontWeight: 700,
    fontSize: "1rem",
    textTransform: "none",
    marginTop: "8px",
  },
}));

const RecruiterSignup = () => {
  const classes = useStyles();
  const history = useHistory();
  const setPopup = useContext(SetPopupContext);
  const [loggedin] = useState(isAuth());

  const [details, setDetails] = useState({
    name: "", email: "", password: "", bio: "",
  });
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });

  const validate = () => {
    const e = { name: "", email: "", password: "" };
    let valid = true;
    if (!details.name.trim()) { e.name = "Company / Name is required"; valid = false; }
    if (!details.email.trim()) { e.email = "Email is required"; valid = false; }
    if (!details.password.trim()) { e.password = "Password is required"; valid = false; }
    setErrors(e);
    return valid;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const payload = {
      ...details,
      type: "recruiter",
      contactNumber: phone ? `+${phone}` : "",
    };
    axios
      .post(apiList.signup, payload)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("type", res.data.type);
        setPopup({ open: true, severity: "success", message: "Recruiter account created! 🎉" });
        history.push("/home");
      })
      .catch((err) => {
        setPopup({ open: true, severity: "error", message: err.response?.data?.message || "Signup failed" });
      });
  };

  if (loggedin) return <Redirect to="/home" />;

  return (
    <div className={classes.page}>
      <Paper elevation={4} className={classes.card}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <BusinessIcon style={{ color: "#1565c0", fontSize: "2rem" }} />
          <Typography variant="h5" style={{ fontWeight: 800, color: "#1a237e" }}>
            Create Recruiter Account
          </Typography>
        </div>
        <Typography style={{ color: "#888", marginBottom: "24px", fontSize: "0.9rem" }}>
          Post jobs and find top talent for your company
        </Typography>

        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Typography className={classes.sectionLabel}>Company / Personal Info</Typography>
          </Grid>
          <Grid item>
            <TextField
              label="Company or Full Name" variant="outlined" fullWidth
              value={details.name}
              onChange={(e) => setDetails({ ...details, name: e.target.value })}
              error={!!errors.name} helperText={errors.name}
            />
          </Grid>
          <Grid item>
            <EmailInput
              label="Work Email" value={details.email} fullWidth
              onChange={(e) => setDetails({ ...details, email: e.target.value })}
              inputErrorHandler={{ email: { error: !!errors.email, message: errors.email } }}
              handleInputError={(key, status, msg) => setErrors({ ...errors, email: msg })}
            />
          </Grid>
          <Grid item>
            <PasswordInput
              label="Password" value={details.password} fullWidth
              onChange={(e) => setDetails({ ...details, password: e.target.value })}
              error={!!errors.password} helperText={errors.password}
            />
          </Grid>

          <Grid item>
            <Divider style={{ margin: "8px 0" }} />
            <Typography className={classes.sectionLabel}>Company Details (Optional)</Typography>
          </Grid>
          <Grid item>
            <TextField
              label="Bio / Company Description" variant="outlined" fullWidth
              multiline rows={4}
              placeholder="Tell applicants about your company..."
              value={details.bio}
              onChange={(e) => {
                const words = e.target.value.split(" ").filter((w) => w !== "");
                if (words.length <= 250) setDetails({ ...details, bio: e.target.value });
              }}
              helperText={`${details.bio.split(" ").filter((w) => w !== "").length}/250 words`}
            />
          </Grid>
          <Grid item>
            <Typography style={{ fontSize: "0.85rem", color: "#666", marginBottom: "6px" }}>
              Contact Number
            </Typography>
            <PhoneInput
              country="in" value={phone}
              onChange={(p) => setPhone(p)}
              inputStyle={{ width: "100%" }}
            />
          </Grid>

          <Grid item>
            <Button variant="contained" color="primary" fullWidth
              className={classes.submitBtn} onClick={handleSubmit}
            >
              Create Recruiter Account
            </Button>
          </Grid>
          <Grid item style={{ textAlign: "center" }}>
            <Typography style={{ color: "#888", fontSize: "0.9rem" }}>
              Already have an account?{" "}
              <a href="/recruiter/login" style={{ color: "#1565c0", fontWeight: 700, textDecoration: "none" }}>Sign in</a>
              {" · "}
              <a href="/signup" style={{ color: "#1565c0", fontWeight: 700, textDecoration: "none" }}>Sign up as Applicant</a>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default RecruiterSignup;
