import axios from 'axios'

const BASE_URL = 'https://todolist-api.hexschool.io/todos'

export const get = async () => {
  return axios.get(`${BASE_URL}/`)
}

export const post = async (content: string) => {
  return axios.post(`${BASE_URL}/`, { content })
}

export const put = async (todoId: string, content: string) => {
  return axios.put(`${BASE_URL}/${todoId}`, { content })
}

export const del = async (todoId: string) => {
  return axios.delete(`${BASE_URL}/${todoId}`)
}

export const toggle = async (todoId: string) => {
  return axios.patch(`${BASE_URL}/${todoId}/toggle`, { id: todoId })
}
