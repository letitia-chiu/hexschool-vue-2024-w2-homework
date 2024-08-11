export const setCookie = (token: string) => {
  const expires = new Date()
  expires.setTime(expires.getTime() + 1 * 24 * 60 * 60 * 1000)
  document.cookie = `hexschoolTodoToken=${token};expires=${expires.toUTCString()}`
}

export const getCookie = () => {
  return document.cookie.replace(/(?:(?:^|.*;\s*)hexschoolTodoToken\s*=\s*([^;]*).*$)|^.*$/, '$1')
}

export const deleteCookie = () => {
  document.cookie = 'hexschoolTodoToken='
}
