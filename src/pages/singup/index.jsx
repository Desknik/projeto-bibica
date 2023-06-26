import Head from 'next/head'
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext.js'

//import { sign } from 'jsonwebtoken'
//import { parseCookies } from 'nookies'

import Navbar from '@/components/Navbar'
import localFont from 'next/font/local'
import { parseCookies } from 'nookies'
const bernadette = localFont({ src: '../../assets/fonts/bernadette.ttf' })

export default function Login() {

    const { userRegister } = useContext(AuthContext)

    /* Mensagem de erro na autenticação*/

    const [errorMessage, setErrorMessage] = useState();
    const ErrorMessage = (error) => {
        setErrorMessage(error)
        const alertErrorMessage = document.querySelector('#alertErrorMessage')
        alertErrorMessage.classList.remove('opacity-0')
        alertErrorMessage.classList.add('opacity-100')

        setTimeout(() => {

        alertErrorMessage.classList.remove('opacity-100')
        alertErrorMessage.classList.add('opacity-0')
        
    }, 2000); 
    
  }

  const formatText = (text) => {

    let textoFormatado = text

    textoFormatado = textoFormatado.split(' ').map((palavra) => {
        if (palavra.length > 2) {
          return palavra.charAt(0).toUpperCase() + palavra.slice(1);
        } else {
            return palavra.toLowerCase();
        }
    }).join(' ');

    textoFormatado = textoFormatado.charAt(0).toUpperCase() + textoFormatado.slice(1);

    return textoFormatado
  }

 
  const [nickname, setNickname] = useState()
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [confirmPassword, setConfirmPassword] = useState()

 //Função para mostrar a Senha
  const [showPassword, setShowPassword] = useState(false)
  const showPass = (e) => {

    if(e.target.checked){
      setShowPassword(true)
    }
    else{
      setShowPassword(false)
    }

  }

  /* Função que irá mandar os dados para a api */
  const handleRegister = async (e) => {
    e.preventDefault()

    const data = {nickname, email, password, confirmPassword}

    try{
      setRequisição(true)
      await userRegister(data)
    } 
    catch(error){
      ErrorMessage(error.message)
    }
    setRequisição(false)
  }

  const [requisição, setRequisição] = useState()

  return (
    <>
      <Head>
        <title>Registre-se!</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar/>
      <main className="flex min-h-full items-center justify-center lg:mt-0 md:-mt-20 -mt-28 pt-48 px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-sm space-y-8">
            <div className=''>
              <h2 className={`${bernadette.className} mt-6 text-center text-3xl tracking-tight`} >Criar uma conta</h2>
             
             
              <div id="alertErrorMessage" className="fixed z-50 bottom-3 right-3 opacity-0 transition-opacity px-6 py-3 bg-pink-200  rounded-lg text-pink-400">
                <p>{errorMessage}</p>       
              </div>
         
            </div>
            <form onSubmit={handleRegister} method='POST'  className="mt-8 space-y-4">
              <div className="-space-y-px rounded-md shadow-sm">
                <div>
                  <label htmlFor="nickname" className="sr-only">Usuario</label>
                  <input  onChange={e => setNickname(formatText(e.target.value))} value={nickname} maxLength={40} id="nickname" name="nickname" type="text" required className="relative block w-full bg-white rounded-md mb-5 border-0 py-1.5 px-2 text-gray-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 outline-none focus:z-10 focus:ring-2 focus:ring-inset focus:ring-pink-300 sm:text-sm sm:leading-6" placeholder="Nome de usuário"/>
                </div>

                <div>
                  <label htmlFor="email-address" className="sr-only">Email</label>
                  <input  onChange={e => setEmail(e.target.value)} value={email} maxLength={75} id="email-address" name="email" type="email" autoComplete="email" required className="relative block w-full bg-white rounded-md mb-5 border-0 py-1.5 px-2 text-gray-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 outline-none focus:z-10 focus:ring-2 focus:ring-inset focus:ring-pink-300 sm:text-sm sm:leading-6" placeholder="Email"/>
                </div>

                <div>
                  <label htmlFor="password" className="sr-only">Senha</label>
                  <input onChange={e => setPassword(e.target.value)} value={password} id="password" name="password" type={showPassword? "text" : "password"} autoComplete="current-password" required className="relative block w-full bg-white rounded-md mb-5 border-0 py-1.5 px-2 text-gray-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 outline-none focus:z-10 focus:ring-2 focus:ring-inset focus:ring-pink-300 sm:text-sm sm:leading-6" placeholder="Senha"/>
                </div>

                <div>
                  <label htmlFor="password" className="sr-only">Confirmar senha</label>
                  <input onChange={e => setConfirmPassword(e.target.value)} value={confirmPassword} id="password" name="password" type={showPassword? "text" : "password"} autoComplete="current-password" required className="relative block w-full bg-white rounded-md mb-5 border-0 py-1.5 px-2 text-gray-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 outline-none focus:z-10 focus:ring-2 focus:ring-inset focus:ring-pink-300 sm:text-sm sm:leading-6" placeholder="Confirmar a senha"/>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <input onChange={showPass} type="checkbox" name="ShowPass" id="ShowPass"/>
                  <label className='pl-2' htmlFor="ShowPass">Mostrar Senha</label>
                </div>

                
                <div className="text-sm">
                  <Link href="/login" className="block font-medium text-left text-pink-500 hover:text-pink-400">Já possuo uma conta</Link>
                </div>
              </div>

              

              <div className='w-full'>
                <button disabled={requisição} type='submit' className={`group relative flex w-full justify-center rounded-md bg-pink-500 px-3 py-2 text-sm font-semibold text-white hover:bg-pink-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 transition-colors ${requisição && 'opacity-70'}`}>
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-pink-400 group-hover:text-pink-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Criar conta
                </button>
              </div>
            </form>
          </div>
      </main>
    </>
  )
}

export async function getServerSideProps(ctx) {
  /*  Roteamento/Redirecionamento  */
  const cookies = parseCookies(ctx) //Constante que irá conter a função que verifica se existe um cookie 
   
  const token = cookies['Authentication.Token'] //Constante que irá conter, se caso houver um, o cookie do token
 
  if(token){
    return{
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }
 
  return {
    props: {},
  };
  
 }