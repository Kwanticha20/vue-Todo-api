<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import useTodoStore from '../stores/todo'; // Import Axios instance ที่ได้แก้ไขแล้ว

const todoStore = useTodoStore;

const name = ref('');
const searchQuery = ref('');
const isEditing = ref(false);
const editingIndex = ref<number | null>(null);

const todoData = reactive({
  id: 0,
  text: '',
  date: '',
  done: false,
});

const todoList = ref([]); // ค่า todoList ที่เก็บรายการงานที่ได้จาก API

// ฟังก์ชันสำหรับดึงรายการงานที่ต้องทำจาก API
const fetchTodos = async () => {
  try {
    const response = await todoStore.get('list');
    todoList.value = response.data;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
  }
};

// เรียกใช้งานฟังก์ชันเมื่อคอมโพเนนต์โหลด
onMounted(fetchTodos);

// ฟังก์ชันสำหรับเพิ่มงานที่ต้องทำใหม่
const addOrUpdateTodo = async () => {
  if (!name.value.trim()) {
    return;
  }

  if (isEditing.value && editingIndex.value !== null) {
    updateTodo();
  } else {
    addNewTodo();
  }
};

// ฟังก์ชันสำหรับเพิ่มงานที่ต้องทำใหม่
const addNewTodo = async () => {
  try {
    const newTodo = {
      text: name.value,
      date: new Date().toISOString(), // ปรับรูปแบบวันที่ตามที่ API ของคุณต้องการ
      done: false,
    };
    const response = await todoStore.post('list', newTodo);
    todoList.value.push(response.data);
    resetForm();
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการเพิ่มงานที่ต้องทำ:', error);
  }
};

// ฟังก์ชันสำหรับอัปเดตงานที่ต้องทำ
const updateTodo = async () => {
  try {
    const updatedTodo = {
      text: name.value,
    };
    const response = await todoStore.patch(`list/${todoData.id}`, updatedTodo); // Ensure todoData.id is correctly set
    const index = todoList.value.findIndex(todo => todo.id === todoData.id);
    if (index !== -1) {
      todoList.value[index] = response.data;
    }
    resetForm(); // Reset the form after updating the todo
    await fetchTodos(); // เรียกฟังก์ชัน fetchTodos เพื่อรีเฟรชรายการงาน
  } catch (error) {
    console.error('Failed to update todo:', error);
  }
};

// ฟังก์ชันสำหรับรีเซ็ตฟอร์ม
const resetForm = () => {
  todoData.id = 0;
  todoData.text = '';
  todoData.date = '';
  todoData.done = false;
  name.value = '';
  isEditing.value = false;
  editingIndex.value = null;
};


// ฟังก์ชันสำหรับแก้ไขรายการงานที่ต้องทำ
const editTodo = (todo: any, index: number) => {
  todoData.id = todo.id;
  todoData.text = todo.text;
  todoData.date = todo.date;
  todoData.done = todo.done;
  name.value = todo.text;
  isEditing.value = true;
  editingIndex.value = index;
};


// ฟังก์ชันสำหรับลบงานที่ต้องทำ
const onDeleteTodo = async (todoId: number) => {
  try {
    await todoStore.delete(`list/${todoId}`);
    todoList.value = todoList.value.filter(todo => todo.id !== todoId);
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการลบงานที่ต้องทำ:', error);
  }
};;

// ฟังก์ชันสำหรับเปลี่ยนสถานะของงานที่ต้องทำเป็นเสร็จแล้วหรือยังไม่เสร็จ
const toggleDone = async (todo: any) => {
  try {
    const updatedTodo = {
      done: !todo.done,
    };
    const response = await todoStore.patch(`list/${todo.id}`, updatedTodo);
    const index = todoList.value.findIndex(t => t.id === todo.id);
    if (index !== -1) {
      todoList.value[index] = response.data;
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการเปลี่ยนสถานะงานที่ต้องทำ:', error);
  }
};


// Computed property สำหรับการกรองรายการงานที่ต้องทำ
const filteredTodoList = computed(() => {
  if (!searchQuery.value) {
    return todoList.value;
  }
  return todoList.value.filter(todo =>
    todo.text.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>


<template>
  <v-app>
    <v-main>
      <v-container>
        <div class="d-flex align-center mb-8">
          <v-text-field
            v-model="searchQuery"
            class="pa-4 mx-auto flex-grow-1"
            label="search"
            prepend-inner-icon="mdi-magnify"
            style="max-width: 350px;"
            variant="solo"
            hide-details
            rounded
            clearable
          ></v-text-field>

          <v-text-field
            v-model="name"
            class="pa-4 mr-4 flex-grow-1"
            label="Add/Edit Task"
            variant="solo"
            hide-details
            rounded
            clearable
          ></v-text-field>

          <div v-if="isEditing">
            <v-btn 
              @click="addOrUpdateTodo"
              color="orange-darken-1"
              variant="flat"
              class="mr-4"
              rounded
            >
              Update
            </v-btn>

            <v-btn 
              @click="resetForm"
              color="red-lighten-1"
              variant="flat"
              class="mr-4"
              rounded
            >
              Cancel
            </v-btn>
          </div>

          <v-btn 
            v-else
            @click="addOrUpdateTodo"
            color="green-lighten-1"
            variant="flat"
            class="mr-4"
            rounded
          >
            Add
          </v-btn>
        </div>

        <div v-if="filteredTodoList.length === 0" class="no-tasks">
          <v-icon color="primary" icon="mdi-check" size="100"></v-icon>
          <div class="text-h5 text-primary">No tasks found</div>
        </div>

        <v-list>
          <v-card color="blue-grey-lighten-5">
            <v-list-item v-for="(todo, index) in filteredTodoList" :key="todo.id">
              <template v-slot:prepend>
                <v-list-item-action>
                  <v-checkbox
                    v-model="todo.done"
                    @change="() => toggleDone(todo)"
                  ></v-checkbox>
                </v-list-item-action>
              </template>

              <v-list-item-content>
                <v-list-item-title>
                  <span :class="{ 'text-decoration-line-through': todo.done }">{{ todo.text }} - {{ todo.date }}</span>
                </v-list-item-title>
              </v-list-item-content>

              <template v-slot:append>
                <v-list-item-action>
                  <v-btn 
                    @click="() => editTodo(todo, index)" 
                    color="orange-lighten-2"
                    icon="mdi-pencil"
                    variant="text"
                  >
                  <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn 
                     @click="() => onDeleteTodo(todo.id)"
                    icon="mdi-delete"
                    color="red-lighten-1"
                    variant="text"
                  >
                  </v-btn>
                </v-list-item-action>
              </template>
            </v-list-item>
          </v-card>
        </v-list>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
  .text-decoration-line-through {
    text-decoration: line-through;
  }
  .d-flex {
    display: flex;
  }
  .align-center {
    align-items: center;
  }
  .flex-grow-1 {
    flex-grow: 1;
  }
  .mr-4 {
    margin-right: 16px;
  }
  .mb-4 {
    margin-bottom: 16px;
  }
  .no-tasks {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: 0.5;
  }
</style>
