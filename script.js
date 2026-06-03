let taskList = document.getElementById("taskList");

window.onload = function () {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach(task => {
        createTaskElement(task.text, task.status, task.priority);
    });

    updateCounter();
};

function addTask() {
    let taskInput = document.getElementById("taskInput");
    let priority = document.getElementById("priority")?.value || "Medium";

    let text = taskInput.value.trim();

    if (text === "") {
        alert("Please enter a task");
        return;
    }

    createTaskElement(text, "Pending", priority);

    saveTasks();
    updateCounter();

    taskInput.value = "";
}

function createTaskElement(text, status, priority) {
    let li = document.createElement("li");

    // reset + apply correct class
    li.classList.remove("low", "medium", "high");

    if (priority === "High") li.classList.add("high");
    else if (priority === "Medium") li.classList.add("medium");
    else li.classList.add("low");

    li.innerHTML = `
        <span>${text}</span>

        <select onchange="changeStatus(this)">
            <option ${status === "Pending" ? "selected" : ""}>Pending</option>
            <option ${status === "In Progress" ? "selected" : ""}>In Progress</option>
            <option ${status === "Completed" ? "selected" : ""}>Completed</option>
        </select>

        <button onclick="editTask(this)">Edit</button>
        <button onclick="deleteTask(this)">Delete</button>
    `;

    taskList.appendChild(li);
}

function editTask(btn) {
    let li = btn.parentElement;
    let span = li.querySelector("span");

    let newText = prompt("Edit task:", span.innerText);

    if (newText && newText.trim() !== "") {
        span.innerText = newText;
        saveTasks();
    }
}

function deleteTask(btn) {
    btn.parentElement.remove();
    saveTasks();
    updateCounter();
}

function changeStatus(select) {
    saveTasks();
    updateCounter();
}

function saveTasks() {
    let tasks = [];

    document.querySelectorAll("#taskList li").forEach(li => {

        let priority =
            li.classList.contains("high") ? "High" :
            li.classList.contains("medium") ? "Medium" :
            "Low";

        tasks.push({
            text: li.querySelector("span").innerText,
            status: li.querySelector("select").value,
            priority: priority
        });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateCounter() {
    let total = document.querySelectorAll("#taskList li").length;
    let completed = 0;
    let pending = 0;
    let progress = 0;

    document.querySelectorAll("#taskList li").forEach(li => {
        let status = li.querySelector("select").value;

        if (status === "Completed") completed++;
        else if (status === "Pending") pending++;
        else progress++;
    });

    document.getElementById("totalTasks").innerText = total;
    document.getElementById("completedTasks").innerText = completed;
    document.getElementById("pendingTasks").innerText = pending;
    document.getElementById("progressTasks").innerText = progress;

    let percent = total === 0 ? 0 : (completed / total) * 100;
    document.getElementById("progressBar").style.width = percent + "%";
}

function searchTasks() {
    let input = document.getElementById("searchInput").value.toLowerCase();

    document.querySelectorAll("#taskList li").forEach(li => {
        let text = li.querySelector("span").innerText.toLowerCase();
        li.style.display = text.includes(input) ? "" : "none";
    });
}

function filterTasks(type) {
    document.querySelectorAll("#taskList li").forEach(li => {
        let status = li.querySelector("select").value;
        li.style.display = (type === "all" || type === status) ? "" : "none";
    });
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
}