import React from 'react'
import Link from 'next/link';
import styles from '../../styles/dashboard/dashboard.module.css'
import { useRouter } from 'next/router';

export default function Navbar() {
    const router = useRouter() //Função que irá conter dados sobre a rota atual do site
    const currentRoute = router.pathname;

    return (
        <div className="lg:col-span-1 max-lg:col-span-4 max-lg:mt-3">
            <div className={`w-full max-lg:overflow-x-scroll max-lg:pb-1 ${styles.scroll}`}>
                <div className="flex lg:flex-col gap-3">
                    <Link href='/Perfil' className={`-mx-3 block rounded-lg px-3  text-base font-semibold whitespace-nowrap leading-7 hover:opacity-70 ${currentRoute === '/Perfil'? 'text-pink-500 font-bold' : 'text-black font-normal'}`}>Minha Conta</Link>
                    <Link href='/Perfil/Pedidos' className={`-mx-3 block rounded-lg px-3  text-base font-semibold whitespace-nowrap leading-7 hover:opacity-70 ${currentRoute === '/Perfil/Pedidos'? 'text-pink-500 font-bold' : 'text-black font-normal'}`}>Meus Pedidos</Link>
                    <span className='max-lg:hidden border-b border-b-gray-300 py-1'></span>
                    <Link href='/Perfil/Dados' className={`-mx-3 block rounded-lg px-3  text-base font-semibold whitespace-nowrap leading-7 hover:opacity-70 ${currentRoute === '/Perfil/Dados'? 'text-pink-500 font-bold' : 'text-black font-normal'}`}>Meus Dados</Link>
                </div>
            </div>
        </div>
    )
}
