import React, { useEffect, useRef, useState } from 'react'
import Layout from '../layout'
import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client'
import InputMask from 'react-input-mask';

export default function Telefone({telefone}) {

  const [telefoneAtual, setTelefoneAtual] = useState(telefone.numero)
  const [numero, setNumero]= useState(telefoneAtual)
  
  const [requisição, setRequisição]= useState(false)

  const atualizarTelefone = async () =>{
      try{
        setRequisição(true)
        const response = await fetch('/api/dashboard/updateTelefone',{
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify( { numero } ),
        });
        
        if(response.ok){
          const data = await response.json()

          console.log(data);
          const novoTelefone = data.numero

          setTelefoneAtual(novoTelefone)
          setNumero(novoTelefone)
            
        }else{
            const errorResponse = await response.json();
            throw new Error(errorResponse.message);
        }
      }catch(error){
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
      <div style={{maxWidth:'90vw'}} className='w-full mx-auto px-5'>

        {/* Mensagem de Erro*/}
        <span ref={errorBoxRef} className='absolute bottom-5 right-5 z-30  opacity-0 transition-opacity duration-300 ease-in-out bg-red-400/60 border-2 border-red-500 text-red-200 font-medium rounded-lg inline-block px-2 py-2 my-1'>{errorMessage}</span>

        <div className="bg-zinc-700 rounded-lg  max-w-md">
          <div className="mt-5 p-3">
              <h2 className="text-xl font-medium text-white">Alterar o telefone</h2>
              <div className="mt-3">
                  <p className='text-lg font-medium text-gray-200 py-2'>Telefone atual: <span className='font-normal font-sans text-base text-gray-400'>{!!telefoneAtual && `${telefoneAtual}`}</span></p>
                  <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-500  outline-none sm:max-w-md">
                      <InputMask type="text" value={numero} onChange={e => setNumero(e.target.value) }mask="(99) 99999-9999" name="Telefone" id="Telefone" autoComplete="Telefone" className="block flex-1 border-0 bg-transparent py-1.5 font-sans text-gray-300 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6 pl-2" placeholder="(00) 00000-0000"/>
                  </div>
                  <div className="flex justify-end mt-2">
                    <button disabled={requisição} onClick={atualizarTelefone} className={`bg-gradient-to-r from-pink-600 to-purple-700 text-white rounded-md shadow-md px-2 py-1 transition-all md:hover:opacity-90 ${requisição && 'opacity-80'}`}>Alterar</button>
                  </div>
              </div>
          </div>
        </div>

      

      </div>
    )
}

Telefone.getLayout = function getLayout(page) {
    return (
      <Layout>
        {page}
      </Layout>
    )
}

export async function getServerSideProps(ctx) {
 
  /*  Roteamento/Redirecionamento  */
  const cookies = parseCookies(ctx) //Constante que irá conter a função que verifica se existe um cookie 
  const token = cookies['Authentication.Token'] //Constante que irá conter, se caso houver um, o cookie do token

  if(!token){ //Se não houver um token como cookie, ele irá redirecionar a página home
    return{
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET); //Constante que irá conter os dados de dentro do token
  const userClass = decoded.userClass ////Constante que irá conter a classe do usuário de dentro do token
  if(userClass != 1){ //Se a classe for diferente de 1 (Admin), o usuário será redirecionado a página de login, onde, se ele estiver logado, irá redirecionar a Home.
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }



  const prisma = new PrismaClient()

  const telefone = await prisma.telefone.findFirst({
    where:{id:1}
  })

  return {
      props: {telefone}
  }
}