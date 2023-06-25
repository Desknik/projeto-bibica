import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from '../../../styles/dashboard/dashboard.module.css'

export default function Header() {
    const router = useRouter() //Função que irá conter dados sobre a rota atual do site
    const currentRoute = router.pathname;
    
    return (
        <div className={`mt-5 py-2 w-full overflow-x-scroll ${styles.scroll} border-b border-neutral-800`}>
            <div className="flex gap-x-3">
                <Link href={'/dashboard/produtos'} className={`cursor-pointer ${currentRoute === '/dashboard/produtos'? 'text-violet-700 font-bold' : 'text-white font-normal'}`}>Produtos</Link>
                <Link href={'/dashboard/produtos/categorias'} className={`cursor-pointer ${currentRoute === '/dashboard/produtos/categorias'? 'text-violet-700 font-bold' : 'text-white font-normal'}`}>Categorias</Link>
                <Link href={'/dashboard/produtos/subcategorias'} className={`cursor-pointer ${currentRoute === '/dashboard/produtos/subcategorias'? 'text-violet-700 font-bold' : 'text-white font-normal'}`}>SubCategorias</Link>
                <Link href={'/dashboard/produtos/unidadesmedida'} className={`cursor-pointer whitespace-nowrap ${currentRoute === '/dashboard/produtos/unidadesmedida'? 'text-violet-700 font-bold' : 'text-white font-normal'}`}>Unidades de Medida</Link>
                <Link href={'/dashboard/produtos/sabores'} className={`cursor-pointer ${currentRoute === '/dashboard/produtos/sabores'? 'text-violet-700 font-bold' : 'text-white font-normal'}`}>Sabores</Link>
                <Link href={'/dashboard/produtos/cores'} className={`cursor-pointer ${currentRoute === '/dashboard/produtos/cores'? 'text-violet-700 font-bold' : 'text-white font-normal'}`}>Cores</Link>
            </div>
        </div>
    )
}
