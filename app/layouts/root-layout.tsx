import { Outlet } from 'react-router';
import { Footer } from '~/components/footer';
import { Header } from '~/components/header';
import { Card, CardContent } from '~/components/ui/card';

export default function RootLayout() {
  return (
    <div className="h-screen w-screen pt-6 pb-4 px-8 grid grid-cols-[1fr] grid-rows-[100px_1fr_30px] items-start justify-center">
      <Header />
      <main className='flex flex-col items-center'>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}