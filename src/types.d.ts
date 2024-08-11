export type FormType = 'login' | 'signup'

export interface Todo {
  id: string
  createTime: number
  content: string
  status: boolean
}

export interface LoginForm {
  email: string
  password: string
}

export interface SignupForm extends LoginForm {
  nickname: string
}
