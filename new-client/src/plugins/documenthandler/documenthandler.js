import React from "react";
import PropTypes from "prop-types";
import DocumentWindowBase from "./documentWindow/DocumentWindowBase";
import MenuBook from "@material-ui/icons/MenuBook";
import DocumentHandlerModel from "./DocumentHandlerModel";
import PanelMenuContainerView from "./panelMenu/PanelMenuContainerView";
import Observer from "react-event-observer";
import MapViewModel from "./MapViewModel";
import ContentComponentFactory from "./utils/ContentComponentFactory";
import { withTheme } from "@material-ui/core/styles";

class DocumentHandler extends React.PureComponent {
  static propTypes = {
    app: PropTypes.object.isRequired,
    map: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
  };

  state = {
    model: null,
  };

  constructor(props) {
    super(props);
    this.localObserver = Observer();
    console.log(this.props, "pros");
    this.contentComponentFactory = new ContentComponentFactory({
      localObserver: this.localObserver,
      theme: this.props.theme,
    });
    this.mapViewModel = new MapViewModel({
      localObserver: this.localObserver,
      globalObserver: props.app.globalObserver,
      map: props.map,
    });

    this.props.searchInterface.getSearchMethods = new Promise((resolve) => {
      new DocumentHandlerModel({
        localObserver: this.localObserver,
        app: props.app,
        map: props.map,
        menu: props.options.menuConfig.menu,
        resolveSearchInterface: resolve,
      })
        .init()
        .then((loadedDocumentModel) => {
          console.log(loadedDocumentModel, "loadedDocumentModel");
          this.setState({ model: loadedDocumentModel });
        });

      this.addDrawerToggleButton();
    });
  }

  dynamicallyImportOpenSans = () => {
    const { dynamicImportUrls } = this.props.options;
    return (
      <link
        rel="stylesheet"
        type="text/css"
        href={dynamicImportUrls.openSans}
      />
    );
  };

  dynamicallyImportIconFonts = () => {
    const { dynamicImportUrls } = this.props.options;
    return <link rel="stylesheet" href={dynamicImportUrls.iconFonts} />;
  };

  renderDrawerContent = () => {
    const { app, model, options } = this.props;
    return (
      <PanelMenuContainerView
        app={app}
        model={model}
        options={options}
        localObserver={this.localObserver}
      ></PanelMenuContainerView>
    );
  };

  addDrawerToggleButton = () => {
    const { app } = this.props;
    app.globalObserver.publish("core.addDrawerToggleButton", {
      value: "menu",
      ButtonIcon: MenuBook,
      caption: "Översiktsplan",
      order: 100,
      renderDrawerContent: this.renderDrawerContent,
    });
  };

  render() {
    return (
      <>
        {this.dynamicallyImportOpenSans()}
        {this.dynamicallyImportIconFonts()}
        <DocumentWindowBase
          {...this.props}
          contentComponentFactory={this.contentComponentFactory}
          model={this.state.model}
          localObserver={this.localObserver}
        ></DocumentWindowBase>
      </>
    );
  }
}
export default withTheme(DocumentHandler);
