import React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { withSnackbar } from "notistack";
import AppBar from "@mui/material/AppBar";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import KirSearchView from "./KirSearchView";
import KirExportView from "./KirExportView";
import KirSearchResultsView from "./KirSearchResultsView";

const KirContainer = styled("div")(({ theme }) => ({
  margin: -10,
  display: "flex",
  flexDirection: "column",
  height: "100%",
}));

const StickyAppBar = styled(AppBar)(({ theme }) => ({
  top: -10,
}));

const TabPanel = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(1),
  width: "100%",
  height: "100%",
}));

class KirView extends React.PureComponent {
  state = {
    activeTab: 0,
  };

  static propTypes = {
    model: PropTypes.object.isRequired,
    app: PropTypes.object.isRequired,
    localObserver: PropTypes.object.isRequired,
  };

  static defaultProps = {};

  constructor(props) {
    super(props);

    this.model = this.props.model;
    this.localObserver = this.props.localObserver;
    this.globalObserver = this.props.app.globalObserver;
  }

  handleChangeTabs = (event, activeTab) => {
    this.setState({ activeTab });
  };

  handleTabsMounted = (ref) => {
    setTimeout(() => {
      ref !== null && ref.updateIndicator();
    }, 1);
  };

  render() {
    return (
      <KirContainer>
        <StickyAppBar position="sticky" color="default">
          <Tabs
            action={this.handleTabsMounted}
            onChange={this.handleChangeTabs}
            value={this.state.activeTab || 0}
            variant="fullWidth"
          >
            <Tab label="Sök" value={0} />
            <Tab label="Exportera" value={1} />
          </Tabs>
        </StickyAppBar>
        <TabPanel
          value={0}
          style={
            this.state.activeTab !== 0
              ? {
                  visibility: "hidden",
                  height: 0,
                  overflow: "hidden",
                  padding: 0,
                }
              : {}
          }
        >
          <KirSearchView
            model={this.props.model}
            app={this.props.app}
            localObserver={this.localObserver}
          />
          <KirSearchResultsView
            model={this.props.model}
            app={this.props.app}
            localObserver={this.localObserver}
          />
        </TabPanel>
        <TabPanel
          value={1}
          style={
            this.state.activeTab !== 1
              ? {
                  visibility: "hidden",
                  height: 0,
                  overflow: "hidden",
                  padding: 0,
                }
              : {}
          }
        >
          <KirExportView
            model={this.props.model}
            app={this.props.app}
            localObserver={this.localObserver}
          />
        </TabPanel>
      </KirContainer>
    );
  }
}

export default withSnackbar(KirView);
