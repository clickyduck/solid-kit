import { render } from "solid-js/web";

import { ShowcaseApplication } from "./ShowcaseApplication";
import "./showcaseGlobalStyles.css";

const showcaseRootElement = document.getElementById("showcaseRoot");

if (!showcaseRootElement) {
  throw new Error("Showcase root element with identifier 'showcaseRoot' is missing from the document.");
}

const focusShowcaseNavigationSearch = (): void => {
  const inputElement = window.document.getElementById("showcase-navigation-search");
  if (!inputElement) {
    return;
  }
  if (!(inputElement instanceof HTMLInputElement)) {
    return;
  }
  inputElement.focus();
  inputElement.select();
};

window.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key !== "/") {
    return;
  }
  const activeElement = window.document.activeElement;
  if (activeElement && (activeElement instanceof HTMLInputElement || activeElement instanceof HTMLTextAreaElement)) {
    return;
  }
  event.preventDefault();
  focusShowcaseNavigationSearch();
});

render(() => {
  return <ShowcaseApplication />;
}, showcaseRootElement);
