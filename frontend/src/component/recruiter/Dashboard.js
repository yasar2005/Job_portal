import { useState, useEffect, useContext } from "react";
import {
  Grid,
  Typography,
  Paper,
  Button,
  makeStyles,
  CircularProgress,
} from "@material-ui/core";
import WorkIcon from "@material-ui/icons/Work";
import PeopleIcon from "@material-ui/icons/People";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import HourglassEmptyIcon from "@material-ui/icons/HourglassEmpty";
import AddIcon from "@material-ui/icons/Add";
import ListIcon from "@material-ui/icons/List";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { SetPopupContext } from "../../App";
import apiList from "../../lib/apiList";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "32px",
    maxWidth: "1000px",
    margin: "0 auto",
    width: "100%",
    minHeight: "90vh",
  },
  welcomeBanner: {
    background: "linear-gradient(135deg, #1a237e 0%, #1565c0 100%)",
    borderRadius: "20px",
    padding: "32px 40px",
    color: "#fff",
    marginBottom: "32px",
  },
  statCard: {
    padding: "24px",
    borderRadius: "16px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    },
  },
  iconBox: {
    width: "56px",
    height: "56px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statNum: {
    fontWeight: 800,
    fontSize: "2rem",
    lineHeight: 1,
  },
  statLabel: {
    color: "#666",
    fontSize: "0.9rem",
    marginTop: "4px",
  },
  actionCard: {
    padding: "28px 24px",
    borderRadius: "16px",
    textAlign: "center",
    cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
      transform: "translateY(-4px)",
      boxShadow: "0 8px 24px rgba(21,101,192,0.18)",
    },
  },
  actionIcon: {
    fontSize: "2.5rem",
    color: "#1565c0",
    marginBottom: "12px",
  },
  sectionTitle: {
    fontWeight: 700,
    color: "#1a237e",
    marginBottom: "16px",
    marginTop: "32px",
  },
  recentJobCard: {
    padding: "16px 20px",
    borderRadius: "12px",
    borderLeft: "4px solid #1565c0",
    marginBottom: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

const StatCard = ({ icon, num, label, color }) => {
  const classes = useStyles();
  return (
    <Paper className={classes.statCard} elevation={2}>
      <div className={classes.iconBox} style={{ background: color + "22" }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <Typography className={classes.statNum}>{num}</Typography>
        <Typography className={classes.statLabel}>{label}</Typography>
      </div>
    </Paper>
  );
};

const Dashboard = () => {
  const classes = useStyles();
  const history = useHistory();
  const setPopup = useContext(SetPopupContext);

  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplicants: 0,
    accepted: 0,
    pending: 0,
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recruiterName, setRecruiterName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      axios.get(`${apiList.jobs}?myjobs=1`, { headers }),
      axios.get(apiList.user, { headers }),
    ])
      .then(([jobsRes, userRes]) => {
        const jobs = jobsRes.data;
        setRecruiterName(userRes.data.name || "Recruiter");
        setRecentJobs(jobs.slice(0, 3));

        axios
          .get(apiList.applicants, { headers })
          .then((appRes) => {
            const apps = appRes.data;
            setStats({
              totalJobs: jobs.length,
              totalApplicants: apps.length,
              accepted: apps.filter((a) => a.status === "accepted").length,
              pending: apps.filter((a) => a.status === "applied" || a.status === "shortlisted").length,
            });
          })
          .catch(() => {
            setStats((s) => ({ ...s, totalJobs: jobs.length }));
          })
          .finally(() => setLoading(false));
      })
      .catch(() => {
        setLoading(false);
        setPopup({ open: true, severity: "error", message: "Failed to load dashboard" });
      });
  }, [setPopup]);

  if (loading) {
    return (
      <Grid container justify="center" alignItems="center" style={{ minHeight: "80vh" }}>
        <CircularProgress />
      </Grid>
    );
  }

  return (
    <div className={classes.root}>
      {/* Welcome Banner */}
      <div className={classes.welcomeBanner}>
        <Typography variant="h4" style={{ fontWeight: 800 }}>
          Welcome back, {recruiterName}! 👋
        </Typography>
        <Typography style={{ opacity: 0.85, marginTop: "8px", fontSize: "1.05rem" }}>
          Here's what's happening with your job listings today.
        </Typography>
        <Button
          variant="contained"
          style={{ marginTop: "20px", background: "#fff", color: "#1a237e", borderRadius: "20px", fontWeight: 700, textTransform: "none" }}
          startIcon={<AddIcon />}
          onClick={() => history.push("/addjob")}
        >
          Post a New Job
        </Button>
      </div>

      {/* Stats */}
      <Typography variant="h6" className={classes.sectionTitle}>Overview</Typography>
      <Grid container spacing={3}>
        {[
          { icon: <WorkIcon />, num: stats.totalJobs, label: "Jobs Posted", color: "#1565c0" },
          { icon: <PeopleIcon />, num: stats.totalApplicants, label: "Total Applicants", color: "#7b1fa2" },
          { icon: <CheckCircleIcon />, num: stats.accepted, label: "Accepted", color: "#2e7d32" },
          { icon: <HourglassEmptyIcon />, num: stats.pending, label: "Pending Review", color: "#e65100" },
        ].map((s, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <StatCard {...s} />
          </Grid>
        ))}
      </Grid>

      {/* Quick Actions */}
      <Typography variant="h6" className={classes.sectionTitle}>Quick Actions</Typography>
      <Grid container spacing={3}>
        {[
          { icon: <AddIcon className={classes.actionIcon} />, label: "Post New Job", sub: "Create a new job listing", path: "/addjob" },
          { icon: <ListIcon className={classes.actionIcon} />, label: "My Jobs", sub: "Manage your posted jobs", path: "/myjobs" },
          { icon: <PeopleIcon className={classes.actionIcon} />, label: "Employees", sub: "View accepted candidates", path: "/employees" },
        ].map((a, i) => (
          <Grid item xs={12} sm={4} key={i}>
            <Paper className={classes.actionCard} elevation={2} onClick={() => history.push(a.path)}>
              {a.icon}
              <Typography variant="h6" style={{ fontWeight: 700 }}>{a.label}</Typography>
              <Typography style={{ color: "#888", fontSize: "0.85rem", marginTop: "4px" }}>{a.sub}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Recent Jobs */}
      {recentJobs.length > 0 && (
        <>
          <Typography variant="h6" className={classes.sectionTitle}>Recent Job Listings</Typography>
          {recentJobs.map((job) => (
            <Paper key={job._id} className={classes.recentJobCard} elevation={1}>
              <div>
                <Typography style={{ fontWeight: 700 }}>{job.title}</Typography>
                <Typography style={{ color: "#888", fontSize: "0.85rem" }}>
                  {job.jobType} &bull; ₹{job.salary?.toLocaleString()}/mo &bull; {job.maxPositions - job.acceptedCandidates} positions left
                </Typography>
              </div>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                style={{ borderRadius: "16px", textTransform: "none" }}
                onClick={() => history.push(`/job/applications/${job._id}`)}
              >
                View Applicants
              </Button>
            </Paper>
          ))}
          <Button
            color="primary"
            style={{ marginTop: "8px", textTransform: "none", fontWeight: 600 }}
            onClick={() => history.push("/myjobs")}
          >
            View all jobs →
          </Button>
        </>
      )}
    </div>
  );
};

export default Dashboard;
