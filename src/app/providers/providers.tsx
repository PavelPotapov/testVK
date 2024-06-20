import { FallBack } from '@/shared/ui/fallback'
import { FC } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { AdaptivityProvider, ConfigProvider } from '@vkontakte/vkui'

interface IProviders {
  readonly children: React.ReactNode
}

export const Providers: FC<IProviders> = ({ children }) => {
  return (
    <ErrorBoundary FallbackComponent={FallBack}>
      <ConfigProvider>
        <AdaptivityProvider>{children}</AdaptivityProvider>
      </ConfigProvider>
    </ErrorBoundary>
  )
}
