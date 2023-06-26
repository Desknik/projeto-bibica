import React, {useContext, useEffect, useRef, useState} from 'react'
import Router, { useRouter } from 'next/router'
import Link from 'next/link';
import jwt from 'jsonwebtoken';
import { parseCookies } from 'nookies'
import { PrismaClient } from "@prisma/client";
import InputMask from 'react-input-mask';
import { format } from 'date-fns';

import Layout from '../layout'
import { AuthContext } from '../../contexts/AuthContext'
import Head from 'next/head';
import Navbar from '@/components/PerfilHeader';

export default function Perfil(userData) {

    const router = useRouter();
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (router.query.success === 'true') {
          setSuccess(true)

          setTimeout(() => {
            setSuccess(false)
          }, 5000);
        }
      }, [router.query]);

    const { user } = useContext(AuthContext)

    const [ nickname, setNickname ] = useState(userData.userData.nickname)
    const [ email, setEmail ] = useState(userData.userData.email)
    const [ nome, setNome ] = useState(userData.userData.dados.nome)
    const [ telefone, setTelefone ] = useState(userData.userData.dados.telefone)
    const [ cep, setCep ] = useState(userData.userData.dados.cep)
    const [ endereco, setEndereco ] = useState(userData.userData.dados.endereco)
    const [ cidade, setCidade ] = useState(userData.userData.dados.cidade)
    const [ bairro, setBairro ] = useState(userData.userData.dados.bairro)
    const [ uf, setUf ] = useState(userData.userData.dados.uf)
    const [ numCasa, setNumCasa ] = useState(userData.userData.dados.numCasa)
    const [ complemento, setComplemento ] = useState(userData.userData.dados.complemento)

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

    const textToUpper = (text) => {
        return text.toUpperCase();
    }

    const getAddress = async () => {
    
        const cepSemHifen = cep.replace(/-/g, "");

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cepSemHifen}/json/`);
            const data = await response.json();
        
            if (response.ok) {
              const { logradouro, bairro, localidade, uf, complemento } = data;

              setEndereco(logradouro)
              setCidade(localidade)
              setBairro(bairro)
              setUf(uf)
              setComplemento(complemento)
            } 
            else {
                const errorResponse = await response.json();
                throw new Error(errorResponse.message);
            }
          } catch (error) {
                handleError("CEP INVÁLIDO")
          }

    }

    const updateData = async () => {

        try{
            setRequisição(true)
            const response = await fetch('/api/users/updateData',{
                method: 'PUT',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify( { id:user.id, nickname, email, nome, telefone, cep, endereco, cidade, bairro, uf, numCasa, complemento  } ),
            });
            
            if(response.ok){
                Router.push({
                    pathname: "/Perfil/Dados",
                    query: { success: true }
                });
                
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

    const [requisição, setRequisição] = useState()

  return (
    <>
        <Head>
            <title>Meus Dados</title>
        </Head>
        {!success && !!user && !user.CompletedDetails && 
            <div className="flex justify-center items-center w-full h-8 bg-red-400/50">
                <p className='text-white font-medium'>Atualize seus dados para poder consumir nossos serviços</p>
            </div>
        }

        {success && 
            <div className="flex justify-center items-center w-full h-8 bg-green-400/40">
                <p className='text-white font-semibold'>Dados atualizados com sucesso!</p>
            </div>
        }
    
        <div className="grid grid-cols-4 gap-x-10 w-full lg:px-28 px-8 my-5">
            <Navbar/> 

            {/* Mensagem de Erro*/}
            <span ref={errorBoxRef} className='absolute bottom-5 right-5 z-30  opacity-0 transition-opacity duration-300 ease-in-out bg-red-400/60 border-2 border-red-500 text-red-200 font-medium rounded-lg inline-block px-2 py-2 my-1'>{errorMessage}</span>

            <div className='lg:col-span-3 col-span-4 max-lg:mt-3'>
                <div className="space-y-12">
                    <div className="pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Meus Dados</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">Atualize os dados da sua conta</p>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8 ">
                            <div className="sm:col-span-4">
                                <label for="nickname" className="block text-sm font-medium leading-6 text-gray-900">Nome de Usuário</label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300  outline-none sm:max-w-md">
                                        <input type="text" value={nickname} onChange={e => setNickname(formatText(e.target.value))} maxLength={40} name="nickname" id="nickname" autocomplete="nickname" className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-500 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="Nome"/>
                                    </div>
                                </div>
                            </div>

                            <div className="sm:col-span-4">
                                <label for="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300  outline-none sm:max-w-md">
                                        <input type="email" disabled value={email} onChange={e => setEmail(e.target.value)} maxLength={75} name="email" id="email" autocomplete="email" className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-500 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="Email"/>
                                    </div>
                                </div>
                            </div>

                            <div className="sm:col-span-4">
                                <label for="nome" className="block text-sm font-medium leading-6 text-gray-900">Nome Completo {!!user && !user.CompletedDetails && <span className='text-red-500'>*Campo necessário para compras</span>}</label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300  outline-none sm:max-w-md">
                                        <input type="text" value={nome} onChange={e => setNome(e.target.value)} name="nome" id="nome" autocomplete="nome" className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-500 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="Nome Completo"/>
                                    </div>
                                </div>
                            </div>

                            <div className="sm:col-span-4">
                                <label for="telefone" className="block text-sm font-medium leading-6 text-gray-900">Telefone {!!user && !user.CompletedDetails && <span className='text-red-500'>*Campo necessário para compras</span>}</label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300  outline-none sm:max-w-md">
                                        <InputMask type="text" value={telefone} onChange={e => setTelefone(e.target.value)} mask="(99) 99999-9999" name="telefone" id="telefone" autocomplete="telefone" className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-500 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="(00) 00000-0000"/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10">
                            <h2 className="text-base font-semibold leading-7 text-gray-900">Endereços Cadastrado</h2>
                            <p className="mt-1 text-sm leading-6 text-gray-600">Altere o endereço cadastrado para compras com frete</p>
                        </div>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-8">
                            <div className="sm:col-span-4">
                                <label for="cep" className="block text-sm font-medium leading-6 text-gray-900">CEP</label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300  outline-none sm:max-w-md">
                                        <InputMask type="text" value={cep} onBlur={getAddress} onDragEnter={getAddress} onChange={e => setCep(e.target.value)} mask="99999-999" name="cep" id="cep" autocomplete="cep" className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-500 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="00000-000"/>
                                    </div>
                                </div>
                            </div>

                            <div className="sm:col-span-4">
                                <label for="endereco" className="block text-sm font-medium leading-6 text-gray-900">Endereço</label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300  outline-none sm:max-w-md">
                                        <input type="text" value={endereco} onChange={e => setEndereco(e.target.value)} name="endereco" id="endereco" autocomplete="endereco" className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-500 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="Endereço"/>
                                    </div>
                                </div>
                            </div>

                            <div className="sm:col-span-4">
                                <label for="cidade" className="block text-sm font-medium leading-6 text-gray-900">Cidade</label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300  outline-none sm:max-w-md">
                                        <input type="text" value={cidade} onChange={e => setCidade(e.target.value)} maxLength={40} name="cidade" id="cidade" autocomplete="cidade" className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-500 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="Cidade"/>
                                    </div>
                                </div>
                            </div>

                            <div className="sm:col-span-4">
                                <label for="bairro" className="block text-sm font-medium leading-6 text-gray-900">Bairro</label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300  outline-none sm:max-w-md">
                                        <input type="text" value={bairro} onChange={e => setBairro(e.target.value)} maxLength={40} name="bairro" id="bairro" autocomplete="bairro" className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-500 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="Bairro"/>
                                    </div>
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label for="uf" className="block text-sm font-medium leading-6 text-gray-900">UF</label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300  outline-none">
                                        <InputMask type="text" value={uf} onChange={e => setUf(textToUpper(e.target.value))} mask="aa" name="uf" id="uf" autocomplete="uf" className="w-full border-0 bg-transparent py-1.5 pl-1 text-gray-500 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="UF"/>
                                    </div>
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label for="numCasa" className="block text-sm font-medium leading-6 text-gray-900">Número da Casa</label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 outline-none sm:max-w-md">
                                        <input type="text" value={numCasa} onChange={e => setNumCasa(e.target.value)} maxLength={5} name="numCasa" id="numCasa" autocomplete="numCasa" className="w-full border-0 bg-transparent py-1.5 pl-1 text-gray-500 placeholder:text-gray-400 sm:text-sm sm:leading-6" placeholder="Nº Casa"/>
                                    </div>
                                </div>
                            </div>

                            <div className="sm:col-span-4">
                                <label for="complemento" className="block text-sm font-medium leading-6 text-gray-900">Complemento <span className='text-gray-400'>(opcional)</span></label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300  outline-none sm:max-w-md">
                                        <input type="text" value={complemento} onChange={e => setComplemento(e.target.value)} maxLength={40} name="complemento" id="complemento" autocomplete="complemento" className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-500 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="Complemento"/>
                                    </div>
                                </div>
                            </div>


                        </div>

                        <div className="flex justify-end">
                            <button disabled={requisição} onClick={updateData} className={`mt-5 px-2 py-1.5 bg-pink-400 rounded-md text-white hover:bg-pink-500 ${requisição && 'opacity-70'}`}>Atualizar dados</button>
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
    include:{dados: true},
  });

  const formattedUserData = {
    ...userData,
    dataExpiracaoToken: userData.dataExpiracaoToken ? format(userData.dataExpiracaoToken, 'yyyy-MM-dd HH:mm:ss') : null,
  };

  prisma.$disconnect()

  return {
    props: {userData:formattedUserData},
  };
    
  }

Perfil.getLayout = function getLayout(page) {
    return (
      <Layout>
        {page}
      </Layout>
    )
  }