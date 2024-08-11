<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { SignupForm, FormType, Todo, LoginForm } from '@/types'
import api from './api'
import { deleteCookie, errorHandler, getCookie, setCookie, Toast } from '@/utils'
import axios from 'axios'

// Data
const formType = ref<FormType>('login')
const isAuthenticated = ref<boolean>(false)
const currentUser = ref<string>('')
const todos = ref<Todo[]>([])

// Inputs
const newTodoContent = ref<string>('')
const edittingTodo = ref<Todo | null>(null)
const edittingContent = ref('')
const signupForm = ref<SignupForm>({
  email: '',
  password: '',
  nickname: ''
})
const loginForm = ref<LoginForm>({
  email: '',
  password: ''
})

// 登入
async function login() {
  try {
    const { data } = await api.users.login(loginForm.value) // 登入 API
    setCookie(data.token) // 將 token 存入 cookie
    await authCheck() // 執行登入驗證
    if (isAuthenticated.value) await getTodos() // 登入驗證成功時，取得 Todos
  } catch (error) {
    errorHandler(error)
  }
}

// 登出
async function logout() {
  try {
    await api.users.logout() // 登出 API
    isAuthenticated.value = false // 登出成功，驗證狀態設為 false
    deleteCookie() // 清除 cookie 中的 token
    Toast('info', '您已登出！')
  } catch (error) {
    errorHandler(error)
  }
}

// 註冊
async function signup() {
  try {
    const { data } = await api.users.signup(signupForm.value)
    Toast('success', `註冊成功！uid: ${data.uid}`)
    formType.value = 'login'
  } catch (error) {
    errorHandler(error)
  }
}

// 登入狀態驗證
async function authCheck() {
  try {
    const token = getCookie()
    if (!token) return Toast('info', '尚未登入')

    axios.defaults.headers.common['Authorization'] = token
    const { data } = await api.users.checkAuth()

    // 驗證成功，設定驗證狀態＆登入使用者暱稱
    isAuthenticated.value = true
    currentUser.value = data.nickname
    Toast('success', '登入成功！')
  } catch (error) {
    errorHandler(error)
  }
}

// 取得所有Todo
async function getTodos() {
  try {
    const { data } = await api.todos.get()
    todos.value = data.data
  } catch (error) {
    errorHandler(error)
  }
}

// 新增 Todo
async function addTodo() {
  const content = newTodoContent.value.trim()

  // 如果輸入內容為空白，則不新增
  if (content.length === 0) {
    Toast('warning', 'Todo內容不能為空白')
    return (newTodoContent.value = '')
  }

  await api.todos.post(content) // 透過 API 新增 todo
  newTodoContent.value = ''
  getTodos() // 刷新資料
}

// 啟動編輯
function editTodo(todo: Todo) {
  edittingTodo.value = todo
  edittingContent.value = todo.content
}

// 保存編輯內容
async function saveEdit(todo: Todo) {
  try {
    // 如果內容沒有差異，則不 call API 更新
    if (todo.content === edittingContent.value) {
      return (edittingTodo.value = null)
    }

    await api.todos.put(todo.id, edittingContent.value) // API 更新 Todo
    edittingTodo.value = null // 清空編輯狀態
    await getTodos() // 刷新資料
    Toast('success', '更新成功')
  } catch (error) {
    errorHandler(error)
  }
}

// 切換 Todo 完成狀態
async function toggleTodo(todo: Todo) {
  try {
    await api.todos.toggle(todo.id) // toggle API
    if (todo.status) {
      Toast('success', `已完成：${todo.content}`)
    } else {
      Toast('warning', `未完成：${todo.content}`)
    }
  } catch (error) {
    errorHandler(error)
  }
}

// 刪除 Todo
async function deleteTodo(todo: Todo) {
  try {
    await api.todos.delete(todo.id) // 刪除 API
    getTodos() // 刷新資料
    Toast('success', `已刪除：${todo.content}`)
  } catch (error) {
    errorHandler(error)
  }
}

onMounted(async () => {
  try {
    await authCheck() // 執行登入驗證
    if (isAuthenticated.value) await getTodos() // 登入驗證成功時，取得 Todos
  } catch (error) {
    errorHandler(error)
  }
})
</script>

<template>
  <!-- Navbar -->
  <nav class="navbar navbar-light bg-light">
    <div class="container-fluid px-5">
      <a class="navbar-brand mb-0 h1">Todo List</a>
      <div v-if="isAuthenticated">
        <span>目前使用者：{{ currentUser }}</span>
        <button type="button" @click="logout" class="btn btn-outline-danger ms-4">登出</button>
      </div>
    </div>
  </nav>

  <!-- Main -->
  <main class="container-fluid">
    <div class="content-wrapper" v-if="!isAuthenticated">
      <!-- 登入畫面 -->
      <form v-if="formType === 'login'" class="w-100">
        <h2 class="mb-4">登入</h2>
        <div class="mb-3">
          <label for="login-email" class="form-label">E-mail：</label>
          <input
            type="email"
            name="email"
            id="login-email"
            class="form-control"
            v-model="loginForm.email"
          />
        </div>
        <div class="mb-3">
          <label for="login-password" class="form-label">密碼：</label>
          <input
            type="password"
            name="password"
            id="login-password"
            class="form-control"
            v-model="loginForm.password"
          />
        </div>
        <button type="button" @click="login" class="btn btn-outline-success">登入</button>
        <button type="button" @click="formType = 'signup'" class="btn btn-outline-primary ms-3">
          去註冊
        </button>
      </form>

      <!-- 註冊畫面 -->
      <form v-if="formType === 'signup'" class="w-100">
        <h2 class="mb-4">註冊帳號</h2>
        <div class="mb-3">
          <label for="signup-email" class="form-label">E-mail：</label>
          <input
            type="email"
            name="email"
            id="signup-email"
            class="form-control"
            v-model="signupForm.email"
          />
        </div>
        <div class="mb-3">
          <label for="signup-password" class="form-label">密碼：</label>
          <input
            type="password"
            name="password"
            id="signup-password"
            class="form-control"
            v-model="signupForm.password"
          />
        </div>
        <div class="mb-3">
          <label for="signup-nickname" class="form-label">暱稱：</label>
          <input
            type="text"
            name="nickname"
            id="signup-nickname"
            class="form-control"
            v-model="signupForm.nickname"
          />
        </div>
        <button type="button" @click="signup" class="btn btn-outline-success">註冊</button>
        <button type="button" @click="formType = 'login'" class="btn btn-outline-primary ms-3">
          去登入
        </button>
      </form>
    </div>

    <!-- Todo List 畫面 -->
    <div class="content-wrapper" v-if="isAuthenticated">
      <form class="w-100">
        <h2 class="mb-4">待辦事項</h2>

        <!-- 新增區塊 -->
        <div class="input-group mb-3">
          <input
            type="text"
            class="form-control"
            placeholder="新增待辦事項"
            v-model="newTodoContent"
          />
          <button type="button" @click="addTodo" class="btn btn-outline-secondary">新增</button>
        </div>

        <!-- 待辦清單 -->
        <ul class="list-group">
          <li class="list-group-item" v-for="todo in todos" :key="todo.id">
            <div class="todo-row row row-cols-2 ps-2">
              <div class="form-check col-sm-8">
                <!-- Checkbox -->
                <input
                  @change="toggleTodo(todo)"
                  class="form-check-input checkbox-lg"
                  type="checkbox"
                  v-model="todo.status"
                />
                <!-- 編輯時顯示 input -->
                <input
                  type="text"
                  v-if="edittingTodo && edittingTodo.id === todo.id"
                  name="todo-content"
                  class="form-control form-control"
                  id="editting-input"
                  v-model="edittingContent"
                />
                <!-- 非編輯時顯內容 -->
                <label v-else @dblclick="editTodo(todo)" class="form-check-label ms-2">
                  {{ todo.content }}
                </label>
              </div>

              <!-- 按鈕區 -->
              <div class="col-sm-4 d-flex justify-content-end">
                <!-- 編輯狀態：顯示保存、取消按鈕 -->
                <div v-if="edittingTodo && edittingTodo.id === todo.id">
                  <button
                    @click="saveEdit(todo)"
                    type="button"
                    class="btn btn-outline-success btn-sm"
                  >
                    保存
                  </button>
                  <button
                    @click="edittingTodo = null"
                    type="button"
                    class="btn btn-outline-secondary btn-sm ms-2"
                  >
                    取消
                  </button>
                </div>
                <!-- 非編輯狀態：顯示刪除按鈕 -->
                <button
                  @click="deleteTodo(todo)"
                  v-else
                  type="button"
                  class="btn-close"
                  aria-label="Close"
                ></button>
              </div>
            </div>
          </li>
        </ul>

        <!-- 說明 -->
        <div v-if="todos.length > 0" class="form-text mt-3">💡 點兩下 Todo 內容即可編輯</div>
        <div v-else class="form-text mt-3">💡 您還沒有待辦事項，新增一個吧！</div>
      </form>
    </div>
  </main>
</template>

<style scoped>
.content-wrapper {
  margin: 60px auto;
  padding: 30px;
  width: 40%;
  min-width: 500px;
  max-width: 600px;
  border: 1px solid #d6d6d6;
  border-radius: 10px;
  display: flex;
  justify-content: center;
}

.checkbox-lg {
  width: 1.1rem;
  height: 1.1rem;
}
</style>
