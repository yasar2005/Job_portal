import { useContext, useState } from "react";
import {
  Button, Grid, Typography, Paper, makeStyles,
  TextField, MenuItem, Chip, IconButton,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import axios from "axios";
import { SetPopupContext } from "../../App";
import apiList from "../../lib/apiList";

const useStyles = makeStyles(() => ({
  page: {
    padding: "32px",
    maxWidth: "680px",
    margin: "0 auto",
    width: "100%",
    minHeight: "90vh",
  },
  card: {
    padding: "36px",
    borderRadius: "20px",
  },
  sectionLabel: {
    fontWeight: 700,
    color: "#1a237e",
    fontSize: "0.85rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    marginBottom: "12px",
    marginTop: "8px",
  },
  submitBtn: {
    borderRadius: "20px",
    padding: "12px 48px",
    fontWeight: 700,
    fontSize: "1rem",
    textTransform: "none",
    marginTop: "16px",
  },
}));

const CreateJobs = () => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);

  const defaultDeadline = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
    .toISOString()
    .substr(0, 16);

  const [jobDetails, setJobDetails] = useState({
    title: "",
    maxApplicants: 100,
    maxPositions: 5,
    deadline: defaultDeadline,
    skillsets: [],
    jobType: "Full Time",
    duration: 0,
    salary: 0,
  });

  const [skillInput, setSkillInput] = useState("");

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !jobDetails.skillsets.includes(s)) {
      setJobDetails({ ...jobDetails, skillsets: [...jobDetails.skillsets, s] });
    }
    setSkillInput("");
  };

  const removeSkill = (skill) => {
    setJobDetails({ ...jobDetails, skillsets: jobDetails.skillsets.filter((s) => s !== skill) });
  };

  const handleSubmit = () => {
    if (!jobDetails.title.trim()) {
      setPopup({ open: true, severity: "error", message: "Job title is required" });
      return;
    }
    axios
      .post(apiList.jobs, jobDetails, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setPopup({ open: true, severity: "success", message: res.data.message });
        setJobDetails({
          title: "", maxApplicants: 100, maxPositions: 5,
          deadline: defaultDeadline, skillsets: [], jobType: "Full Time", duration: 0, salary: 0,
        });
      })
      .catch((err) => {
        setPopup({ open: true, severity: "error", message: err.response?.data?.message || "Error creating job" });
      });
  };

  return (
    <div className={classes.page}>
      <Typography variant="h4" style={{ fontWeight: 700, marginBottom: "24px" }}>Post a New Job</Typography>
      <Paper elevation={3} className={classes.card}>
        <Grid container direction="column" spacing={3}>

          {/* Job Info */}
          <Grid item>
            <Typography className={classes.sectionLabel}>Job Details</Typography>
          </Grid>
          <Grid item>
            <TextField
              label="Job Title" variant="outlined" fullWidth
              value={jobDetails.title}
              onChange={(e) => setJobDetails({ ...jobDetails, title: e.target.value })}
              placeholder="e.g. Frontend Developer"
            />
          </Grid>
          <Grid container item spacing={2}>
            <Grid item xs={6}>
              <TextField
                select label="Job Type" variant="outlined" fullWidth
                value={jobDetails.jobType}
                onChange={(e) => setJobDetails({ ...jobDetails, jobType: e.target.value })}
              >
                <MenuItem value="Full Time">Full Time</MenuItem>
                <MenuItem value="Part Time">Part Time</MenuItem>
                <MenuItem value="Work From Home">Work From Home</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                select label="Duration" variant="outlined" fullWidth
                value={jobDetails.duration}
                onChange={(e) => setJobDetails({ ...jobDetails, duration: e.target.value })}
              >
                <MenuItem value={0}>Flexible</MenuItem>
                {[1,2,3,4,5,6].map((m) => (
                  <MenuItem key={m} value={m}>{m} Month{m > 1 ? "s" : ""}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
          <Grid item>
            <TextField
              label="Monthly Salary (₹)" type="number" variant="outlined" fullWidth
              value={jobDetails.salary}
              onChange={(e) => setJobDetails({ ...jobDetails, salary: e.target.value })}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>

          {/* Skills */}
          <Grid item>
            <Typography className={classes.sectionLabel}>Required Skills</Typography>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs>
                <TextField
                  label="Add a skill" variant="outlined" fullWidth size="small"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                  placeholder="e.g. React, Node.js"
                />
              </Grid>
              <Grid item>
                <IconButton
                  color="primary"
                  onClick={addSkill}
                  style={{ background: "#1565c0", color: "#fff", borderRadius: "10px" }}
                >
                  <AddIcon />
                </IconButton>
              </Grid>
            </Grid>
            <div style={{ marginTop: "10px" }}>
              {jobDetails.skillsets.map((skill) => (
                <Chip
                  key={skill} label={skill} onDelete={() => removeSkill(skill)}
                  style={{ marginRight: "6px", marginBottom: "6px", background: "#e3f2fd", color: "#1565c0", fontWeight: 600 }}
                />
              ))}
            </div>
          </Grid>

          {/* Settings */}
          <Grid item>
            <Typography className={classes.sectionLabel}>Application Settings</Typography>
          </Grid>
          <Grid item>
            <TextField
              label="Application Deadline" type="datetime-local" variant="outlined" fullWidth
              value={jobDetails.deadline}
              onChange={(e) => setJobDetails({ ...jobDetails, deadline: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid container item spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="Max Applicants" type="number" variant="outlined" fullWidth
                value={jobDetails.maxApplicants}
                onChange={(e) => setJobDetails({ ...jobDetails, maxApplicants: e.target.value })}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Open Positions" type="number" variant="outlined" fullWidth
                value={jobDetails.maxPositions}
                onChange={(e) => setJobDetails({ ...jobDetails, maxPositions: e.target.value })}
                InputProps={{ inputProps: { min: 1 } }}
              />
            </Grid>
          </Grid>

          <Grid item style={{ textAlign: "center" }}>
            <Button
              variant="contained" color="primary"
              className={classes.submitBtn}
              onClick={handleSubmit}
            >
              Post Job
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default CreateJobs;
