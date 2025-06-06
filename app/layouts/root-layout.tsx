import { Outlet } from 'react-router';
import { Footer } from '~/components/footer';
import { Header } from '~/components/header';

export default function RootLayout() {
  return (
    <div className="h-screen w-screen pt-6 pb-4 px-8 grid grid-cols-[1fr] gap-4 grid-rows-[auto_1fr_auto] items-center justify-center">
      <Header />
      <main className='flex flex-col items-center'>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
