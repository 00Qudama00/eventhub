import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeToast, selectToasts } from '../features/ui/uiSlice'
import Icon from './Icon'

function ToastItem({ toast }) {
  const dispatch = useDispatch()

  useEffect(() => {
    const timer = setTimeout(() => dispatch(removeToast(toast.id)), 3500)
    return () => clearTimeout(timer)
  }, [toast.id, dispatch])

  return (
    <div className={`toast toast-${toast.type}`}>
      <span>{toast.message}</span>
      <button onClick={() => dispatch(removeToast(toast.id))} aria-label="Close"><Icon name="close" size={16} /></button>
    </div>
  )
}

function ToastContainer() {
  const toasts = useSelector(selectToasts)

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  )
}

export default ToastContainer
