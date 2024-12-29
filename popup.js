let timer;
let timeLeft = 25 * 60;

document.getElementById("start-timer").addEventListener("click", () => {
  timer = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimerDisplay();
    } else {
      clearInterval(timer);
      alert("Time's up! Take a break.");
    }
  }, 1000);
});

document.getElementById("stop-timer").addEventListener("click", () => {
  clearInterval(timer);
});

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById("timer-display").textContent = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}


// Task Management
const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function displayTasks() {
  const taskList = document.getElementById("tasks");
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = task;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Task finished";
    removeBtn.onclick = () => {
      tasks.splice(index, 1);
      saveTasks();
      displayTasks();
    };
    li.style.display = "flex";
    li.style.alignItems = "center"; // Align items vertically
    li.style.gap = "10px"; // Add space between items
    li.appendChild(removeBtn);
    taskList.appendChild(li);
  });
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

document.getElementById("add-task").addEventListener("click", () => {
  const newTask = prompt("Enter a new task:");
  if (newTask) {
    tasks.push(newTask);
    saveTasks();
    displayTasks();
  }
});

displayTasks();

// Notes
document.getElementById("save-note").addEventListener("click", () => {
  const note = document.getElementById("note-input").value;
  localStorage.setItem("note", note);
  alert("Note saved!");
});

// Load saved note
document.getElementById("note-input").value = localStorage.getItem("note") || "";



// Sync timer display with background
function syncWithBackground() {
  chrome.storage.local.get("timeLeft", (data) => {
    timeLeft = data.timeLeft ?? 25 * 60;
    updateTimerDisplay();
  });
}

document.getElementById("start-timer").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "startTimer", timeLeft });
});

document.getElementById("stop-timer").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "stopTimer" });
  timeLeft = 25 * 60;
  updateTimerDisplay();
});

// Keep timer display updated
setInterval(syncWithBackground, 1000);

// Initial display sync
syncWithBackground();