import todoStore, { Filters } from "../store/todo.store";
import html from "./app.html?raw";
import { renderTodos, renderPending } from './use-cases'


const ElementIDs = {
    ClearCompleted: '.clear-completed',
    TodoList: '.todo-list',
    NewTodoInput: '#new-todo-input',
    TodoFilters: '.filtro',
    PendingCountLabel: '#pending-count',
}
/**
 * 
 * @param {String} elementId 
 */

export const App = (elementId) =>{

    const updatePendingCount = () => {
        renderPending(ElementIDs.PendingCountLabel)
    }

    const displayTodos = () => {
        const todos = todoStore.getTodos( todoStore.getCurrentFilter());
        renderTodos(ElementIDs.TodoList, todos)
        updatePendingCount();
    }

    
    // cuando la funcion App() se monta
    (()=> {
        const app = document.createElement('div');
        app.innerHTML = html
        document.querySelector(elementId).append(app);
        displayTodos()
    })();

    // Referencias HTML 
    const clearCompleted = document.querySelector(ElementIDs.ClearCompleted)
    const newDescriptionInput = document.querySelector(ElementIDs.NewTodoInput);
    const todoListUL = document.querySelector(ElementIDs.TodoList);
    const filtersLIs = document.querySelectorAll(ElementIDs.TodoFilters)

    // Listener

    newDescriptionInput.addEventListener('keyup', ( event ) => {
        if ( event.keyCode !== 13) return;
        if (event.target.value.trim().length === 0) return;

        todoStore.addTodo(event.target.value);
        displayTodos()
        event.target.value = ''
    })

    todoListUL.addEventListener('click', (e) =>{
        const element = event.target.closest('[data-id]');
        todoStore.toggleTodo(element.getAttribute('data-id'))
        displayTodos()
    })

    todoListUL.addEventListener('click', (e)=>{
        const isDestroyElement = e.target.className === 'destroy'
        const element = e.target.closest('[data-id]');
        if ( !element || !isDestroyElement) return;

        todoStore.deleteTodo(element.getAttribute('data-id'));
        displayTodos()
    })
    clearCompleted.addEventListener('click', (e)=> {
        todoStore.deleteCompleted();
        displayTodos()
    });

    filtersLIs.forEach( element => {
        element.addEventListener('click', (element)=>{
            filtersLIs.forEach(el => el.classList.remove('selected'))
            element.target.classList.add('selected')

            switch (element.target.text) {
                case 'Todos':
                    todoStore.setFilter( Filters.All)
                    break;
                case 'Completados':
                    todoStore.setFilter( Filters.Completed)
                    break;
                case 'Pendientes':
                    todoStore.setFilter( Filters.Pending)
                    break;
            }
            displayTodos()
        });

    });
}