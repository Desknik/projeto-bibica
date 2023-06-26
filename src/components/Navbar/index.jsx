import React, { useState, useContext, useRef } from 'react'
import { useRouter } from 'next/router';


import Image from 'next/image'
import logo from '../../assets/img/logo/logo.svg'

import Link from 'next/link'
import { Link as ScrollLink, animateScroll as scroll } from 'react-scroll';

import { BiMenuAltLeft } from 'react-icons/bi';
import { FaUserAlt, FaShoppingCart } from 'react-icons/fa';

import { AuthContext } from '../../contexts/AuthContext'

export default function Navbar() {

  const { signOut, user, carrinhoDeCompras } = useContext(AuthContext)

  const router = useRouter();
  const currentRoute = router.pathname;

  const handleLogout = () => {
      signOut()
  }

  const [openProfileModal, setOpenProfileModal] = useState(true);
  const ProfileDropdownn = useRef(null);

  const openProfile = () => {
    const dropdown = ProfileDropdownn
    setOpenProfileModal(!openProfileModal)

    if(!openProfileModal){
        dropdown.current.classList.remove('transition', 'ease-in', 'duration-75')
        dropdown.current.classList.add('transition', 'ease-out', 'duration-100')

        dropdown.current.classList.remove('transform', 'scale-100', 'opacity-100')
        dropdown.current.classList.add('transform', 'scale-95', 'opacity-0')
         setTimeout(()=>{
           dropdown.current.classList.add('hidden')
        }, 100)
        
    }else{
        dropdown.current.classList.remove('transition', 'ease-out', 'duration-100')
        dropdown.current.classList.add('transition', 'ease-in', 'duration-75')

        dropdown.current.classList.remove('transform', 'scale-95', 'opacity-0')
        dropdown.current.classList.add('transform', 'scale-100', 'opacity-100')
        
        setTimeout(()=>{
            dropdown.current.classList.remove('hidden')
        }, 100)
    }
  }

  const [openMenuHamburguer, setOpenMenuHamburguer] = useState()

     return (
       <header id='Header' className={`${currentRoute === `/` ? 'absolute bg-transparent' : `bg-pink-400 relative `}`}>
            <nav className="w-full  mx-auto flex max-w-7xl items-center justify-between p-3 lg:px-8" aria-label="Global">
              <div className="flex lg:hidden w-20">
                <button onClick={() => setOpenMenuHamburguer(true)} type="button" className="flex items-center justify-center p-2.5 text-white text-xl">
                  <BiMenuAltLeft/>
                </button>
              </div>

              <Link href={'/'}>
                <Image className='w-auto h-8' src={logo} alt='Logo'/>
              </Link>

              <div className="hidden lg:flex lg:gap-x-12">
                <Link href='/Produtos' className="text-white font-normal md:hover:opacity-70">Produtos</Link>
                <Link href='/Decoracoes' className="text-white font-normal md:hover:opacity-70">Decorações</Link>
                <Link href='/Sobre' className="text-white font-normal md:hover:opacity-70">Sobre nós</Link>
                <ScrollLink 
                  className="text-white font-normal md:hover:opacity-70 cursor-pointer"
                  to="footer"
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                >
                  Contato
                </ScrollLink>
              </div>
            
              <div className="relative ml-3 w-20">
                <div className='relative flex gap-2 justify-end'>
                  {!!user && user.userClass != 1 &&
                    <div className="relative">
                      <Link href="/Carrinho"  className="flex max-w-xs items-center p-2 text-white text-sm ">
                        <span className="sr-only">Open user menu</span>
                        <FaShoppingCart className=''/>
                        {!!user && carrinhoDeCompras.length > 0 && <span className='absolute right-0 top-1 w-2 h-2 bg-pink-300 rounded-full'></span>}
                        
                      </Link>
                    </div>
                    }
                    

                    <div className="relative">
                      <button type="button" onClick={openProfile} className="flex max-w-xs items-center p-2 text-white text-sm " id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                        <span className="sr-only">Open user menu</span>
                        <FaUserAlt className=''/>
                        {!!user && user.userClass != 1 && !user.CompletedDetails && <span className='absolute right-0 top-1 w-2 h-2 bg-pink-300 rounded-full'></span>}
                        
                      </button>
                    </div>
                </div>
                
                <div ref={ProfileDropdownn} className="hidden absolute opacity-0 right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex="-1">
                    {user && 
                      <div>
                        {!!user && user.userClass != 1 && <Link href='/Perfil' className="flex items-center w-full px-4 py-2 text-sm text-gray-700 text-left" role="menuitem" tabIndex="-1" id="user-menu-item-0">Meu Perfil {!user.CompletedDetails && <span className='ml-2 bg-red-400 w-2 h-2 rounded-full'></span>} </Link>}

                        {!!user && user.userClass == 1 && <Link href="/dashboard" className="block w-full px-4 py-2 text-sm text-gray-700 text-left" role="menuitem">Dashboard</Link>}

                        <button onClick={handleLogout} className="block w-full px-4 py-2 text-sm text-gray-700 text-left" role="menuitem" tabIndex="-1" id="user-menu-item-2">Sair</button>
                      </div>  
                    }

                    {!user && 
                      <div>
                        <Link href='/login' className="block w-full px-4 py-2 text-sm text-gray-700 text-left" role="menuitem" tabIndex="-1" id="user-menu-item-0">Entrar</Link>
                      </div>  
                    }
                    
                </div>
              </div>
            </nav>  
            
            {/* Mobile menu, show/hide based on menu open state.*/} 
            <div className={`${!openMenuHamburguer && 'hidden'} lg:hidden`} role="dialog" aria-modal="true">
               {/* Background backdrop, show/hide based on slide-over state.*/}
              <div className="fixed inset-0 z-10"></div>

              <div className="fixed inset-y-0 left-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-xs sm:ring-1 sm:ring-gray-900/10">
                <div className="flex items-center justify-end">
                  <button onClick={() => setOpenMenuHamburguer(false)} type="button" className="-m-2.5 rounded-md p-2.5 text-gray-700">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flow-root">
                  <div className="-my-6 divide-y divide-gray-500/30">
                    <div className="space-y-2 py-6">
                      <Link href='/Produtos' className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:opacity-70">Produtos</Link>
                      <Link href='/Decoracoes' className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:opacity-70">Decorações</Link>
                      <Link href='/Sobre' className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:opacity-70">Sobre nós</Link>
                      <ScrollLink 
                        className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:opacity-70 cursor-pointer"
                        to="footer"
                        spy={true}
                        smooth={true}
                        offset={-70}
                        duration={500}
                      >
                        Contato
                      </ScrollLink>
                    </div>
                    <div className="py-6">
                    {user && 
                      <div>
                        {!!user && user.userClass != 1 &&  <Link href='/Perfil' className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:opacity-70" role="menuitem" tabIndex="-1" id="user-menu-item-0">Meu Perfil</Link>}
                      
                        {!!user && user.userClass == 1 && <Link href="/dashboard" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:opacity-70" role="menuitem">Dashboard</Link> }

                        <button onClick={handleLogout} className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:opacity-70" role="menuitem" tabIndex="-1" id="user-menu-item-2">Sair</button>
                      </div>  
                    }

                    {!user && 
                      <div>
                        <a href="#" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:opacity-70" role="menuitem" tabIndex="-1" id="user-menu-item-0">Entrar</a>
                      </div>  
                    }
                    </div>
                  </div>
                </div>
              </div>
            </div>
       </header>
    )
}
