/** Light or dark document theme: root `dark` class, localStorage persistence, and cross-tab sync. */
import type { Accessor } from "solid-js";
import { createSignal, onCleanup, onMount } from "solid-js";

export type DocumentColorSchemeName = "light" | "dark";

export const documentColorSchemeLocalStorageKey = "solid-kit-theme";

/**
 * Reads a persisted light or dark choice. Undefined when nothing valid is stored.
 */
export function readDocumentColorSchemeNameFromLocalStorage(): DocumentColorSchemeName | undefined {
  const storedValue = localStorage.getItem(documentColorSchemeLocalStorageKey);
  if (storedValue === "dark" || storedValue === "light") {
    return storedValue;
  }
  return undefined;
}

export function writeDocumentColorSchemeNameToLocalStorage(documentColorSchemeName: DocumentColorSchemeName): void {
  localStorage.setItem(documentColorSchemeLocalStorageKey, documentColorSchemeName);
}

export function applyDocumentColorSchemeNameToRootElement(documentColorSchemeName: DocumentColorSchemeName): void {
  if (documentColorSchemeName === "dark") {
    document.documentElement.classList.add("dark");
    return;
  }
  document.documentElement.classList.remove("dark");
}

export function persistDocumentColorSchemeName(documentColorSchemeName: DocumentColorSchemeName): void {
  writeDocumentColorSchemeNameToLocalStorage(documentColorSchemeName);
  applyDocumentColorSchemeNameToRootElement(documentColorSchemeName);
}

export function readCurrentDocumentColorSchemeNameFromRootElement(): DocumentColorSchemeName {
  if (document.documentElement.classList.contains("dark")) {
    return "dark";
  }
  return "light";
}

type DocumentColorSchemePreferenceSetter = (documentColorSchemeName: DocumentColorSchemeName) => void;

/**
 * Solid signal kept in sync with the root `dark` class and localStorage. Other tabs
 * updating the same key refresh the signal via the `storage` event.
 */
export function createDocumentColorSchemePreferenceSignal(): [Accessor<DocumentColorSchemeName>, DocumentColorSchemePreferenceSetter] {
  const [documentColorSchemeName, setDocumentColorSchemeNameInternal] = createSignal<DocumentColorSchemeName>(readCurrentDocumentColorSchemeNameFromRootElement());

  const setDocumentColorSchemeName: DocumentColorSchemePreferenceSetter = (nextDocumentColorSchemeName) => {
    persistDocumentColorSchemeName(nextDocumentColorSchemeName);
    setDocumentColorSchemeNameInternal(nextDocumentColorSchemeName);
  };

  onMount(() => {
    setDocumentColorSchemeNameInternal(readCurrentDocumentColorSchemeNameFromRootElement());
    const handleStorage = (event: StorageEvent): void => {
      if (event.key !== documentColorSchemeLocalStorageKey) {
        return;
      }
      if (event.newValue === "dark" || event.newValue === "light") {
        applyDocumentColorSchemeNameToRootElement(event.newValue);
        setDocumentColorSchemeNameInternal(event.newValue);
        return;
      }
      if (event.newValue === null) {
        const resolvedDocumentColorSchemeName: DocumentColorSchemeName = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        applyDocumentColorSchemeNameToRootElement(resolvedDocumentColorSchemeName);
        setDocumentColorSchemeNameInternal(resolvedDocumentColorSchemeName);
      }
    };
    window.addEventListener("storage", handleStorage);
    onCleanup(() => {
      window.removeEventListener("storage", handleStorage);
    });
  });

  return [documentColorSchemeName, setDocumentColorSchemeName];
}
