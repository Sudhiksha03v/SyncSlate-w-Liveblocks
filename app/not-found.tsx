import Link from 'next/link'
import Header from '@/components/shared/Header'

export default function NotFound() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
      <Header className="sticky left-0 top-0" children={undefined} />
      <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
      <p className="text-blue-100">The document you are looking for does not exist or has been moved.</p>
      <Link href="/" className="gradient-blue flex h-10 items-center rounded-md px-4">
        Go Home
      </Link>
    </main>
  )
}
