import addTodo from '@salesforce/apex/ToDoController.addTodo';
import getAllTodos from '@salesforce/apex/ToDoController.getAllTodos';
import getCurrentTodos from '@salesforce/apex/ToDoController.getCurrentTodos';
import { LightningElement, track } from 'lwc';

export default class ToDoManager extends LightningElement {
    @track time ="8:15 PM";
    @track greeting = "Buenas tardes";

    @track todos = [];

    connectedCallback(){
        this.getTime();

        this.fetchTodos();

        setInterval(() => {
            this.getTime();
            //console.log("set interval called");
        },  1000);
    }

    getTime(){
        const date = new Date();
        const hour = date.getHours();
        const min = date.getMinutes();

        this.time = `${this.getHour(hour)}:${this.gatDoubleDigit(min)} ${this.getMidDay(hour)}`;

        this.setGreeting(hour);
    }

    getHour(hour){
        return hour === 0 ? 12 : hour > 12 ? (hour-12) : hour;
    }

    getMidDay(hour){
        return hour >=12 ? "PM" : "AM";
    }

    gatDoubleDigit(digit){
        return digit<10 ? "0" + digit : digit;
    }

    setGreeting(hour){
        if(hour < 12){
            this.greeting = "Buenos dias";
        }else if(hour >= 12 && hour <  17){
            this.greeting = "Buenas tardes";
        } else{
            this.greeting = "Buenas noches";
        }
    }

    addTodoHandler(){
        const inputBox = this.template.querySelector("lightning-input");

        const todo = {
            todoId: this.todos.length,
            todoName: inputBox.value,
            done: false,
            todoDate: new Date()
        }

        addTodo({payloadv: JSON.stringify(todo)})
        .then(response => {
            console.log("Elemento insertado satisfactoriamente");
            this.fetchTodos();
        })
        .catch(error => {
            console.error("Erro al insertar la tarea" + error);
        });
        this.todos.push(todo);
        inputBox.value = "";
    }

    fetchTodos(){
        getCurrentTodos().then(responese =>{
            if(result){
                console.log("Retrieve todos from server", result.length);
                this.todos = result;
            }
        })
        .catch(error => {
            console.error("Erro al recuperar las tareas" + error);
        });
    }

    updateHandler(){
        this.fetchTodos();
    }

    deleteHandler(){
        this.fetchTodos();
    }

    get upcomingTasks(){
        return this.todos && this.todos.length ? this.todos.filter( todo => !todo.done): [];
    }
    
    get completedTasks(){
        return this.todos && this.todos.length ? this.todos.filter( todo => todo.done): [];
    }
}