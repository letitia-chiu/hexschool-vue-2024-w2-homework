import { del, get, post, put, toggle } from './todos'
import { checkAuth, login, logout, signup } from './users'

const api = {
  users: { signup, login, logout, checkAuth },
  todos: { get, post, put, delete: del, toggle }
}
export default api
