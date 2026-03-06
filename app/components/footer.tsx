import { Separator } from './ui/separator'

export default function Footer() {
  return (
    <footer className="mt-16">
      <Separator className="mb-8" />
      <div className="text-sm text-muted-foreground space-y-2">
        <p>© {new Date().getFullYear()} Julian Baker. Code under MIT.</p>
      </div>
    </footer>
  )
}
