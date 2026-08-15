import { Grid, Typography, Button, makeStyles, Paper } from "@material-ui/core";
import WorkIcon from "@material-ui/icons/Work";
import PeopleIcon from "@material-ui/icons/People";
import TrendingUpIcon from "@material-ui/icons/TrendingUp";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  hero: {
    background: "linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #1565c0 100%)",
    minHeight: "100vh",
    color: "#fff",
    padding: "60px 20px 40px",
  },
  heroTitle: {
    fontWeight: 800,
    fontSize: "3.5rem",
    lineHeight: 1.2,
    [theme.breakpoints.down("sm")]: { fontSize: "2.2rem" },
  },
  heroSub: {
    fontSize: "1.2rem",
    opacity: 0.85,
    marginTop: "16px",
    maxWidth: "560px",
    textAlign: "center",
  },
  ctaBtn: {
    marginTop: "32px",
    marginRight: "12px",
    padding: "12px 36px",
    borderRadius: "30px",
    fontWeight: 700,
    fontSize: "1rem",
    background: "#fff",
    color: "#1a237e",
    "&:hover": { background: "#e3f2fd" },
  },
  ctaBtnOutline: {
    marginTop: "32px",
    padding: "12px 36px",
    borderRadius: "30px",
    fontWeight: 700,
    fontSize: "1rem",
    border: "2px solid #fff",
    color: "#fff",
    "&:hover": { background: "rgba(255,255,255,0.1)" },
  },
  statCard: {
    padding: "28px 20px",
    textAlign: "center",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.12)",
    backdropFilter: "blur(8px)",
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.2)",
  },
  statNum: {
    fontWeight: 800,
    fontSize: "2.4rem",
  },
  statLabel: {
    opacity: 0.8,
    marginTop: "4px",
  },
  featureSection: {
    padding: "60px 20px",
    background: "#f5f7ff",
  },
  featureCard: {
    padding: "32px 24px",
    borderRadius: "16px",
    textAlign: "center",
    height: "100%",
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
      transform: "translateY(-6px)",
      boxShadow: "0 12px 32px rgba(26,35,126,0.15)",
    },
  },
  featureIcon: {
    fontSize: "3rem",
    color: "#1565c0",
    marginBottom: "16px",
  },
  errorContainer: {
    minHeight: "80vh",
    textAlign: "center",
  },
}));

const stats = [
  { icon: <WorkIcon style={{ fontSize: "2rem" }} />, num: "10,000+", label: "Jobs Posted" },
  { icon: <PeopleIcon style={{ fontSize: "2rem" }} />, num: "50,000+", label: "Job Seekers" },
  { icon: <TrendingUpIcon style={{ fontSize: "2rem" }} />, num: "5,000+", label: "Companies Hiring" },
];

const features = [
  {
    icon: <WorkIcon style={{ fontSize: "3rem", color: "#1565c0" }} />,
    title: "Find Your Dream Job",
    desc: "Browse thousands of listings across all industries. Filter by salary, type, and skills.",
  },
  {
    icon: <PeopleIcon style={{ fontSize: "3rem", color: "#1565c0" }} />,
    title: "Hire Top Talent",
    desc: "Post jobs, review applications, and connect with qualified candidates instantly.",
  },
  {
    icon: <TrendingUpIcon style={{ fontSize: "3rem", color: "#1565c0" }} />,
    title: "Grow Your Career",
    desc: "Track applications, get rated, and build your professional profile.",
  },
];

const Welcome = () => {
  const classes = useStyles();
  const history = useHistory();

  return (
    <>
      {/* Hero */}
      <Grid
        container
        direction="column"
        alignItems="center"
        justify="center"
        className={classes.hero}
        spacing={2}
      >
        <Grid item>
          <Typography className={classes.heroTitle} align="center">
            Your Next Career Move <br /> Starts Here
          </Typography>
        </Grid>
        <Grid item>
          <Typography className={classes.heroSub} align="center">
            Connect with top employers, discover exciting opportunities, and take
            control of your professional journey.
          </Typography>
        </Grid>
        <Grid item>
          <Button className={classes.ctaBtn} onClick={() => history.push("/signup")}>
            Get Started Free
          </Button>
          <Button className={classes.ctaBtnOutline} variant="outlined" onClick={() => history.push("/login")}>
            Sign In
          </Button>
        </Grid>

        {/* Stats Row */}
        <Grid container item justify="center" spacing={3} style={{ marginTop: "48px", maxWidth: "800px" }}>
          {stats.map((s, i) => (
            <Grid item xs={12} sm={4} key={i}>
              <div className={classes.statCard}>
                {s.icon}
                <Typography className={classes.statNum}>{s.num}</Typography>
                <Typography className={classes.statLabel}>{s.label}</Typography>
              </div>
            </Grid>
          ))}
        </Grid>
      </Grid>

      {/* Features */}
      <Grid container justify="center" className={classes.featureSection} spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h4" align="center" style={{ fontWeight: 700, color: "#1a237e", marginBottom: "8px" }}>
            Why Choose JobPortal?
          </Typography>
          <Typography align="center" style={{ color: "#555", marginBottom: "32px" }}>
            Everything you need to land your next opportunity
          </Typography>
        </Grid>
        {features.map((f, i) => (
          <Grid item xs={12} sm={6} md={4} key={i} style={{ maxWidth: "340px" }}>
            <Paper elevation={2} className={classes.featureCard}>
              {f.icon}
              <Typography variant="h6" style={{ fontWeight: 700, marginBottom: "8px" }}>
                {f.title}
              </Typography>
              <Typography style={{ color: "#666" }}>{f.desc}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export const ErrorPage = () => {
  const classes = useStyles();
  const history = useHistory();
  return (
    <Grid container direction="column" alignItems="center" justify="center" className={classes.errorContainer}>
      <Typography variant="h1" style={{ fontWeight: 800, color: "#1a237e" }}>404</Typography>
      <Typography variant="h5" style={{ color: "#555", margin: "16px 0" }}>Oops! Page not found.</Typography>
      <Button variant="contained" color="primary" style={{ borderRadius: "30px", padding: "10px 32px" }} onClick={() => history.push("/")}>
        Go Home
      </Button>
    </Grid>
  );
};

export default Welcome;
