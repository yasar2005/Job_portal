import { useState, useEffect, useContext, useCallback } from "react";
import {
  Button, Chip, Grid, IconButton, makeStyles, Paper,
  Typography, Modal, FormControlLabel, Checkbox, Avatar, Tooltip, Divider,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import Rating from "@material-ui/lab/Rating";
import axios from "axios";
import FilterListIcon from "@material-ui/icons/FilterList";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import GetAppIcon from "@material-ui/icons/GetApp";
import VisibilityIcon from "@material-ui/icons/Visibility";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import StarIcon from "@material-ui/icons/Star";

import { SetPopupContext } from "../../App";
import apiList, { server } from "../../lib/apiList";

const useStyles = makeStyles((theme) => ({
  page: {
    padding: "30px",
    minHeight: "93vh",
    maxWidth: "1000px",
    margin: "0 auto",
    width: "100%",
  },
  card: {
    padding: "24px",
    marginBottom: "16px",
    borderRadius: "16px",
    borderLeft: "4px solid #1565c0",
    transition: "box-shadow 0.2s",
    "&:hover": { boxShadow: "0 6px 20px rgba(21,101,192,0.12)" },
  },
  avatar: {
    width: theme.spacing(9),
    height: theme.spacing(9),
    border: "3px solid #e3f2fd",
  },
  statusBadge: {
    padding: "4px 14px",
    borderRadius: "20px",
    fontWeight: 700,
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    display: "inline-block",
  },
  chip: {
    marginRight: "4px",
    marginTop: "4px",
    background: "#e3f2fd",
    color: "#1565c0",
    fontWeight: 600,
    fontSize: "0.75rem",
  },
  actionBtn: {
    borderRadius: "20px",
    textTransform: "none",
    fontWeight: 700,
    fontSize: "0.82rem",
    padding: "6px 16px",
    marginBottom: "6px",
    width: "100%",
  },
  popupDialog: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  sopBox: {
    background: "#f5f7ff",
    borderRadius: "10px",
    padding: "14px",
    marginTop: "8px",
    fontSize: "0.9rem",
    color: "#444",
    lineHeight: 1.6,
    maxHeight: "120px",
    overflow: "hidden",
    position: "relative",
  },
}));

const colorSet = {
  applied:     { bg: "#e3f2fd", text: "#1565c0" },
  shortlisted: { bg: "#e8f5e9", text: "#2e7d32" },
  accepted:    { bg: "#e8f5e9", text: "#1b5e20" },
  rejected:    { bg: "#ffebee", text: "#c62828" },
  cancelled:   { bg: "#fff3e0", text: "#e65100" },
  finished:    { bg: "#e8eaf6", text: "#283593" },
  deleted:     { bg: "#f5f5f5", text: "#757575" },
};

const ApplicationTile = ({ application, getData }) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);
  const [sopOpen, setSopOpen] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);
  const [rating, setRating] = useState(application.jobApplicant.rating);

  const appliedOn = new Date(application.dateOfApplication).toLocaleDateString();
  const status = application.status;
  const colors = colorSet[status] || colorSet.applied;

  const getResume = () => {
    if (!application.jobApplicant.resume) {
      setPopup({ open: true, severity: "error", message: "No resume uploaded by this applicant" });
      return;
    }
    const address = `${server}${application.jobApplicant.resume}`;
    axios(address, {
      method: "GET",
      responseType: "blob",
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((response) => {
        const file = new Blob([response.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      })
      .catch(() => {
        // fallback: open directly
        window.open(address, "_blank");
      });
  };

  const updateStatus = (newStatus) => {
    axios
      .put(
        `${apiList.applications}/${application._id}`,
        { status: newStatus, dateOfJoining: new Date().toISOString() },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      )
      .then((res) => {
        setPopup({ open: true, severity: "success", message: res.data.message });
        getData();
      })
      .catch((err) => {
        setPopup({ open: true, severity: "error", message: err.response?.data?.message || "Error" });
      });
  };

  const submitRating = () => {
    axios
      .put(
        apiList.rating,
        { rating, applicantId: application.jobApplicant.userId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      )
      .then(() => {
        setPopup({ open: true, severity: "success", message: "Rating submitted!" });
        setRatingOpen(false);
        getData();
      })
      .catch((err) => {
        setPopup({ open: true, severity: "error", message: err.response?.data?.message || "Error" });
        setRatingOpen(false);
      });
  };

  return (
    <Paper className={classes.card} elevation={2}>
      <Grid container spacing={2} alignItems="flex-start">
        {/* Avatar */}
        <Grid item>
          <Avatar
            src={application.jobApplicant.profile ? `${server}${application.jobApplicant.profile}` : ""}
            className={classes.avatar}
          >
            {application.jobApplicant.name?.[0]?.toUpperCase()}
          </Avatar>
        </Grid>

        {/* Main Info */}
        <Grid item xs>
          <Grid container justify="space-between" alignItems="flex-start">
            <Grid item>
              <Typography variant="h6" style={{ fontWeight: 700 }}>
                {application.jobApplicant.name}
              </Typography>
              <Rating
                value={application.jobApplicant.rating !== -1 ? application.jobApplicant.rating : null}
                readOnly size="small"
              />
            </Grid>
            <Grid item>
              <span
                className={classes.statusBadge}
                style={{ background: colors.bg, color: colors.text }}
              >
                {status}
              </span>
            </Grid>
          </Grid>

          <Typography style={{ color: "#666", fontSize: "0.85rem", marginTop: "4px" }}>
            Applied: {appliedOn}
          </Typography>

          {/* Education */}
          {application.jobApplicant.education?.length > 0 && (
            <Typography style={{ color: "#555", fontSize: "0.85rem", marginTop: "4px" }}>
              🎓 {application.jobApplicant.education.map((e) =>
                `${e.institutionName} (${e.startYear}–${e.endYear || "Ongoing"})`
              ).join(", ")}
            </Typography>
          )}

          {/* Skills */}
          <div style={{ marginTop: "8px" }}>
            {application.jobApplicant.skills?.map((skill) => (
              <Chip key={skill} label={skill} size="small" className={classes.chip} />
            ))}
          </div>

          {/* SOP */}
          {application.sop && (
            <>
              <Typography style={{ fontWeight: 600, marginTop: "10px", fontSize: "0.85rem", color: "#1a237e" }}>
                Statement of Purpose:
              </Typography>
              <div className={classes.sopBox}>
                {application.sop.length > 200
                  ? `${application.sop.substring(0, 200)}...`
                  : application.sop}
              </div>
              {application.sop.length > 200 && (
                <Button
                  size="small"
                  color="primary"
                  style={{ textTransform: "none", marginTop: "4px" }}
                  startIcon={<VisibilityIcon />}
                  onClick={() => setSopOpen(true)}
                >
                  Read full SOP
                </Button>
              )}
            </>
          )}
        </Grid>

        {/* Action Buttons */}
        <Grid item style={{ minWidth: "150px" }}>
          <Tooltip title="View / Download Resume">
            <Button
              variant="outlined"
              color="primary"
              className={classes.actionBtn}
              startIcon={<GetAppIcon />}
              onClick={getResume}
            >
              Resume
            </Button>
          </Tooltip>

          {status === "applied" && (
            <>
              <Button
                variant="contained"
                className={classes.actionBtn}
                style={{ background: "#2e7d32", color: "#fff" }}
                startIcon={<CheckCircleIcon />}
                onClick={() => updateStatus("shortlisted")}
              >
                Shortlist ✓
              </Button>
              <Button
                variant="contained"
                className={classes.actionBtn}
                style={{ background: "#c62828", color: "#fff" }}
                startIcon={<CancelIcon />}
                onClick={() => updateStatus("rejected")}
              >
                Reject
              </Button>
            </>
          )}

          {status === "shortlisted" && (
            <>
              <Button
                variant="contained"
                className={classes.actionBtn}
                style={{ background: "#1b5e20", color: "#fff" }}
                startIcon={<CheckCircleIcon />}
                onClick={() => updateStatus("accepted")}
              >
                Accept ✓
              </Button>
              <Button
                variant="contained"
                className={classes.actionBtn}
                style={{ background: "#c62828", color: "#fff" }}
                startIcon={<CancelIcon />}
                onClick={() => updateStatus("rejected")}
              >
                Reject
              </Button>
            </>
          )}

          {(status === "accepted" || status === "finished") && (
            <Button
              variant="outlined"
              color="primary"
              className={classes.actionBtn}
              startIcon={<StarIcon />}
              onClick={() => setRatingOpen(true)}
            >
              Rate Applicant
            </Button>
          )}
        </Grid>
      </Grid>

      {/* SOP Full Modal */}
      <Modal open={sopOpen} onClose={() => setSopOpen(false)} className={classes.popupDialog}>
        <Paper style={{ padding: "32px", outline: "none", maxWidth: "560px", borderRadius: "16px" }}>
          <Typography variant="h6" style={{ fontWeight: 700, marginBottom: "16px", color: "#1a237e" }}>
            Statement of Purpose — {application.jobApplicant.name}
          </Typography>
          <Typography style={{ lineHeight: 1.8, color: "#444" }}>{application.sop}</Typography>
          <Button
            variant="contained" color="primary"
            style={{ marginTop: "20px", borderRadius: "20px", textTransform: "none" }}
            onClick={() => setSopOpen(false)}
          >
            Close
          </Button>
        </Paper>
      </Modal>

      {/* Rating Modal */}
      <Modal open={ratingOpen} onClose={() => setRatingOpen(false)} className={classes.popupDialog}>
        <Paper style={{ padding: "32px", outline: "none", minWidth: "300px", borderRadius: "16px", textAlign: "center" }}>
          <Typography variant="h6" style={{ fontWeight: 700, marginBottom: "16px" }}>
            Rate {application.jobApplicant.name}
          </Typography>
          <Rating
            value={rating === -1 ? null : rating}
            onChange={(_, val) => setRating(val)}
            size="large"
            style={{ marginBottom: "20px" }}
          />
          <br />
          <Button variant="contained" color="primary"
            style={{ borderRadius: "20px", textTransform: "none", padding: "8px 32px" }}
            onClick={submitRating}
          >
            Submit Rating
          </Button>
        </Paper>
      </Modal>
    </Paper>
  );
};

const JobApplications = () => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);
  const [applications, setApplications] = useState([]);
  const { jobId } = useParams();
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchOptions, setSearchOptions] = useState({
    status: { applied: false, shortlisted: false, rejected: false },
    sort: {
      "jobApplicant.name": { status: false, desc: false },
      dateOfApplication: { status: true, desc: true },
      "jobApplicant.rating": { status: false, desc: false },
    },
  });

  const getData = useCallback(() => {
    let searchParams = [];
    if (searchOptions.status.rejected) searchParams.push("status=rejected");
    if (searchOptions.status.applied) searchParams.push("status=applied");
    if (searchOptions.status.shortlisted) searchParams.push("status=shortlisted");

    Object.keys(searchOptions.sort).forEach((key) => {
      const item = searchOptions.sort[key];
      if (item.status) searchParams.push(`${item.desc ? "desc" : "asc"}=${key}`);
    });

    const qs = searchParams.join("&");
    const address = `${apiList.applicants}?jobId=${jobId}${qs ? "&" + qs : ""}`;

    axios
      .get(address, { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
      .then((res) => setApplications(res.data))
      .catch((err) => {
        setApplications([]);
        if (err.response?.status !== 404) {
          setPopup({ open: true, severity: "error", message: err.response?.data?.message || "Error" });
        }
      });
  }, [searchOptions, jobId, setPopup]);

  useEffect(() => { getData(); }, [getData]);

  const counts = {
    total: applications.length,
    applied: applications.filter((a) => a.status === "applied").length,
    shortlisted: applications.filter((a) => a.status === "shortlisted").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
  };

  return (
    <div className={classes.page}>
      {/* Header */}
      <Grid container justify="space-between" alignItems="center" style={{ marginBottom: "20px" }}>
        <Grid item>
          <Typography variant="h4" style={{ fontWeight: 700 }}>Job Applications</Typography>
          <Typography style={{ color: "#888" }}>
            {counts.total} total · {counts.applied} pending · {counts.shortlisted} shortlisted · {counts.accepted} accepted
          </Typography>
        </Grid>
        <Grid item>
          <Tooltip title="Filter & Sort">
            <IconButton
              onClick={() => setFilterOpen(true)}
              style={{ background: "#1565c0", color: "#fff", borderRadius: "10px" }}
            >
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>

      <Divider style={{ marginBottom: "20px" }} />

      {applications.length > 0 ? (
        applications.map((obj) => (
          <ApplicationTile key={obj._id} application={obj} getData={getData} />
        ))
      ) : (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#888" }}>
          <Typography variant="h6">No applications yet</Typography>
          <Typography style={{ marginTop: "8px" }}>Applications will appear here once candidates apply.</Typography>
        </div>
      )}

      {/* Filter Modal */}
      <Modal open={filterOpen} onClose={() => setFilterOpen(false)} className={classes.popupDialog}>
        <Paper style={{ padding: "40px", outline: "none", minWidth: "400px", borderRadius: "16px" }}>
          <Typography variant="h6" style={{ fontWeight: 700, marginBottom: "20px" }}>Filter & Sort</Typography>
          <Typography style={{ fontWeight: 600, marginBottom: "8px" }}>Status</Typography>
          <Grid container spacing={1} style={{ marginBottom: "16px" }}>
            {["applied", "shortlisted", "rejected"].map((s) => (
              <Grid item key={s}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={searchOptions.status[s]}
                      onChange={(e) => setSearchOptions({
                        ...searchOptions,
                        status: { ...searchOptions.status, [s]: e.target.checked },
                      })}
                    />
                  }
                  label={s.charAt(0).toUpperCase() + s.slice(1)}
                />
              </Grid>
            ))}
          </Grid>
          <Typography style={{ fontWeight: 600, marginBottom: "8px" }}>Sort By</Typography>
          {[
            { key: "jobApplicant.name", label: "Name" },
            { key: "dateOfApplication", label: "Date Applied" },
            { key: "jobApplicant.rating", label: "Rating" },
          ].map(({ key, label }) => (
            <Grid container alignItems="center" key={key} style={{ marginBottom: "6px" }}>
              <Grid item xs={5}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={searchOptions.sort[key].status}
                      onChange={(e) => setSearchOptions({
                        ...searchOptions,
                        sort: { ...searchOptions.sort, [key]: { ...searchOptions.sort[key], status: e.target.checked } },
                      })}
                    />
                  }
                  label={label}
                />
              </Grid>
              <Grid item>
                <IconButton
                  size="small"
                  disabled={!searchOptions.sort[key].status}
                  onClick={() => setSearchOptions({
                    ...searchOptions,
                    sort: { ...searchOptions.sort, [key]: { ...searchOptions.sort[key], desc: !searchOptions.sort[key].desc } },
                  })}
                >
                  {searchOptions.sort[key].desc ? <ArrowDownwardIcon /> : <ArrowUpwardIcon />}
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Button
            variant="contained" color="primary" fullWidth
            style={{ marginTop: "16px", borderRadius: "20px", textTransform: "none", fontWeight: 700 }}
            onClick={() => { getData(); setFilterOpen(false); }}
          >
            Apply Filters
          </Button>
        </Paper>
      </Modal>
    </div>
  );
};

export default JobApplications;
