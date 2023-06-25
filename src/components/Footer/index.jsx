import Link from 'next/link';
import React from 'react'
import {FaFacebookF, FaInstagram, FaWhatsapp} from "react-icons/fa";

export default function Footer() {

  return (
    <footer id='footer' className='bg-neutral-900'>
        <div className='flex flex-col justify-center items-center py-5 text-white'>
            <h2 className='font-bold text-lg text-white my-3'>Doceria Bibica</h2>
                <div className="flex max-md:flex-col items-start gap-10">
                    <div className="flex flex-col md:w-40 max-md:hidden">
                        <h5 className='font-semibold mb-2'>Páginas</h5>
                        <Link href="/Perfil" className='font-extralight md:hover:text-pink-300'>Meu Perfil</Link>
                        <Link href="/Carrinho" className='font-extralight md:hover:text-pink-300'>Carrinho</Link>
                    </div>
                    <div className="flex flex-col md:w-40 max-md:hidden max-md:">
                        <h5 className='font-semibold mb-2'>Explore</h5>
                        <Link href="/Sobre" className='font-extralight md:hover:text-pink-300'>Sobre nós</Link>
                        <Link href="/Produtos" className='font-extralight md:hover:text-pink-300'>Cardápio</Link>
                    </div>
                    <div className="flex flex-col max-md:justify-center max-md:items-center md:w-40">
                        <h5 className='font-semibold mb-2'>Contato</h5>
                        <p className='font-extralight text-start'>11 4002-8922</p>
                        <p className='font-extralight text-start'>Bibica@doceria.com</p>
                    </div>
                </div>

            <div className="sm:w-96 w-3/5 border-b border-b-pink-400 my-5"></div>

            <div className="flex gap-3">
                <a href="#" className='flex justify-center items-center w-10 h-10 rounded-full border-2 border-white transition-all md:hover:border-pink-400 md:hover:text-pink-400 '><FaFacebookF className='text-lg'/></a>
                <a href="#" className='flex justify-center items-center w-10 h-10 rounded-full border-2 border-white transition-all md:hover:border-pink-400 md:hover:text-pink-400 '><FaInstagram className='text-xl'/></a>
                <a href="#" className='flex justify-center items-center w-10 h-10 rounded-full border-2 border-white transition-all md:hover:border-pink-400 md:hover:text-pink-400 '><FaWhatsapp className='text-xl'/></a>
            </div>
            <p className='font-light text-sm text-center mt-3'>Bibica &copy; 2023. Todos os direitos reservados.</p>



        </div>
    </footer>
  )
}