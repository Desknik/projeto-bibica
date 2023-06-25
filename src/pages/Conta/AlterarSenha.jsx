import React, {useContext, useRef, useState} from 'react'
import Link from 'next/link';
import jwt from 'jsonwebtoken';
import { parseCookies } from 'nookies'
import { PrismaClient } from "@prisma/client";

import Layout from '../layout'
import Router from 'next/router'
import Head from 'next/head';

export default function Perfil(userData) {


  const [token, setToken] = useState()
  const [email, setEmail] = useState()
  const [newPassword, setNewPassword] = useState()
  const [confirmPassword, setConfirmPassword] = useState()

  const [showPassword, setShowPassword] = useState(false)
  const showPass = (e) => {

    if(e.target.checked){
      setShowPassword(true)
    }
    else{
      setShowPassword(false)
    }

  }
    
  const [requisição, setRequisição] = useState(false)


  const alterarSenha = async () => {
    setRequisição(true)

    try {

      const response = await fetch('/api/users/changePassword', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(
    { email, token, newPassword, confirmPassword }
        ),
      });

      if(response.ok){
        Router.push("/")
      }else{
        const errorResponse = await response.json();
        throw new Error(errorResponse.message);
      }

    } 
    catch (error) {
      handleError(error.message)
    }

    setRequisição(false)
  }

  /* Tratamento de erros */
  const errorBoxRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleError = (error) => { // Função que faz aparecer e sumir o erro
      setErrorMessage(error)
      
      errorBoxRef.current.classList.remove('opacity-0')
      
      setTimeout(() => {
          errorBoxRef.current.classList.add('opacity-0')
      }, 2000);
  }

  return (
    <>
      <Head>
          <title>Alterar Senha</title>
      </Head>
      <div style={{height: '70vh'}} className="flex justify-center items-center px-8">

          {/* Mensagem de Erro*/}
          <span ref={errorBoxRef} className='absolute bottom-5 right-5 z-30  opacity-0 transition-opacity duration-300 ease-in-out bg-red-400/60 border-2 border-red-500 text-red-200 font-medium rounded-lg inline-block px-2 py-2 my-1'>{errorMessage}</span>
          
          <div className="flex flex-col items-center gap-3">
            <h1 className='font-bold text-xl mb-5'>Alterar sua senha</h1>
            <p>Informe os seus dados abaixo para alterar sua senha.</p>
        
            <div className="w-full">
                <div className="w-40 my-5">
                    <div className="flex w-full rounded-md shadow-sm ring-1 ring-inset ring-gray-300  outline-none">
                        <input type="text" value={token} onChange={e => setToken(e.target.value)} maxLength={75} name="codigo" id="codigo" autocomplete="codigo" className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-500 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="Código"/>
                    </div>
                </div>

                <div className="w-full my-5">
                    <div className="flex w-full rounded-md shadow-sm ring-1 ring-inset ring-gray-300  outline-none">
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} maxLength={75} name="email" id="email" autocomplete="email" className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-500 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="Email"/>
                    </div>
                </div>
                
                <div className="w-full my-5">
                    <div className="flex w-full rounded-md shadow-sm ring-1 ring-inset ring-gray-300  outline-none">
                        <input type={showPassword? "text" : "password"} value={newPassword} onChange={e => setNewPassword(e.target.value)} maxLength={75} name="senha" id="password" autocomplete="senha" className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-500 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="Nova Senha"/>
                    </div>
                </div>

                <div className="w-full my-5">
                    <div className="flex w-full rounded-md shadow-sm ring-1 ring-inset ring-gray-300  outline-none">
                        <input type={showPassword? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} maxLength={75} name="confirmar-senha" id="confirmPassword" autocomplete="senha" className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-500 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="Confirmar Senha"/>
                    </div>
                </div>

                <div className="flex items-center">
                    <input onChange={showPass} type="checkbox" name="ShowPass" id="ShowPass"/>
                    <label className='pl-2' htmlFor="ShowPass">Mostrar Senha</label>
                </div>
            </div>

            

            <button disabled={requisição} onClick={() => alterarSenha()} className='w-full px-2 py-1.5 bg-pink-400 rounded-md text-white hover:bg-pink-500'>Recuperar Senha</button>
            
          </div>

          
      </div>
    </>

  )
}

Perfil.getLayout = function getLayout(page) {
    return (
      <Layout>
        {page}
      </Layout>
    )
  }