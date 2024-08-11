import Swal from 'sweetalert2'

const SwalToast = Swal.mixin({
  toast: true,
  position: 'top',
  iconColor: 'white',
  customClass: {
    popup: 'colored-toast'
  },
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true
})

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'question'

export const Toast = (type: ToastType, title: string) => {
  return SwalToast.fire({
    icon: type,
    title
  })
}
