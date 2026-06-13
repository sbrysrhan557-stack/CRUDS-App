// selectors
const taskForm = document.querySelector("#taskForm");
const titleInput = document.querySelector("#title");
const descriptionInput = document.querySelector("#description");
const taskStatusInput = document.querySelector("#taskStatus");
const searchInput = document.querySelector("#search");
const addTaskBtn = document.querySelector("#addTask");
const cancelTaskBtn = document.querySelector("#cancelTask");
const errorMessage = document.querySelector("#errorMessage");
const cancelDelete = document.querySelector("#cancelDelete");
const confirmDelete = document.querySelector("#confirmDelete");
const statusFilter = document.querySelector("#statusFilter");
let taskItems = JSON.parse(localStorage.getItem("task")) || [];
let taskId = null;
let editingTaskId = null;

// functions
function addTask(e) {
    e.preventDefault();
    if (!validateForm()) return;

    if (editingTaskId) {
        const task = taskItems.find((task) => task.id === +editingTaskId);

        task.title = titleInput.value;
        task.description = descriptionInput.value;
        task.status = taskStatusInput.value;

        editingTaskId = null;

        addTaskBtn.textContent = "Add Task";
        addTaskBtn.style.backgroundColor = "#052F4A";

        cancelTaskBtn.classList.add("hidden");

        showNotification("success", "Task updated successfully");
    } else {
        const task = {
            id: Date.now(),
            title: titleInput.value,
            description: descriptionInput.value,
            status: taskStatusInput.value,
        };

        taskItems.push(task);
        showNotification("success", "Task added successfully");
    }
    renderTasks();
    resetForm();
    save();
}

// validation form
function validateForm() {
    if (titleInput.value.trim() === "") {
        errorMessage.textContent = "Title is required";
        errorMessage.classList.remove("hidden");
        return false;
    } else if (descriptionInput.value.trim() === "") {
        errorMessage.textContent = "Description is required";
        errorMessage.classList.remove("hidden");
        return false;
    } else {
        errorMessage.classList.add("hidden");
        errorMessage.textContent = "";
        return true;
    }
}

// Task Card
function taskCard(task) {
    return `<div class="task-card p-4 rounded-2xl border border-zinc-300 shadow-md flex items-start gap-2 relative">
                    <div class="dragIcon">
                        <i class="hgi hgi-stroke hgi-rounded hgi-drag-drop-vertical text-xl"></i>
                    </div>
                    <div class="task_details overflow-scroll">
                        <h2 class="text-lg font-medium mb-1">${task.title}</h2>
                        <p class="text-sm text-zinc-400 max-w-35">${task.description}</p>
                        <span class="inline-block ${getStatusClass(task.status)} px-2 py-1 rounded-full text-sm mt-2">${task.status}</span>
                    </div>
                    <div class="task-action flex items-center gap-2 shrink-0 flex-1 justify-end">
                        <div onclick="deleteTask('${task.id}')" class="delete w-6 h-6 flex items-center justify-center rounded-full bg-red-200 text-red-500 cursor-pointer">
                            <i class="hgi hgi-stroke hgi-rounded hgi-delete-02"></i>
                        </div>
                        <div onclick="updateTask('${task.id}')" class="edit w-6 h-6 flex items-center justify-center rounded-full bg-blue-200 text-blue-500 cursor-pointer">
                            <i class="hgi hgi-stroke hgi-rounded hgi-edit-01"></i>
                        </div>
                    </div>
                </div>`;
}

// render tasks
function renderTasks() {
    let html = "";
    document.querySelector(".tasks-container").innerHTML = "";
    taskItems.forEach((task) => (html += taskCard(task)));
    document.querySelector(".tasks-container").innerHTML = html;
}
renderTasks(); // load tasks from local storage
// reset form
function resetForm() {
    titleInput.value = "";
    descriptionInput.value = "";
    taskStatusInput.value = "Not Started";
    cancelTaskBtn.classList.add("hidden");
}

// notification task
function showNotification(type, message) {
    switch (type) {
        case "success":
            return Toastify({
                text: message,
                duration: 3000,
                destination: "https://github.com/apvarun/toastify-js",
                newWindow: true,
                gravity: "top", // `top` or `bottom`
                position: "center", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: "green",
                    borderRadius: "30px",
                },
            }).showToast();
        case "error":
            return Toastify({
                text: message,
                duration: 3000,
                destination: "https://github.com/apvarun/toastify-js",
                newWindow: true,
                gravity: "top", // `top` or `bottom`
                position: "center", // `left`, `center` or `right`
                stopOnFocus: true, // Prevents dismissing of toast on hover
                style: {
                    background: "red",
                    borderRadius: "30px",
                },
            }).showToast();
    }
}

// save tasks
function save() {
    localStorage.setItem("task", JSON.stringify(taskItems));
}

function deleteTask(id) {
    taskId = id;
    showPopupAction();
}

// show popup action
function showPopupAction() {
    document
        .querySelector(".popup-action")
        .classList.remove("opacity-0", "pointer-events-none");
    document
        .querySelector(".popup-container")
        .classList.remove("opacity-0", "translate-y-6");
}
// hidden popup action
function hiddenPopupAction() {
    document
        .querySelector(".popup-action")
        .classList.add("opacity-0", "pointer-events-none");
    document
        .querySelector(".popup-container")
        .classList.add("opacity-0", "translate-y-6");
    taskId = null;
}

// confirm delete task
function confirmDeleteTask() {
    taskItems = taskItems.filter((task) => task.id !== +taskId);
    console.log(taskItems, taskId);
    renderTasks();
    save();
    showNotification("success", "Task deleted successfully");
    hiddenPopupAction();

    if (taskItems.length === 0) {
        checkEmptyTasks();
    }
}
// events

taskForm.addEventListener("submit", addTask);
cancelDelete.addEventListener("click", hiddenPopupAction);
confirmDelete.addEventListener("click", confirmDeleteTask);

// check empty tasks
function checkEmptyTasks() {
    document.querySelector(".tasks-container").innerHTML =
        `<div class="mx-auto my-10 flex flex-col items-center justify-center text-center w-full">
    <i class="fa-regular fa-circle-xmark text-4xl text-zinc-400 mb-2"></i>
    <p class="text-lg text-zinc-400 bold">No tasks found.</p>
    </div>`;
}

if (taskItems.length === 0) {
    checkEmptyTasks();
}

// Update task
function updateTask(id) {
    const task = taskItems.find((task) => task.id === +id);

    editingTaskId = id;

    titleInput.value = task.title;
    descriptionInput.value = task.description;
    taskStatusInput.value = task.status;

    addTaskBtn.textContent = "Update Task";
    addTaskBtn.style.backgroundColor = "orange";
    cancelTaskBtn.classList.remove("hidden");
}

// Cancel update task
cancelTaskBtn.addEventListener("click", function cancelUpdateTask() {
    resetForm();
    editingTaskId = null;

    addTaskBtn.textContent = "Add Task";
    addTaskBtn.style.backgroundColor = "#052F4A";
    cancelTaskBtn.classList.add("hidden");
});

// Search task
searchInput.addEventListener("input", function searchTask() {
    const searchTerm = searchInput.value.toLowerCase();

    const filteredTasks = taskItems.filter(
        (task) =>
            task.title.toLowerCase().includes(searchTerm) ||
            task.description.toLowerCase().includes(searchTerm),
    );

    // If no tasks match the search term, display a message
    if (filteredTasks.length === 0) {
        checkEmptyTasks();
        return;
    }

    let html = "";
    document.querySelector(".tasks-container").innerHTML = "";
    filteredTasks.forEach((task) => (html += taskCard(task)));
    document.querySelector(".tasks-container").innerHTML = html;
});

// Filter by status
statusFilter.addEventListener("change", function filterByStatus() {
    const status = statusFilter.value;
    let filteredTasks = [];

    if (status === "All") {
        filteredTasks = taskItems;
    } else if (status === "Not Started") {
        filteredTasks = taskItems.filter((task) => task.status === "Not Started");
    } else if (status === "In Progress") {
        filteredTasks = taskItems.filter((task) => task.status === "In Progress");
    } else if (status === "Done") {
        filteredTasks = taskItems.filter((task) => task.status === "Done");
    }

    if (filteredTasks.length === 0) {
        checkEmptyTasks();
        return;
    }

    let html = "";
    document.querySelector(".tasks-container").innerHTML = "";
    filteredTasks.forEach((task) => (html += taskCard(task)));
    document.querySelector(".tasks-container").innerHTML = html;
});

// get status class Color
function getStatusClass(status) {
    switch (status) {
        case "Done":
            return "bg-green-200 text-green-600";

        case "In Progress":
            return "bg-yellow-200 text-yellow-600";

        default:
            return "bg-red-200 text-red-600";
    }
}
