import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect to sales dashboard by default
  // Users will be redirected to login if not authenticated
  redirect('/sales')
}
