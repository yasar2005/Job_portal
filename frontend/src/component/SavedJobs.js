import { useState, useEffect, useContext } from "react";
import {
  Grid,
  Typography,
  Paper,
  Chip,
  Button,
  makeStyles,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import BookmarkIcon from "@material-ui/icons/Bookmark";
import DeleteIcon from "@material-ui/icons/Delete";
import axios from "axios";
import { SetPopupContext } from "../App";
import apiList from "../lib/apiList";

const useStyles = makeStyles((theme) => ({
  container: {
    padding: "30px",
    minHeight: "80vh",
    maxWidth: "900px",
    margin: "0 auto",
    width: "100%",
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "24px",
  },
  jobCard: {
    padding: "24px",
    marginBottom: "16px",
    borderRadius: "12px",
    borderLeft: "4px solid #1565c0",
    transition: "box-shadow 0.2s",
    "&:hover": { boxShadow: "0 6px 20px rgba(21,101,192,0.15)" },
  },
  chip: {
    marginRight: "6px",
    marginTop: "4px",
    background: "#e3f2fd",
    color: "#1565c0",
    fontWeight: 600,
  },
  salary: {
    color: "#2e7d32",
    fontWeight: 700,
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    color: "#888",
  },
}));

const SavedJobs = () => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const getSavedIds = () => {
    try {
      return JSON.parse(localStorage.getItem("savedJobs") || "[]");
    } catch {
      return [];
    }
  };

  const removeSaved = (jobId) => {
    const updated = getSavedIds().filter((id) => id !== jobId);
    localStorage.setItem("savedJobs", JSON.stringify(updated));
    setSavedJobs((prev) => prev.filter((j) => j._id !== jobId));
    setPopup({ open: true, severity: "info", message: "Job removed from saved list" });
  };

  useEffect(() => {
    const ids = getSavedIds();
    if (ids.length === 0) {
      setLoading(false);
      return;
    }
    axios
      .get(apiList.jobs, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        setSavedJobs(res.data.filter((j) => ids.includes(j._id)));
      })
      .catch(() => {
        setPopup({ open: true, severity: "error", message: "Failed to load saved jobs" });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Grid container direction="column" className={classes.container}>
      <div className={classes.header}>
        <BookmarkIcon style={{ color: "#1565c0", fontSize: "2rem" }} />
        <Typography variant="h4" style={{ fontWeight: 700 }}>
          Saved Jobs
        </Typography>
        <Chip label={`${savedJobs.length} saved`} color="primary" size="small" />
      </div>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : savedJobs.length === 0 ? (
        <div className={classes.emptyState}>
          <BookmarkIcon style={{ fontSize: "4rem", opacity: 0.3 }} />
          <Typography variant="h6" style={{ marginTop: "16px" }}>
            No saved jobs yet
          </Typography>
          <Typography style={{ marginTop: "8px" }}>
            Bookmark jobs from the Jobs page to see them here.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            style={{ marginTop: "24px", borderRadius: "20px" }}
            href="/home"
          >
            Browse Jobs
          </Button>
        </div>
      ) : (
        savedJobs.map((job) => (
          <Paper key={job._id} className={classes.jobCard} elevation={2}>
            <Grid container justify="space-between" alignItems="flex-start">
              <Grid item xs={10}>
                <Typography variant="h6" style={{ fontWeight: 700 }}>
                  {job.title}
                </Typography>
                <Typography style={{ color: "#555", marginBottom: "8px" }}>
                  {job.recruiter?.name} &bull; {job.jobType}
                </Typography>
                <Typography className={classes.salary}>
                  ₹{job.salary?.toLocaleString()} / month
                </Typography>
                <div style={{ marginTop: "10px" }}>
                  {job.skillsets?.map((skill) => (
                    <Chip key={skill} label={skill} size="small" className={classes.chip} />
                  ))}
                </div>
                <Typography style={{ color: "#888", fontSize: "0.85rem", marginTop: "8px" }}>
                  Deadline: {new Date(job.deadline).toLocaleDateString()}
                </Typography>
              </Grid>
              <Grid item>
                <Tooltip title="Remove from saved">
                  <IconButton onClick={() => removeSaved(job._id)} size="small">
                    <DeleteIcon style={{ color: "#e53935" }} />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </Paper>
        ))
      )}
    </Grid>
  );
};

export default SavedJobs;
