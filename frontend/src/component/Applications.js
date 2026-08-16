import { useState, useEffect, useContext } from "react";
import {
  Button,
  Chip,
  Grid,
  IconButton,
  InputAdornment,
  makeStyles,
  Paper,
  TextField,
  Typography,
  Modal,
  Slider,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Checkbox,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import axios from "axios";

import { SetPopupContext } from "../App";

import apiList from "../lib/apiList";

const useStyles = makeStyles((theme) => ({
  body: { height: "inherit" },
  statusBlock: {
    padding: "6px 14px",
    borderRadius: "20px",
    fontWeight: 700,
    fontSize: "0.78rem",
    textTransform: "uppercase",
    display: "inline-block",
    letterSpacing: "0.5px",
  },
  jobTileOuter: {
    padding: "24px",
    margin: "12px 0",
    boxSizing: "border-box",
    width: "100%",
    borderRadius: "16px",
    borderLeft: "4px solid #1565c0",
    transition: "box-shadow 0.2s",
    "&:hover": { boxShadow: "0 6px 20px rgba(21,101,192,0.15)" },
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  chip: {
    marginRight: "4px",
    marginTop: "4px",
    background: "#e3f2fd",
    color: "#1565c0",
    fontWeight: 600,
  },
}));

const ApplicationTile = (props) => {
  const classes = useStyles();
  const { application } = props;
  const setPopup = useContext(SetPopupContext);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(application.job.rating);

  const appliedOn = new Date(application.dateOfApplication);
  const joinedOn = new Date(application.dateOfJoining);

  const fetchRating = () => {
    axios
      .get(`${apiList.rating}?id=${application.job._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        setRating(response.data.rating);
        console.log(response.data);
      })
      .catch((err) => {
        // console.log(err.response);
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  const changeRating = () => {
    axios
      .put(
        apiList.rating,
        { rating: rating, jobId: application.job._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setPopup({
          open: true,
          severity: "success",
          message: "Rating updated successfully",
        });
        fetchRating();
        setOpen(false);
      })
      .catch((err) => {
        // console.log(err.response);
        console.log(err);
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        fetchRating();
        setOpen(false);
      });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const colorSet = {
    applied: "#3454D1",
    shortlisted: "#DC851F",
    accepted: "#09BC8A",
    rejected: "#D1345B",
    deleted: "#B49A67",
    cancelled: "#FF8484",
    finished: "#4EA5D9",
  };

  return (
    <Paper className={classes.jobTileOuter} elevation={2}>
      <Grid container justify="space-between" alignItems="flex-start">
        <Grid container item xs={9} spacing={1} direction="column">
          <Grid item>
            <Typography variant="h6" style={{ fontWeight: 700 }}>{application.job.title}</Typography>
          </Grid>
          <Grid item>
            <Typography style={{ color: "#555", fontSize: "0.9rem" }}>
              {application.recruiter.name} &bull; {application.job.jobType}
            </Typography>
          </Grid>
          <Grid item>
            <Typography style={{ color: "#2e7d32", fontWeight: 700 }}>&#8377;{application.job.salary?.toLocaleString()} / month</Typography>
          </Grid>
          <Grid item>
            <Typography style={{ color: "#666", fontSize: "0.85rem" }}>
              Duration: {application.job.duration !== 0 ? `${application.job.duration} months` : "Flexible"}
            </Typography>
          </Grid>
          <Grid item>
            {application.job.skillsets.map((skill) => (
              <Chip key={skill} label={skill} size="small" className={classes.chip} />
            ))}
          </Grid>
          <Grid item>
            <Typography style={{ color: "#888", fontSize: "0.82rem", marginTop: "6px" }}>Applied: {appliedOn.toLocaleDateString()}</Typography>
            {(application.status === "accepted" || application.status === "finished") && (
              <Typography style={{ color: "#888", fontSize: "0.82rem" }}>Joined: {joinedOn.toLocaleDateString()}</Typography>
            )}
          </Grid>
        </Grid>
        <Grid item container direction="column" xs={3} alignItems="flex-end" spacing={1}>
          <Grid item>
            <span
              className={classes.statusBlock}
              style={{ background: colorSet[application.status] + "22", color: colorSet[application.status], border: `1px solid ${colorSet[application.status]}` }}
            >
              {application.status}
            </span>
          </Grid>
          {(application.status === "accepted" || application.status === "finished") && (
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                style={{ borderRadius: "20px", textTransform: "none", marginTop: "8px" }}
                onClick={() => { fetchRating(); setOpen(true); }}
              >
                ⭐ Rate Job
              </Button>
            </Grid>
          )}
        </Grid>
      </Grid>
      <Modal open={open} onClose={handleClose} className={classes.popupDialog}>
        <Paper
          style={{
            padding: "20px",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            minWidth: "30%",
            alignItems: "center",
          }}
        >
          <Rating
            name="simple-controlled"
            style={{ marginBottom: "30px" }}
            value={rating === -1 ? null : rating}
            onChange={(event, newValue) => {
              setRating(newValue);
            }}
          />
          <Button
            variant="contained"
            color="primary"
            style={{ padding: "10px 50px" }}
            onClick={() => changeRating()}
          >
            Submit
          </Button>
        </Paper>
      </Modal>
    </Paper>
  );
};

const Applications = (props) => {
  const setPopup = useContext(SetPopupContext);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    axios
      .get(apiList.applications, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setApplications(response.data);
      })
      .catch((err) => {
        // console.log(err.response);
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  return (
    <Grid
      container
      item
      direction="column"
      alignItems="center"
      style={{ padding: "30px", minHeight: "93vh", maxWidth: "900px", margin: "0 auto", width: "100%" }}
    >
      <Grid item style={{ width: "100%", marginBottom: "16px" }}>
        <Typography variant="h4" style={{ fontWeight: 700 }}>My Applications</Typography>
        <Typography style={{ color: "#888" }}>{applications.length} application{applications.length !== 1 ? "s" : ""} submitted</Typography>
      </Grid>
      <Grid container item xs direction="column" style={{ width: "100%" }} alignItems="stretch">
        {applications.length > 0 ? (
          applications.map((obj) => (
            <Grid item key={obj._id}>
              <ApplicationTile application={obj} />
            </Grid>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "60px 20px", color: "#888" }}>
            <Typography variant="h6">No applications yet</Typography>
            <Typography style={{ marginTop: "8px" }}>Browse jobs and start applying!</Typography>
            <Button variant="contained" color="primary" href="/home" style={{ marginTop: "20px", borderRadius: "20px", textTransform: "none" }}>Browse Jobs</Button>
          </div>
        )}
      </Grid>
    </Grid>
  );
};

export default Applications;
