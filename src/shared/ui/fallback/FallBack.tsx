import { Link, useRouteError } from 'react-router-dom'
import { RejectedDataType } from '@/shared/types'

export const FallBack = () => {
  const error = useRouteError()
  const knownError = error as RejectedDataType

  return (
    <div>
      <h2>Что-то пошло не так</h2>
      <pre style={{ color: 'red' }}>
        {knownError?.messageError} {knownError?.status}
      </pre>
      <Link to="/">На главную</Link>
      Link
    </div>
  )
}
