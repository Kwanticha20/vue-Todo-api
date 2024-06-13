<!-- src/views/TodoView.vue -->
<script setup lang="ts">
  import { ref, reactive, watch } from 'vue';

  import NavbarTodo from "@/components/NavbarTodo.vue";
  import TodoList from "@/components/TodoList.vue"; // Import the TodoList component

  interface Todo {
    id: number;
    text: string;
    date: string;
    done: boolean;
  }
</script>

<template>
  <NavbarTodo />
  <br> <br>
    <TodoList />
</template>



<style scoped>
  .v-text-field {
    width: 100vh; 
  }

  .v-btn {
    margin-left: auto;
  }
</style>
