const STORAGE_DEFAULTS = {
  notificationsEnabled: true,
  version: "new",
  meowPushEnabled: false,
  meowNickname: "",
  meowLinkMode: "none",
  accounts: [],
  activeUsername: "",
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
