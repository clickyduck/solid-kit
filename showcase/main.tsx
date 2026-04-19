import { render } from "solid-js/web";

import { ShowcaseApplication } from "./ShowcaseApplication";
import "./showcaseGlobalStyles.css";

const showcaseRootElement = document.getElementById("showcaseRoot");

if (!showcaseRootElement) {
  throw new Error("Showcase root element with identifier 'showcaseRoot' is missing from the document.");
}

render(() => {
  return <ShowcaseApplication />;
}, showcaseRootElement);
