const STORAGE_DEFAULTS = {
  notificationsEnabled: true,
  version: "new",
  meowPushEnabled: false,
  meowNickname: "",
  meowLinkMode: "none",
  accounts: [],
  activeUsername: "",
  lastSummaryCache: null, // 缓存最近一次弹窗摘要，提升首屏速度
  quickBoardsEnabled: false,
  quickBoards: [],
  themeMode: "auto",
};

function sendMessagePromise(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      const err = chrome.runtime.lastError;
      if (err) {
        reject(new Error(err.message || "sendMessage failed"));
        return;
      }
      resolve(response);
    });
  });
}

function normalizeThemeMode(mode) {
  if (mode === "dark" || mode === "light") return mode;
  return "auto";
}

function getSystemThemeMode() {
  if (typeof window === "undefined" || !window.matchMedia) return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyThemeMode(mode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (!root) return;
  const normalized = normalizeThemeMode(mode);
  const resolved = normalized === "auto" ? getSystemThemeMode() : normalized;
  root.dataset.theme = resolved;
}

function watchSystemTheme(onChange) {
  if (typeof window === "undefined" || !window.matchMedia) return () => {};
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = () => onChange(media.matches ? "dark" : "light");
  if (media.addEventListener) {
    media.addEventListener("change", handler);
  } else if (media.addListener) {
    media.addListener(handler);
  }
  return () => {
    if (media.removeEventListener) {
      media.removeEventListener("change", handler);
    } else if (media.removeListener) {
      media.removeListener(handler);
    }
  };
}
