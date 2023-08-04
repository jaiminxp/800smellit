// layout for all dashboard pages

import { Providers } from '../providers'
import LayoutWrapper from './layout-wrapper'

export const metadata = {
  title: 'Dashboard',
}

export default function DashboardLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  )
}
