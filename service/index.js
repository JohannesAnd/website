import fs from "fs";
import express from "express";
import React from "react";
import { renderToString } from "react-dom/server";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";

import routes from "../client/routes";
import App from "../client/App";

const template = fs.readFileSync("./service/index.html", { encoding: "utf-8" });

const app = express();

routes.forEach(({ path, name }) => {
  app.get(path, (req, res, next) => {
    const sheet = new ServerStyleSheet();
    const app = renderToString(
      <StyleSheetManager sheet={sheet.instance}>
        <App />
      </StyleSheetManager>
    );
    const styleTags = sheet.getStyleTags();
    const renderedTemplate = template
      .replace("TITLE", name)
      .replace("APP", app)
      .replace("STYLE_TAGS", styleTags);

    res.send(renderedTemplate);
  });
});

app.listen(3000, () => {
  console.log("Listening");
});
