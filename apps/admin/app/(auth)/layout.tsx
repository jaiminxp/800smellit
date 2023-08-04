// layout for all authentication pages
import { Providers } from '../providers'

export default function AuthLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
