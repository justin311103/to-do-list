const STORAGE_KEY = 'todoTasks';
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const taskCount = document.getElementById('task-count');
const clearCompletedButton = document.getElementById('clear-completed');

let tasks = [];

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadTasks() {
  const raw = localStorage.getItem(STORAGE_KEY);
  tasks = raw ? JSON.parse(raw) : [];
}

function updateTaskCount() {
  const activeCount = tasks.filter((task) => !task.completed).length;
  taskCount.textContent = `${activeCount} 個待辦`;
}

function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = 'todo-item';
  li.dataset.id = task.id;

  const label = document.createElement('label');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.addEventListener('change', () => toggleTask(task.id));

  const text = document.createElement('span');
  text.textContent = task.text;
  if (task.completed) {
    text.classList.add('completed');
  }

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.textContent = '刪除';
  deleteButton.addEventListener('click', () => removeTask(task.id));

  label.appendChild(checkbox);
  label.appendChild(text);
  li.appendChild(label);
  li.appendChild(deleteButton);

  return li;
}

function renderTasks() {
  todoList.innerHTML = '';
  if (tasks.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'todo-item';
    empty.textContent = '目前尚無待辦事項，請新增一個吧！';
    todoList.appendChild(empty);
  } else {
    tasks.forEach((task) => todoList.appendChild(createTaskElement(task)));
  }
  updateTaskCount();
}

function addTask(text) {
  tasks.unshift({
    id: Date.now().toString(),
    text: text.trim(),
    completed: false,
  });
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function removeTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

function clearCompletedTasks() {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
}

todoForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = todoInput.value.trim();
  if (!value) {
    return;
  }
  addTask(value);
  todoInput.value = '';
  todoInput.focus();
});

clearCompletedButton.addEventListener('click', clearCompletedTasks);

loadTasks();
renderTasks();
