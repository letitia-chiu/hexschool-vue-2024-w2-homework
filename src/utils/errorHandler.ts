import { Toast } from '@/utils'
import '../styles/sweetalert-color-toast-style.css'

export const errorHandler = (error: any) => {
  console.error(error)

  if (error.response && error.response.data && error.response.data.message) {
    const { message } = error.response.data
    let errMsg = `錯誤：${message}`
    if (message === '驗證失效') {
      errMsg = '驗證失效，請重新登入'
    }
    Toast('error', errMsg)
  } else {
    Toast('error', error)
  }
}
