// Todo state
let currentCategory = 'work'; // Default category

// DOM elements
const newTodoInput = document.getElementById('new-todo');

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    setupEventListeners();
    updateInputCategoryColor();
    updateDisplay();
}

function setupEventListeners() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', handleTabSwitch);
    });

    // Category buttons
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', handleCategorySelect);
    });

    // Todo checkboxes and delete buttons
    document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
        checkbox.addEventListener('click', handleTodoToggle);
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', handleDeleteTodo);
    });

    // Drag and drop for existing todos
    document.querySelectorAll('.todo-item').forEach(item => {
        item.setAttribute('draggable', 'true');
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('drop', handleDrop);
        item.addEventListener('dragend', handleDragEnd);
    });

    // New todo input
    if (newTodoInput) {
        newTodoInput.addEventListener('keypress', handleNewTodoInput);
    };
}

// Tab switching functionality
function handleTabSwitch(event) {
    const tab = event.target.getAttribute('data-tab');
    const panel = event.target.closest('.left-panel, .right-panel');
    
    panel.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// Category selection functionality
function handleCategorySelect(event) {
    const category = event.target.getAttribute('data-category');
    
    // Update active category button
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update current category
    currentCategory = category;
    
    // Update input checkbox color
    updateInputCategoryColor();
}

// To-Do List
function updateInputCategoryColor() {
    const inputCheckbox = document.querySelector('.todo-input .todo-checkbox');
    
    if (inputCheckbox) {
        // Remove all category classes
        inputCheckbox.classList.remove('work', 'personal', 'others');
        
        // Add the current category class
        inputCheckbox.classList.add(currentCategory);
    }
}

// Delete todo functionality
function handleDeleteTodo(event) {
    const todoItem = event.target.closest('.todo-item');
    if (todoItem) {
        todoItem.remove();
    }
}

// Drag and drop functionality
let draggedElement = null;

function handleDragStart(event) {
    draggedElement = event.target;
    event.target.style.opacity = '0.5';
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();
    
    if (event.target.closest('.todo-item') && event.target.closest('.todo-item') !== draggedElement) {
        const targetItem = event.target.closest('.todo-item');
        const todoList = document.querySelector('.todo-list');
        const todoInput = document.querySelector('.todo-input');
        
        // Get all todo items (excluding the input)
        const allItems = Array.from(todoList.querySelectorAll('.todo-item'));
        const draggedIndex = allItems.indexOf(draggedElement);
        const targetIndex = allItems.indexOf(targetItem);
        
        // Reorder items
        if (draggedIndex < targetIndex) {
            todoList.insertBefore(draggedElement, targetItem.nextSibling);
        } else {
            todoList.insertBefore(draggedElement, targetItem);
        }
    }
}

function handleDragEnd(event) {
    event.target.style.opacity = '';
    draggedElement = null;
}

function handleTodoToggle(event) {
    const checkbox = event.target;
    const todoItem = checkbox.closest('.todo-item');
    const todoText = todoItem.querySelector('.todo-text');
    // Set checkbox background color based on its category and checked state
    const category = todoItem.getAttribute('data-category');
    if (checkbox.classList.contains('completed')) {
        checkbox.style.backgroundColor = 'transparent'; 
    } else {
        checkbox.style.backgroundColor = getCategoryColor(category);
    }

    // Helper function to get color for each category
    function getCategoryColor(category) {
        switch (category) {
            case 'work':
                return '#4285f4';
            case 'personal':
                return '#ea4335';
            case 'others':
                return '#fbbc04';
            default:
                return 'transparent';
        }
    }
    
    checkbox.classList.toggle('completed');
    todoText.classList.toggle('completed');
}

function handleNewTodoInput(event) {
    if (event.key === 'Enter' && newTodoInput.value.trim()) {
        addNewTodo(newTodoInput.value.trim());
        newTodoInput.value = '';
    }
}

function addNewTodo(text) {
    const todoList = document.querySelector('.todo-list');
    const todoInput = document.querySelector('.todo-input');
    
    const newTodo = document.createElement('div');
    newTodo.className = 'todo-item';
    newTodo.setAttribute('data-category', currentCategory);
    newTodo.setAttribute('draggable', 'true');
    newTodo.innerHTML = `
        <div class="todo-checkbox ${currentCategory}"></div>
        <div class="todo-text">${text}</div>
        <div class="delete-btn" title="Delete task">×</div>
    `;
    
    todoList.insertBefore(newTodo, todoInput);
    
    // Add event listeners
    newTodo.querySelector('.todo-checkbox').addEventListener('click', handleTodoToggle);
    newTodo.querySelector('.delete-btn').addEventListener('click', handleDeleteTodo);
    
    // Add drag and drop event listeners
    newTodo.addEventListener('dragstart', handleDragStart);
    newTodo.addEventListener('dragover', handleDragOver);
    newTodo.addEventListener('drop', handleDrop);
    newTodo.addEventListener('dragend', handleDragEnd);
};