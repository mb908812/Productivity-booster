chrome.alarms.create("focus-reminder", { periodInMinutes: 25 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "focus-reminder") {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icon.png",
      title: "Stay Focused!",
      message: "Time to start a new focus session."
    });
  }
});

function updateExtensionTitle(remainingTime) {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  const title = `Time Left: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  chrome.action.setTitle({ title });
}


let timer = null;
let endTime = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startTimer") {
    endTime = Date.now() + message.timeLeft * 1000; // Calculate when the timer ends
    timer = setInterval(() => {
      const remainingTime = Math.max(0, Math.floor((endTime - Date.now()) / 1000));
      if (remainingTime === 0) {
        clearInterval(timer);
        timer = null;
        chrome.storage.local.set({ timeLeft: 0 });
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icon.png",
          title: "Time's up!",
          message: "Take a break.",
        });
        timeLeft = 25 * 60;
      } else {
        chrome.storage.local.set({ timeLeft: remainingTime });
        updateExtensionTitle(remainingTime);
      }
    }, 1000);
  } else if (message.action === "stopTimer") {
    clearInterval(timer);
    timer = null;
    chrome.storage.local.set({ timeLeft: 25 * 60});
  }
  sendResponse();
});