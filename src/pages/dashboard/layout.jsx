import Sidebar from '../../components/Dashboard/DashSideBar'
import Navbar from '../../components/Dashboard/DashNavbar'
import BibicaLogo from '../../assets/img/logo/logo-m.svg'
import Image from 'next/image'
import Head from 'next/head'
import { parseCookies } from 'nookies'
import jwt from 'jsonwebtoken';

import { BiMenuAltLeft } from 'react-icons/bi';

import { AuthProvider } from '@/contexts/AuthContext'
import { useState } from 'react'

export default function RootLayout({ children }) {

  const [openMenuHamburguer, setOpenMenuHamburguer] = useState(false)

  const closeMenuHamburguer = () => {
    setOpenMenuHamburguer(false)
  }
  return (
      <>
        <AuthProvider>  
          <Head>
            <title>Dashboard</title>
          </Head>
          <div className="flex">
            <Sidebar openMenuHamburguer={openMenuHamburguer} setOpenMenuHamburguer={setOpenMenuHamburguer}/>
            <div className='relative w-full min-h-screen bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-800 '>
              <div className="hidden lg:block absolute right-2 bottom-2"><Image className='w-20' src={BibicaLogo} alt='Logo'></Image></div>
              
              <Navbar/>
              <button onClick={() => setOpenMenuHamburguer(true)} className="fixed left-3 bottom-3 w-10 h-10 xl:hidden z-40 bg-zinc-600 shadow-lg rounded-md">
                <div className="flex justify-center items-center w-full h-full">
                  <BiMenuAltLeft className='text-2xl text-white'/>
                </div>
              </button>
              {children}
              
            </div>
          </div>
        </AuthProvider>
      </>
    )
}
