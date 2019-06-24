const fetchConfig = {
  credentials: "same-origin"
};

class InformativeModel {
  constructor(settings) {
    this.olMap = settings.map;
    this.url = settings.app.config.appConfig.proxy + settings.url;
    this.globalObserver = settings.app.globalObserver;
    this.app = settings.app;
    this.exportUrl = "http://localhost:55630/export/document";
  }

  flyTo(view, location, zoom) {
    const duration = 1500;
    view.animate({
      zoom: zoom,
      center: location,
      duration: duration
    });
  }

  print(chapter, callback) {
    const mapFile = this.app.config.activeMap + ".json";
    const documentFile =
      this.app.plugins.informative.options.document + ".json";

    const baseLayer = this.olMap
      .getLayers()
      .getArray()
      .find(
        l =>
          l.getProperties().layerInfo &&
          l.getProperties().layerInfo.layerType === "base" &&
          l.getVisible()
      );

    fetch(this.exportUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        data: JSON.stringify({
          mapFile: mapFile,
          documentFile: documentFile,
          chapterHeader: chapter.header,
          chapterHtml: chapter.html,
          baseMapId: baseLayer ? baseLayer.getProperties().name : ""
        })
      })
    })
      .then(rsp => {
        rsp.text().then(url => {
          callback(url);
        });
      })
      .catch(() => {
        callback("error");
      });
  }

  displayMap(visibleLayers, mapSettings) {
    var layers = this.olMap.getLayers().getArray();
    layers
      .filter(
        layer =>
          layer.getProperties()["layerInfo"] &&
          layer.getProperties()["layerInfo"]["layerType"] !== "base"
      )
      .forEach(layer => {
        if (
          visibleLayers.some(
            visibleLayer => visibleLayer === layer.getProperties()["name"]
          )
        ) {
          if (layer.layerType === "group") {
            this.globalObserver.publish("showLayer", layer);
          } else {
            layer.setVisible(true);
          }
        } else {
          if (layer.layerType === "group") {
            this.globalObserver.publish("hideLayer", layer);
          } else {
            layer.setVisible(false);
          }
        }
      });

    this.flyTo(this.olMap.getView(), mapSettings.center, mapSettings.zoom);
  }

  setParentChapter(chapter, parent) {
    chapter.parent = parent;
    if (chapter.chapters.length > 0) {
      chapter.chapters.forEach(child => {
        this.setParentChapter(child, chapter);
      });
    }
  }

  async load(callback) {
    let response;
    try {
      response = await fetch(this.url, fetchConfig);
      const text = await response.text();
      const data = await JSON.parse(text);

      data.chapters.forEach(chapter => {
        this.setParentChapter(chapter, undefined);
      });
      callback(data.chapters);
      this.chapters = data.chapters;
    } catch (err) {
      // TODO: replace "alert" with something that will use the Snackbar. But first, we must find a way to bind for Snackbar in AppModel.
      // this.globalObserver.publish(
      //   "alert",
      //   "Informative Plugin kunde inte ladda data korrekt. Om felet kvarstår var god och meddela administratören."
      // );
      console.error(
        `Couldn't load data for Informative plugin. Make sure that the URL to mapservice is correctly configured. Current value: ${response.url}`
      );
    }
  }
}

export default InformativeModel;
