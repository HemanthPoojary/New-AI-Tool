import PunchlineGenerator from '@/components/PunchlineGenerator'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Punching Star - Unleash Your Inner Comic!',
  description: 'Generate hilarious punchlines and comics with AI-powered creativity.',
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <h1 className="mb-2 text-4xl font-bold text-center text-white">Punching Star</h1>
        <p className="mb-8 text-xl text-center text-white italic">
          'Where AI meets comedy, and laughter knows no bounds!'
        </p>
        <PunchlineGenerator />
      </div>
    </main>
  )
}

