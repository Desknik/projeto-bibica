import Head from 'next/head'
import Link from 'next/link'

import { useContext, useState } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { parseCookies } from 'nookies'

import localFont from 'next/font/local'
import Navbar from '@/components/Navbar'
const bernadette = localFont({ src: '../../assets/fonts/bernadette.ttf' })

export default function Login() {
    const { signIn } = useContext(AuthContext)

    /* mensagem de erro na autenticação*/

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

  const [userIdentifier, setUserIdentifier] = useState()
  const [password, setPassword] = useState()

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


  // Função para verificar se o valor é um e-mail
  function isEmail(value) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;
    return emailRegex.test(value);
  }

  /* Função que irá mandar os dados do ofrmulário para a api */
  const handleLogin = async (e) => {
    e.preventDefault()
    
    var data
    if(isEmail(userIdentifier)){
      var data = {email: userIdentifier, password}
    }else{
      var data = {nickname: userIdentifier, password}
    }

    try{
      setRequisição(true)
      await signIn(data)
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
        <title>Entrar</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico"/>

      </Head>
      <Navbar/>
      <main className="flex min-h-full items-center justify-center pt-48 px-4 py-12 sm:px-6 lg:px-8">
          <div className="w-full max-w-sm space-y-8 ">
            <div className=''>
              <h2 className={`${bernadette.className} mt-6 text-center text-3xl tracking-tight`} >Logar na minha conta</h2>
             
              <div id="alertErrorMessage" className="fixed z-50 bottom-3 right-3 opacity-0 transition-opacity px-6 py-4 bg-indigo-200  rounded-lg text-blue-500">
                <p>{errorMessage}</p>       
              </div>
         
            </div>
            <div className="mt-8 space-y-6">
              <input type="hidden" name="remember" value="true"/>
              <div className="-space-y-px rounded-md shadow-sm">
                <div>
                  <label htmlFor="user-identifier" className="sr-only">Email</label>
                  <input onChange={e => setUserIdentifier(e.target.value)} maxLength={75} value={userIdentifier} id="user-identifier" name="user-identifier" type="text" autoComplete="user-identifier" required className="relative block w-full bg-white rounded-md mb-5 border-0 py-1.5 px-2 text-gray-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 outline-none focus:z-10 focus:ring-2 focus:ring-inset focus:ring-pink-300 sm:text-sm sm:leading-6" placeholder="Nome de Usuário ou Email"/>
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Senha</label>
                  <input onChange={e => setPassword(e.target.value)} value={password} id="password" name="password" type={showPassword? "text" : "password"} autoComplete="current-password" required className="relative block w-full bg-white rounded-md mb-5 border-0 py-1.5 px-2 text-gray-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 outline-none focus:z-10 focus:ring-2 focus:ring-inset focus:ring-pink-300 sm:text-sm sm:leading-6" placeholder="Senha"/>
                </div>
              </div>

              <div className="flex items-center justify-between">

                <div className="flex items-center">
                  <input onChange={showPass} type="checkbox" name="ShowPass" id="ShowPass"/>
                  <label className='pl-2' htmlFor="ShowPass">Mostrar Senha</label>
                </div>

                <div className="text-sm">
                  <Link href="/Conta/RedefinirSenha" className="block font-medium text-right text-pink-500 hover:text-pink-400">Esqueceu a senha?</Link>
                </div>
              </div>

              <div className='w-full'>
                <button disabled={requisição} onClick={handleLogin} className={`group relative flex w-full justify-center rounded-md bg-pink-500 px-3 py-2 text-sm font-semibold text-white hover:bg-pink-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600 transition-colors ${requisição && 'opacity-70'}`}>
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-pink-400 group-hover:text-pink-300" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                    </svg>
                  </span>
                  Logar-se
                </button>
                <Link href="/singup" className="inline-block font-medium hover:text-pink-400 mt-3">Não tenho uma conta</Link>
              </div>
            </div>
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