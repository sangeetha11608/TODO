const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const clearAllBtn = document.getElementById('clear-all-btn');

document.addEventListener("DOMContentLoaded", loadTasks);

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => {
    if(e.key === 'Enter') addTask();
});

clearAllBtn.addEventListener('click', () => {
    localStorage.removeItem("tasks");
    taskList.innerHTML = "";
});

function addTask() {
    const text = taskInput.value.trim();
    if (!text) return;

    const priorityInput = prompt("Enter priority: high / medium / low", "low");
    const priority = ["high","medium","low"].includes(priorityInput?.toLowerCase())
        ? priorityInput.toLowerCase()
        : "low";

    const dueDate = prompt("Enter due date (YYYY-MM-DD)");

    createTaskCard(text, priority, false, dueDate);
    saveTasks();
    taskInput.value = "";
}

function createTaskCard(text, priority="low", completed=false, dueDate=null) {
    const taskCard = document.createElement('div');
    taskCard.classList.add('task-card', priority);
    if(completed) taskCard.classList.add('completed');

    const taskTitle = document.createElement('div');
    taskTitle.classList.add('task-title');
    taskTitle.textContent = text;

    const dateLabel = document.createElement('div');
    dateLabel.classList.add('task-date');

    if(dueDate){
        dateLabel.textContent = "Due: " + dueDate;

        const today = new Date().toISOString().split("T")[0];
        if(!completed && dueDate < today){
            taskCard.classList.add("overdue");
        }
    }

    const btnContainer = document.createElement('div');
    btnContainer.classList.add('task-buttons');

    const completeBtn = document.createElement('button');
    completeBtn.textContent = "Done";
    completeBtn.classList.add('add-btn');
    completeBtn.onclick = () => {
        taskCard.classList.toggle('completed');
        taskCard.classList.remove("overdue");

        if(taskCard.classList.contains("completed")){
            taskList.appendChild(taskCard);
        }

        saveTasks();
    };

    const editBtn = document.createElement('button');
    editBtn.textContent = "Edit";
    editBtn.classList.add('edit-btn');
    editBtn.onclick = () => {
        const newText = prompt("Edit task:", taskTitle.textContent);
        if(newText){
            taskTitle.textContent = newText;
            saveTasks();
        }
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add('delete-btn');
    deleteBtn.onclick = () => {
        taskCard.remove();
        saveTasks();
    };

    btnContainer.appendChild(completeBtn);
    btnContainer.appendChild(editBtn);
    btnContainer.appendChild(deleteBtn);

    taskCard.appendChild(taskTitle);
    if(dueDate) taskCard.appendChild(dateLabel);
    taskCard.appendChild(btnContainer);

    taskList.appendChild(taskCard);
}

/* STORAGE */

function saveTasks() {
    const tasks = [];
    document.querySelectorAll(".task-card").forEach(card => {
        tasks.push({
            text: card.querySelector(".task-title").textContent,
            priority: card.classList.contains("high") ? "high"
                     : card.classList.contains("medium") ? "medium"
                     : "low",
            completed: card.classList.contains("completed"),
            dueDate: card.querySelector(".task-date")?.textContent.replace("Due: ","") || null
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task =>
        createTaskCard(task.text, task.priority, task.completed, task.dueDate)
    );
}

/* Feedback */
const feedbackForm = document.getElementById('feedback-form');
const feedbackMsg = document.getElementById('feedback-msg');

feedbackForm.addEventListener('submit', function(e){
    e.preventDefault();
    feedbackMsg.textContent = "Feedback Sent Successfully!";
    feedbackForm.reset();
    setTimeout(() => feedbackMsg.textContent = "", 4000);
});