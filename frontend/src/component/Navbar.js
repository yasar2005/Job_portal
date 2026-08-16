import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import WorkIcon from "@material-ui/icons/Work";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import { useHistory } from "react-router-dom";
import isAuth, { userType } from "../lib/isAuth";

const useStyles = makeStyles((theme) => ({
  appBar: {
    background: "linear-gradient(90deg, #1a237e 0%, #1565c0 100%)",
    boxShadow: "0 2px 12px rgba(26,35,126,0.3)",
  },
  brand: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    fontWeight: 800,
    letterSpacing: "0.5px",
  },
  navBtn: {
    borderRadius: "20px",
    padding: "6px 16px",
    fontWeight: 600,
    textTransform: "none",
    fontSize: "0.9rem",
    "&:hover": {
      background: "rgba(255,255,255,0.15)",
    },
  },
  activeBtn: {
    background: "rgba(255,255,255,0.2)",
    borderRadius: "20px",
    padding: "6px 16px",
    fontWeight: 600,
    textTransform: "none",
    fontSize: "0.9rem",
  },
  signupBtn: {
    borderRadius: "20px",
    padding: "6px 18px",
    fontWeight: 700,
    textTransform: "none",
    background: "#fff",
    color: "#1a237e",
    marginLeft: "8px",
    "&:hover": { background: "#e3f2fd" },
  },
}));

const Navbar = ({ darkMode, setDarkMode }) => {
  const classes = useStyles();
  const history = useHistory();

  const go = (path) => history.push(path);
  const current = window.location.pathname;

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Typography
          variant="h6"
          className={classes.brand}
          onClick={() => go("/")}
        >
          <WorkIcon />
          JobPortal
        </Typography>

        {isAuth() ? (
          userType() === "recruiter" ? (
            <>
              <Button color="inherit" className={current === "/home" ? classes.activeBtn : classes.navBtn} onClick={() => go("/home")}>Dashboard</Button>
              <Button color="inherit" className={current === "/addjob" ? classes.activeBtn : classes.navBtn} onClick={() => go("/addjob")}>Post Job</Button>
              <Button color="inherit" className={current === "/myjobs" ? classes.activeBtn : classes.navBtn} onClick={() => go("/myjobs")}>My Jobs</Button>
              <Button color="inherit" className={current === "/employees" ? classes.activeBtn : classes.navBtn} onClick={() => go("/employees")}>Employees</Button>
              <Button color="inherit" className={current === "/profile" ? classes.activeBtn : classes.navBtn} onClick={() => go("/profile")}>Profile</Button>
              <Button color="inherit" className={classes.navBtn} onClick={() => go("/logout")}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" className={current === "/home" ? classes.activeBtn : classes.navBtn} onClick={() => go("/home")}>Jobs</Button>
              <Button color="inherit" className={current === "/applications" ? classes.activeBtn : classes.navBtn} onClick={() => go("/applications")}>My Applications</Button>
              <Button color="inherit" className={current === "/saved" ? classes.activeBtn : classes.navBtn} onClick={() => go("/saved")}>Saved Jobs</Button>
              <Button color="inherit" className={current === "/profile" ? classes.activeBtn : classes.navBtn} onClick={() => go("/profile")}>Profile</Button>
              <Button color="inherit" className={classes.navBtn} onClick={() => go("/logout")}>Logout</Button>
            </>
          )
        ) : (
          <>
            <Button color="inherit" className={classes.navBtn} onClick={() => go("/login")}>Applicant Login</Button>
            <Button color="inherit" className={classes.navBtn} onClick={() => go("/recruiter/login")}>Recruiter Login</Button>
            <Button className={classes.signupBtn} onClick={() => go("/signup")}>Sign Up Free</Button>
          </>
        )}

        <Tooltip title={darkMode ? "Light Mode" : "Dark Mode"}>
          <IconButton color="inherit" onClick={() => setDarkMode && setDarkMode(!darkMode)} style={{ marginLeft: "8px" }}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
