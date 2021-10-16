class TodoApp {

  constructor(appSelector) {
    this.app = document.querySelector(appSelector);
    this.todos = [];
    this.createTodoField = null;
    this.init();
  }

  initElements(app) {
    this.createTodoField = new createTodoField(app);
  }

  createTodo() {
    const $this = this;
    const { submitElement } = this.createTodoField;

    submitElement.addEventListener('click', function() {
      const newTodoVal = $this.createTodoField.value;

      if (newTodoVal) {
        const newTodo = new newTodoField(newTodoVal);
        $this.addTodoInDOM(newTodo);
        $this.saveLocalTodos(newTodo.value);
        console.log(newTodo, 'create Todo');
      } else {
        console.log('no');
      }

    });
  }

  addTodoInDOM(todo) {
    const childrenApp = this.app.children;
    const lastChildren = childrenApp[childrenApp.length - 1];
    lastChildren.parentNode.insertBefore(todo.htmlElement, lastChildren.nextSibling);

    this.todos.push(todo);
    this.clearInput(this.createTodoField);
    todo.deleteIcon.addEventListener('click', () => {
      this.deleteTodo(todo)
    }, true);
  }

  deleteTodo(todo) {
    this.todos.filter((item) => {
      item.value !== todo.value
    })
    todo.htmlElement.parentNode.removeChild(todo.htmlElement);
    this.deleteLocalTodo(todo.value)
  }

  clearInput(element) {
    element.htmlElement.value = '';
    element.value = '';
    element.htmlElement.parentNode.querySelector('label').classList.remove('active');
  }

  init() {
    this.initElements(this.app);
    this.createTodo();
    this.loadLocalTodos();
  }

  saveLocalTodos(todoVal) {
    let localTodos = localStorage.getItem('todos');

    if (localTodos) {
      localTodos = JSON.parse(localTodos);
      localTodos.push(todoVal);
    } else {
      localTodos = [todoVal];
    }

    localStorage.setItem('todos', JSON.stringify(localTodos));
  }

  loadLocalTodos() {
    let todos = localStorage.getItem('todos');

    if (todos) {
      JSON.parse(todos).forEach(val => {
        const newTodo = new newTodoField(val);
        this.addTodoInDOM(newTodo);
      });
    }
  }

  deleteLocalTodo(todo) {
    let todos = localStorage.getItem('todos');

    if (todos) {
      todos = JSON.parse(todos).filter(val => val !== todo );
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }
}

class TodoItem {
  constructor() {
    this.htmlElement = null;
    this.value = null;
    this.submitElement = null;
  }

  updateValue() {
    const $this = this;
    this.htmlElement.addEventListener('input', function () {
      $this.value = this.value;
    })
  }

  createHtmlElement(text) {
    const li = document.createElement('li');
    const label = document.createElement('label');
    const input = document.createElement('input');
    const span = document.createElement('span');
    const div = document.createElement('div');
    const i = document.createElement('i');

    li.classList.add(...['collection-item', 'todo-app-item']);
    label.classList.add(...['todo-app-item__checkbox-label']);
    input.classList.add(...['todo-app-item__checkbox']);
    i.classList.add(...['material-icons', 'todo-app-item__delete']);

    input.type = 'checkbox';
    div.textContent = text;
    i.textContent = 'close';

    li.appendChild(label);
    li.appendChild(div);
    label.appendChild(input);
    label.appendChild(span);
    div.appendChild(i);

    return li;
  }
}

class createTodoField extends TodoItem {

  constructor(app) {
    super();
    this.htmlElement = app.querySelector('#todo-create');
    this.value = this.htmlElement.value;
    this.submitElement = app.querySelector('#todo-create-icon');
    this.updateValue();
  }

}

class newTodoField extends TodoItem {
  constructor(value) {
    super();
    this.htmlElement = this.createHtmlElement(value);
    this.value = value;
    this.deleteIcon = this.htmlElement.querySelector('.todo-app-item__delete');
  }

}

const todoApp = new TodoApp('#todo-app');

console.log(todoApp, 'todo app constructor');