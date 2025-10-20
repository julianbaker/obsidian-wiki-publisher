export default function GraphLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Override the root layout - no sidebar, no container, just full screen
  return children
}

