import { useState, useContext } from "react";
import {
  Grid, TextField, Button, Typography, makeStyles,
  Paper, Chip, IconButton, Divider,
} from "@material-ui/core";
import axios from "axios";
import { Redirect, useHistory } from "react-router-dom";
import ChipInput from "material-ui-chip-input";
import DescriptionIcon from "@material-ui/icons/Description";
import FaceIcon from "@material-ui/icons/Face";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import WorkIcon from "@material-ui/icons/Work";

import PasswordInput from "../lib/PasswordInput";
import EmailInput from "../lib/EmailInput";
import FileUploadInput from "../lib/FileUploadInput";
import { SetPopupContext } from "../App";
import apiList from "../lib/apiList";
import isAuth from "../lib/isAuth";

const useStyles = makeStyles((theme) => ({
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f5f7ff 0%, #e8f0fe 100%)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "40px 16px",
  },
  card: {
    padding: "40px",
    borderRadius: "20px",
    maxWidth: "560px",
    width: "100%",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "8px",
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
  eduRow: {
    background: "#f5f7ff",
    borderRadius: "12px",
    padding: "16px",
    marginBottom: "10px",
    position: "relative",
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

const ApplicantSignup = () => {
  const classes = useStyles();
  const history = useHistory();
  const setPopup = useContext(SetPopupContext);
  const [loggedin] = useState(isAuth());

  const [details, setDetails] = useState({
    name: "", email: "", password: "",
    skills: [], resume: "", profile: "",
  });

  const [education, setEducation] = useState([
    { institutionName: "", startYear: "", endYear: "" },
  ]);

  const [errors, setErrors] = useState({
    name: "", email: "", password: "",
  });

  const currentYear = new Date().getFullYear();

  const validate = () => {
    let valid = true;
    const newErrors = { name: "", email: "", password: "" };
    if (!details.name.trim()) { newErrors.name = "Name is required"; valid = false; }
    if (!details.email.trim()) { newErrors.email = "Email is required"; valid = false; }
    if (!details.password.trim()) { newErrors.password = "Password is required"; valid = false; }

    for (let i = 0; i < education.length; i++) {
      const e = education[i];
      if (e.institutionName.trim()) {
        if (!e.startYear) { setPopup({ open: true, severity: "error", message: `Start year required for institution #${i + 1}` }); return false; }
        if (e.endYear && parseInt(e.endYear) < parseInt(e.startYear)) {
          setPopup({ open: true, severity: "error", message: `End year must be ≥ start year for institution #${i + 1}` });
          return false;
        }
      }
    }
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const cleanEdu = education
      .filter((e) => e.institutionName.trim() !== "")
      .map((e) => {
        const obj = {
          institutionName: e.institutionName,
          startYear: parseInt(e.startYear),
        };
        if (e.endYear !== "" && e.endYear !== null) {
          obj.endYear = parseInt(e.endYear);
        }
        return obj;
      });

    axios
      .post(apiList.signup, { ...details, type: "applicant", education: cleanEdu })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("type", res.data.type);
        setPopup({ open: true, severity: "success", message: "Account created! Welcome 🎉" });
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
        <div className={classes.header}>
          <WorkIcon style={{ color: "#1565c0", fontSize: "2rem" }} />
          <Typography variant="h5" style={{ fontWeight: 800, color: "#1a237e" }}>
            Create Applicant Account
          </Typography>
        </div>
        <Typography style={{ color: "#888", marginBottom: "24px", fontSize: "0.9rem" }}>
          Find your dream job — sign up as a job seeker
        </Typography>

        <Grid container direction="column" spacing={2}>
          {/* Basic Info */}
          <Grid item>
            <Typography className={classes.sectionLabel}>Basic Info</Typography>
          </Grid>
          <Grid item>
            <TextField
              label="Full Name" variant="outlined" fullWidth
              value={details.name}
              onChange={(e) => setDetails({ ...details, name: e.target.value })}
              error={!!errors.name} helperText={errors.name}
            />
          </Grid>
          <Grid item>
            <EmailInput
              label="Email" value={details.email} fullWidth
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

          {/* Education */}
          <Grid item>
            <Divider style={{ margin: "8px 0" }} />
            <Typography className={classes.sectionLabel}>Education</Typography>
          </Grid>
          {education.map((edu, i) => (
            <Grid item key={i}>
              <div className={classes.eduRow}>
                {education.length > 1 && (
                  <IconButton
                    size="small"
                    style={{ position: "absolute", top: 8, right: 8 }}
                    onClick={() => setEducation(education.filter((_, idx) => idx !== i))}
                  >
                    <DeleteIcon fontSize="small" style={{ color: "#e53935" }} />
                  </IconButton>
                )}
                <Grid container spacing={1}>
                  <Grid item xs={12}>
                    <TextField
                      label={`Institution Name`} variant="outlined" fullWidth size="small"
                      value={edu.institutionName}
                      onChange={(e) => {
                        const n = [...education]; n[i].institutionName = e.target.value; setEducation(n);
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Start Year" variant="outlined" fullWidth size="small" type="number"
                      value={edu.startYear}
                      inputProps={{ min: 1950, max: currentYear }}
                      onChange={(e) => {
                        const n = [...education]; n[i].startYear = e.target.value; setEducation(n);
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="End Year (or expected)" variant="outlined" fullWidth size="small" type="number"
                      value={edu.endYear}
                      inputProps={{ min: 1950, max: currentYear + 10 }}
                      helperText="Leave blank if ongoing"
                      onChange={(e) => {
                        const n = [...education]; n[i].endYear = e.target.value; setEducation(n);
                      }}
                    />
                  </Grid>
                </Grid>
              </div>
            </Grid>
          ))}
          <Grid item>
            <Button
              startIcon={<AddIcon />} size="small"
              style={{ textTransform: "none", color: "#1565c0", fontWeight: 600 }}
              onClick={() => setEducation([...education, { institutionName: "", startYear: "", endYear: "" }])}
            >
              Add another institution
            </Button>
          </Grid>

          {/* Skills */}
          <Grid item>
            <Divider style={{ margin: "8px 0" }} />
            <Typography className={classes.sectionLabel}>Skills</Typography>
          </Grid>
          <Grid item>
            <ChipInput
              label="Skills" variant="outlined" fullWidth
              helperText="Press Enter to add each skill"
              onChange={(chips) => setDetails({ ...details, skills: chips })}
            />
          </Grid>

          {/* Files */}
          <Grid item>
            <Divider style={{ margin: "8px 0" }} />
            <Typography className={classes.sectionLabel}>Documents (Optional)</Typography>
          </Grid>
          <Grid item>
            <FileUploadInput
              label="Resume (.pdf)" icon={<DescriptionIcon />} fullWidth
              uploadTo={apiList.uploadResume}
              handleInput={(key, val) => setDetails({ ...details, [key]: val })}
              identifier="resume"
            />
          </Grid>
          <Grid item>
            <FileUploadInput
              label="Profile Photo (.jpg/.png)" icon={<FaceIcon />} fullWidth
              uploadTo={apiList.uploadProfileImage}
              handleInput={(key, val) => setDetails({ ...details, [key]: val })}
              identifier="profile"
            />
          </Grid>

          <Grid item>
            <Button variant="contained" color="primary" fullWidth
              className={classes.submitBtn} onClick={handleSubmit}
            >
              Create Account
            </Button>
          </Grid>
          <Grid item style={{ textAlign: "center" }}>
            <Typography style={{ color: "#888", fontSize: "0.9rem" }}>
              Already have an account?{" "}
              <a href="/login" style={{ color: "#1565c0", fontWeight: 700, textDecoration: "none" }}>Sign in</a>
              {" · "}
              <a href="/recruiter/signup" style={{ color: "#1565c0", fontWeight: 700, textDecoration: "none" }}>Sign up as Recruiter</a>
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default ApplicantSignup;
