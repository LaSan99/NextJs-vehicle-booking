import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Vehicle Booking System',
  description: 'Book your vehicle with ease',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className={`${inter.className} h-full antialiased text-gray-900`}>
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
