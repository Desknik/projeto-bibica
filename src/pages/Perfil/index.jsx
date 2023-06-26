import React, {useContext, useState} from 'react'
import Link from 'next/link';
import jwt from 'jsonwebtoken';
import { parseCookies } from 'nookies'
import { PrismaClient } from "@prisma/client";

import Layout from '../layout'
import { AuthContext } from '../../contexts/AuthContext'
import Head from 'next/head';

import Navbar from '@/components/PerfilHeader';

export default function Perfil({userData}) {

  const { user } = useContext(AuthContext)


  return (
    <>
      <Head>
          <title>Minha Conta</title>
      </Head>


      {!!user && !user.CompletedDetails && 
          <div className="flex justify-center items-center w-full h-8 bg-red-400/50">
              <p className='text-white font-medium'>Atualize seus dados para poder consumir nossos serviços</p>
          </div>
      }

      <div style={{height: '70vh'}}>
        <div  className="grid grid-cols-4 gap-x-10 w-full lg:px-28 px-8 my-5">
          <Navbar/> 
          <div className='lg:col-span-3 col-span-4 max-lg:mt-3'>
              <div>
                  <div className="border-b border-gray-900/10 pb-3">
                      <h2 className="text-base font-semibold leading-7 text-gray-900">Minha Conta</h2>
                      <p className="mt-1 text-sm leading-6 text-gray-600">Informações da sua conta</p>

                  </div>

                  <div className="flex flex-col gap-5 mt-3">
                      <div className="">
                          <span className="block text-sm font-medium leading-6 text-gray-900">Nome de Usuario</span>
                          <p>{userData.nickname}</p>
                      </div>

                      <div className="">
                          <span className="block text-sm font-medium leading-6 text-gray-900">Email</span>
                          <p>{userData.email}</p>
                      </div>
                  </div>

                  <div className="mt-6 flex items-center justify-start gap-x-3">
                      <Link href='/Perfil/Dados' className="text-sm font-semibold leading-6 text-pink-400 rounded-md px-3 py-1.5 hover:bg-pink-400 hover:text-white border border-pink-400 shadow-sm">Editar Dados</Link>
                      <Link href='/Conta/RedefinirSenha' className="rounded-md bg-pink-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-500 border">Alterar a senha</Link>
                  </div>
              </div>
          </div>
        </div>
      </div>
      
    </>

  )
}


export async function getServerSideProps(ctx) {
    
    /*  Roteamento/Redirecionamento  */
  const cookies = parseCookies(ctx) //Constante que irá conter a função que verifica se existe um cookie 
   
  const token = cookies['Authentication.Token'] //Constante que irá conter, se caso houver um, o cookie do token
 
  if(!token){
    return{
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET); //Irá pegar o dados encriptados pelo token (tipo uma filtragem)
  const userClass = decoded.userClass ////Constante que irá conter a classe do usuário de dentro do token
  
  if(userClass != 2){ //Se a classe for diferente de 1 (Admin), o usuário será redirecionado a página de login, onde, se ele estiver logado, irá redirecionar a Home.
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  /* Acesso aos dados do usuário*/

  const prisma = new PrismaClient()

  const id = decoded.id; // Pega o ID atrávés do token
 
  const userData = await prisma.usuario.findUnique({
    where: { id: id },
    select:{
      nickname:true,
      email:true
    }
  });
  prisma.$disconnect()

  return {
    props: {userData},
  };
    
  }

Perfil.getLayout = function getLayout(page) {
    return (
      <Layout>
        {page}
      </Layout>
    )
  }