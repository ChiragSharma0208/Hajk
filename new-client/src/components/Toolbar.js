import React, { Component } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Divider,
  IconButton
} from "@material-ui/core";
import { ChevronLeft, ChevronRight, Menu, Close } from "@material-ui/icons";
import "./Toolbar.css"; // TODO: Move styles to JSS and remove the CSS file

const drawerWidth = 240;

const styles = theme => ({
  drawerPaper: {
    top: "64px",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: 0
      //duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: "hidden",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: 0
      //duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing.unit * 7,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing.unit * 9
    }
  },
  button: {
    marginBottom: "5px"
  }
});

class Toolbar extends Component {
  state = { open: false };

  toggleTool = () => {
    this.setState({ open: false });
  };

  renderTools() {
    //<tool.component key={i} tool={tool} toolbar={this} onClick={this.toggleTool}/>
    return this.props.tools.map((tool, i) => {
      return (
        <ListItem
          button
          onClick={() => {
            if (tool.instance) {
              console.log("Toogle", tool.instance);
              tool.instance.toggle();
            }
          }}
          selected={() => {
            if (tool.instance) {
              return tool.instance.isToolActive();
            } else {
              return false;
            }
          }}
        >
          <ListItemIcon>
            <tool.component
              key={i}
              tool={tool}
              toolbar={this}
              onClick={this.toggleTool}
            />
          </ListItemIcon>
          <ListItemText primary={tool.text || "Verktyg X"} />
        </ListItem>
      );
    });
  }

  toggle = () => {
    this.setState({ open: !this.state.open });
  };

  toggleToolbar = () => {
    this.setState({
      toolbarVisible: !this.state.toolbarVisible
    });
  };

  renderDrawer() {
    const { classes } = this.props;
    const icon = this.state.open === true ? <ChevronLeft /> : <ChevronRight />;
    return this.state.toolbarVisible
      ? createPortal(
          <Drawer
            variant="permanent"
            classes={{
              paper: classNames(
                classes.drawerPaper,
                !this.state.open && classes.drawerPaperClose
              )
            }}
            open={this.state.open}
          >
            <ListItem button onClick={this.toggleToolbar}>
              <ListItemIcon>
                <Close />
              </ListItemIcon>
              <ListItemText primary="Stäng" />
            </ListItem>
            <ListItem button onClick={this.toggle}>
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText primary="Minimera" />
            </ListItem>
            <Divider />
            {this.renderTools()}
          </Drawer>,
          document.getElementById("map")
        )
      : null;
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <IconButton
          className={classes.menuButton}
          color="inherit"
          aria-label="Menu"
          onClick={this.toggleToolbar}
        >
          <Menu />
        </IconButton>
        {this.renderDrawer()}
      </div>
    );
  }
}

Toolbar.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Toolbar);
