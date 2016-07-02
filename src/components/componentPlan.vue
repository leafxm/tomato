<template>
  <div class="todo-list">
    <h1>计划</h1>
    <input v-model='newTodo' @keyup.enter='addTodo' placeholder="添加计划..." class="form-control">
    <ul class="todo-list list-group">
      <li v-for='todo in todoList' class="list-group-item  {{ todo.show ? 'hover-todo' : ''}}" @mouseenter="show(todo)" @mouseleave="show(todo)" transition="stagger" stagger="100">
          <span class="form-group"> 
            <input type="checkbox" id="{{ $index }}" @click="pass(todo)" checked="{{todo.done}}"/> 
            <label for="{{ $index }}">{{todo.content}}</label> 
            <i class="glyphicon glyphicon-remove remove"  v-show="todo.show" @click="removeTodo(todo)"></i>
          </span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data () {
    return {
      newTodo: '',
      todoList: JSON.parse(window.localStorage.getItem('todoList')) || []
    }
  },
  methods: {
    addTodo () {
      if (this.newTodo !== '') {
        var newTodo = {
          done: false,
          show: false,
          content: this.newTodo
        }
        this.todoList.push(newTodo)
        this.newTodo = ''
        window.localStorage.setItem('todoList', JSON.stringify(this.todoList))
      }
    },
    removeTodo (todo) {
      this.todoList.splice(this.todoList.indexOf(todo), 1)
      window.localStorage.setItem('todoList', JSON.stringify(this.todoList))
    },
    pass (todo) {
      todo.done = !todo.done
      if (todo.done) {
        this.$dispatch('getDone', todo.content)
      }
      // this.todoList.splice(this.todoList.indexOf(todo), 1)
    },
    show (todo) {
      todo.show = !todo.show
    }
  }
}
</script>

<style>
.todo-list{
    font-size: 1.5rem;
    margin-top:0.5rem;
}
.todo-list li{
  position: relative;
  padding-right:20px;
} 
.hover-todo{
  background: #e5e5e5;
}
.todo-list input[type="checkbox"] {
    position: absolute;
    clip: rect(0,0,0,0);
}

.todo-list input[type="checkbox"] + label::before {
    content: '\a0';
    font-size: 2rem;
    display: inline-block;
    vertical-align: .2rem;
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 1rem;
    border-radius: .2rem;
    background: #fff;
    text-indent: .15rem;
    line-height: .65;
    box-shadow: 0 0 .1rem .1rem #CD5B45;
}

.todo-list input[type="checkbox"]:checked + label::before {
    content: '\2713';
    background: #CD3333;
    color:black;
}

.todo-list input[type="checkbox"]:checked + label {
    text-decoration: line-through;
    color: #aaa;
}
.stagger-transition {
        transition: all .3s ease;
    }
.stagger-enter,
.stagger-leave {
        opacity: 0;
    }
.remove {
  position :absolute;
  right:6px;
  top : calc(50% - 10px);
}
</style>

