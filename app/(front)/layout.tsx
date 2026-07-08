import DrawerButton from '@/components/DrawerButton';
import Footer from '@/components/footer/Footer';
import Header from '@/components/header/Header';
import Sidebar from '@/components/Sidebar';
import ScrollToTopButton from '@/components/ScrollToTopButton';
import FloatingContactWidget from '@/components/FloatingContactWidget';
import ResponsiveDrawerInit from '@/components/ResponsiveDrawerInit';

export default function FrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='drawer z-[60]'>
      <DrawerButton />
      <ResponsiveDrawerInit />
      <div className='drawer-content'>
        <div className='flex min-h-screen flex-col overflow-x-hidden'>
          <div className="bg-primary text-white text-center py-2 text-xs md:text-sm font-semibold tracking-wider flex justify-center items-center gap-2 md:gap-4 px-4 uppercase font-body z-40 relative">
            <span>Made in India</span>
            <span className="hidden sm:inline">•</span>
            <span>FDA Registered</span>
            <span className="hidden sm:inline">•</span>
            <span>Cruelty Free</span>
            <span className="hidden sm:inline">•</span>
            <span>Vegan</span>
          </div>
          <Header />
          <main className='flex-grow'>{children}</main>
          <Footer />
          <ScrollToTopButton />
          <FloatingContactWidget />
        </div>
      </div>
      <div className='drawer-side z-[70]'>
        <label
          htmlFor='my-drawer'
          aria-label='close sidebar'
          className='drawer-overlay'
        ></label>
        <Sidebar />
      </div>
    </div>
  );
}
