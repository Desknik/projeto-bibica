import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import Link from 'next/link';
import Logo from '../../../assets/img/logo/logo.svg'
import {RxDashboard} from "react-icons/rx";
import {TbClipboardText, TbBoxSeam} from "react-icons/tb";
import {FaCalendarAlt, FaUsers} from "react-icons/fa";
import {BsKanban, BsFillTelephoneFill, BsFlower3} from "react-icons/bs";
import {BiCake, BiExit} from "react-icons/bi";

import { useRouter } from 'next/router'
import { ScrollLink } from 'react-scroll';

export default function Sidebar({openMenuHamburguer, setOpenMenuHamburguer}) {

    const router = useRouter()
    const currentRoute = router.pathname;

    return (
        <>
            <div className='xl:block hidden relative top-0 left-0 h-sreen px-2 bg-zinc-800 '>
                <div className="flex-col">
                    <div className="flex flex-col justify-center items-center">

                        <div className="mt-5 pb-4">
                            <Image className='w-12' src={Logo} alt='Logo'></Image>
                        </div>
                    
                        <div className="">
                            <div className="border-y-2 border-zinc-700 pt-5 mb-5">
                                <Link href={'/dashboard'} className={`flex flex-col justify-center mb-5 items-center transition-all hover:scale-105 hover:text-violet-500 ${currentRoute === `/dashboard`? 'text-violet-500' : 'text-zinc-500' }`}>
                                    <RxDashboard className='text-3xl'/>
                                    <span className='font-normal text-sm'>Painel</span>
                                </Link>

                                <Link href={'/dashboard/pedidos'} className={`flex flex-col justify-center mb-5 items-center transition-all hover:scale-105 hover:text-violet-500 ${currentRoute.startsWith(`/dashboard/pedidos`)? 'text-violet-500' : 'text-zinc-500' }`}>
                                    <TbClipboardText className='text-4xl'/>
                                    <span className='font-normal text-sm'>Pedidos</span>
                                </Link>

                                <Link href={'/dashboard/usuarios'} className={`flex flex-col justify-center mb-5 items-center transition-all hover:scale-105 hover:text-violet-500 ${currentRoute.startsWith(`/dashboard/usuarios`)? 'text-violet-500' : 'text-zinc-500' }`}>
                                    <FaUsers className='text-4xl'/>
                                    <span className='font-normal text-sm'>Usuarios</span>
                                </Link>

                                <Link href={'/dashboard/produtos'} className={`flex flex-col justify-center mb-5 items-center transition-all hover:scale-105 hover:text-violet-500 ${currentRoute.startsWith(`/dashboard/produtos`)? 'text-violet-500' : 'text-zinc-500' }`}>
                                    <TbBoxSeam className='text-4xl'/>
                                    <span className='font-normal text-sm'>Produtos</span>
                                </Link>

                                <Link href={'/dashboard/decoracoes'} className={`flex flex-col justify-center mb-5 items-center transition-all hover:scale-105 hover:text-violet-500 ${currentRoute.startsWith(`/dashboard/decoracoes`)? 'text-violet-500' : 'text-zinc-500' }`}>
                                    <BiCake className='text-3xl'/>
                                    <span className='font-normal text-sm'>Decorações</span>
                                </Link>

                            </div>

                            <div className="">
                                <Link href={'/dashboard/telefone'} className={`flex flex-col justify-center mb-5 items-center transition-all hover:scale-105 hover:text-violet-500 ${currentRoute.startsWith(`/dashboard/telefone`)? 'text-violet-500' : 'text-zinc-500' }`}>
                                    <BsFillTelephoneFill className='text-3xl'/>
                                    <span className='font-normal text-center text-sm'>Telefone</span>
                                </Link>
                                <div className="hidden">
                                    <Link href={{}} className={`flex flex-col justify-center mb-5 items-center transition-all hover:scale-105 hover:text-violet-500 ${currentRoute === `/dashboard/`? 'text-violet-500' : 'text-zinc-500' }`}>
                                        <FaCalendarAlt className='text-2xl'/>
                                        <span className='font-normal text-sm'>Calendário</span>
                                    </Link>

                                    <Link href={{}} className={`flex flex-col justify-center mb-5 items-center transition-all hover:scale-105 hover:text-violet-500 ${currentRoute === `/dashboard/`? 'text-violet-500' : 'text-zinc-500' }`}>
                                        <BsKanban className='text-2xl'/>
                                        <span className='font-normal text-sm'>Kanban</span>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        <div className="absolute w-full h-14 flex flex-col justify-center items-center bg-zinc-800 bottom-0">
                            <Link href={'/'} className='transition-all hover:scale-105'> 
                                <BiExit className='text-3xl text-violet-500'/>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu, show/hide based on menu open state.*/} 
            <div className={`${!openMenuHamburguer && 'hidden'} xl:hidden z-50`} role="dialog" aria-modal="true">
               {/* Background backdrop, show/hide based on slide-over state.*/}
              <div className="fixed inset-0 z-10 bg-gray-800/30 backdrop-blur-sm"></div>

              <div className="fixed inset-y-0 left-0 z-10 w-full overflow-y-auto bg-zinc-800 px-6 py-6 sm:max-w-xs sm:ring-1 sm:ring-gray-900/10">
                <div className="flex items-center justify-end">
                  <button onClick={() => setOpenMenuHamburguer(false)} type="button" className="-m-2.5 rounded-md p-2.5 text-gray-500">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flow-root">
                    <div className="-my-6 divide-y divide-gray-500/30">
                        <div className="">
                            <div className="border-b-2 border-zinc-700 pt-5 mb-5">
                                <Link onClick={() => setOpenMenuHamburguer(false)} href={'/dashboard'} className={`flex gap-1 mb-5 items-center hover:text-violet-500 ${currentRoute === `/dashboard`? 'text-violet-500' : 'text-zinc-500' }`}>
                                    <RxDashboard className='text-3xl'/>
                                    <span className='font-normal text-lg'>Painel</span>
                                </Link>

                                <Link onClick={() => setOpenMenuHamburguer(false)} href={'/dashboard/pedidos'} className={`flex gap-1 mb-5 items-center hover:text-violet-500 ${currentRoute.startsWith(`/dashboard/pedidos`)? 'text-violet-500' : 'text-zinc-500' }`}>
                                    <TbClipboardText className='text-3xl'/>
                                    <span className='font-normal text-lg'>Pedidos</span>
                                </Link>

                                <Link onClick={() => setOpenMenuHamburguer(false)} href={'/dashboard/usuarios'} className={`flex gap-1 mb-5 items-center hover:text-violet-500 ${currentRoute.startsWith(`/dashboard/usuarios`)? 'text-violet-500' : 'text-zinc-500' }`}>
                                    <FaUsers className='text-3xl'/>
                                    <span className='font-normal text-lg'>Usuarios</span>
                                </Link>

                                <Link onClick={() => setOpenMenuHamburguer(false)} href={'/dashboard/produtos'} className={`flex gap-1 mb-5 items-center hover:text-violet-500 ${currentRoute.startsWith(`/dashboard/produtos`)? 'text-violet-500' : 'text-zinc-500' }`}>
                                    <TbBoxSeam className='text-3xl'/>
                                    <span className='font-normal text-lg'>Produtos</span>
                                </Link>

                                <Link onClick={() => setOpenMenuHamburguer(false)} href={'/dashboard/decoracoes'} className={`flex gap-1 mb-5 items-center hover:text-violet-500 ${currentRoute.startsWith(`/dashboard/decoracoes`)? 'text-violet-500' : 'text-zinc-500' }`}>
                                    <BiCake className='text-3xl'/>
                                    <span className='font-normal text-lg'>Decorações</span>
                                </Link>
                            </div>

                            <div className="">
                                <Link onClick={() => setOpenMenuHamburguer(false)} href={'/dashboard/telefone'} className={`flex gap-1 mb-5 items-center hover:text-violet-500 ${currentRoute.startsWith(`/dashboard/telefone`)? 'text-violet-500' : 'text-zinc-500' }`}>
                                    <BsFillTelephoneFill className='text-3xl'/>
                                    <span className='font-normal text-lg'>Alterar Telefone</span>
                                </Link>

                                <div className="hidden">
                                    <Link onClick={() => setOpenMenuHamburguer(false)} href={{}} className={`flex gap-1 mb-5 items-center hover:text-violet-500 ${currentRoute === `/dashboard/`? 'text-violet-500' : 'text-zinc-500' }`}>
                                        <FaCalendarAlt className='text-3xl'/>
                                        <span className='font-normal text-lg'>Calendário</span>
                                    </Link>

                                    <Link onClick={() => setOpenMenuHamburguer(false)} href={{}} className={`flex gap-1 mb-5 items-center hover:text-violet-500 ${currentRoute === `/dashboard/`? 'text-violet-500' : 'text-zinc-500' }`}>
                                        <BsKanban className='text-3xl'/>
                                        <span className='font-normal text-lg'>Kanban</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="absolute left-3 bottom-3">
                        <Image className='w-8' src={Logo} alt='Logo'></Image>
                    </div>
                </div>
              </div>
            </div>
        </>
        
    )
}
