import './styles/globals.css'

export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en" className="h-full" data-theme="light">
        <body className="h-full select-auto color-scheme">{children}</body>
      </html>
    )
  }