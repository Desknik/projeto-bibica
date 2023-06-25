import React, { useContext, useEffect, useRef, useState } from 'react'
import Layout from '../layout'
import styles from '../../../styles/dashboard/dashboard.module.css'

import { CgDetailsMore } from 'react-icons/cg'
import { BsEye, BsEyeFill, BsEyeSlash, BsFilter } from 'react-icons/bs'

import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client'
import Modal from '@/components/Modal'
import ListBox from '@/components/ListBox'
import { FaRegUser, FaUserAlt } from 'react-icons/fa'
import { AuthContext } from '@/contexts/AuthContext'


function Search({list, setFilteredList }) {

  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
      handleSearch()
  },[list])

  const handleSearch = async (e) => { // Função que busca filtra os dados de uma lista pela informação da barra de pesquisa

      if (searchValue == ""){
          setFilteredList(list);
      }
      else if(!isNaN(searchValue)){
          setFilteredList(list.filter(item => item.id == searchValue))
      }
      else{
        setFilteredList(list.filter(item => (item.nickname.toUpperCase().includes(searchValue.trim().toUpperCase())) ||  (!!item.dados.nome &&  item.dados.nome.toUpperCase().includes(searchValue.trim().toUpperCase()))))
      }

  };

  return (
      <div className="relative  max-sm:w-full">
          <input
              className={`appearance-none max-sm:w-full sm:w-8 h-10 pl-10 bg-zinc-800 text-zinc-400 rounded-md  py-2 px-1 leading-tight transition-all lg:hover:bg-zinc-700 sm:focus:w-40 focus:outline-none focus:border-gray-400 focus:shadow-outline`}
              id="categoria"
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onBlur={handleSearch}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Procurar..."
          />
          <div className="absolute pointer-events-none left-0 inset-y-0 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 ml-2.5 text-gray-400 lg:hover:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
          </div>
      </div>
  )
}

export default function Pedidos({Usuarios}) {

  const { userRegister } = useContext(AuthContext)


  const [usuarios, setUsuarios] = useState(Usuarios)

  const updateUsers = async (pedido, situacao) => {

    try {
      // Montar o objeto com as informações a serem enviadas para a API
  
      // Enviar a requisição para a API
      const response = await fetch('/api/dashboard/getUsers', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      if (response.ok) {
        const data = await response.json()

        setUsuarios(data.Usuarios)
      } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message);
      }
    } catch (error) {
      handleError(error.message)
    }
    
  }


  function obterPrimeiroNome(nomeCompleto) {
    const nomes = nomeCompleto.split(' ');
    return nomes[0];
  }


  /* Funções básicas*/
  const formatarValorMonetario = (valor) => {
    const valorFormatado = parseFloat(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return valorFormatado;
  }

  function formatarData(dataString) {
    const data = new Date(dataString);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = String(data.getFullYear());
    return `${dia}/${mes}/${ano}`;
  }

  // Filtragem 

  const [selectedFilteredSituacao, setSelectedFilteredSituacao] = useState()

  const[filteredUsuarios, setFilteredUsuarios] = useState(usuarios)
  const[searchFilteredProdutos, setSearchFilteredProdutos] = useState(filteredUsuarios)
  const [visibility, setVisibility] = useState(1)

  useEffect(() => {


    if(visibility == 2){ //Filtra pela disponibilidade (pelo RadioGroup)
      setFilteredUsuarios(usuarios.filter((usuario) => usuario.classeUsuarioId == 1));
    }
    else if(visibility == 3){
      setFilteredUsuarios(usuarios.filter((usuario) => !usuario.classeUsuarioId == 1));
    }
    else{
      setFilteredUsuarios(usuarios)
    }

  },[usuarios, visibility,])

  /* Cadastrar Admins */
  const [adminModal, setAdminModal] = useState(false)

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
  
  const [requisição, setRequisição] = useState(false)
  
  /* Função que irá mandar os dados para a api */
  const adminRegister = async () => {
    setRequisição(true)
    let userClass = 1

    const data = {nickname, email, password, confirmPassword, userClass}

    try{
      await userRegister(data)
      updateUsers()
    } 
    catch(error){
      handleError(error.message)
    }
    setRequisição(false)
  }

  /* Manipular Usuários */
  const [userModal, setUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState()
  const [removeAccess, setRemoveAccess] = useState(false)
  const [ban, setBan] = useState(false)

  
  const openModal = usuario => {
    setSelectedUser(usuario)
    setUserModal(true)
  }

  const updateUser = async () => {

    setRequisição(true)

    try {  
      setRequisição(true)

      const response = await fetch('/api/dashboard/updateUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          removeAccess,
          ban
        }),
      });
  
      if (response.ok) {
        updateUsers()
        setUserModal(false)
      }else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message);
      }
    } catch (error) {
      handleError(error.message)
    }

    setUserModal(false)
    setRequisição(false)
  }


  /* Funções Básicas */
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

      <Modal tittle={'Adicionar Adminstrador'} isOpen={adminModal} onClose={() => setAdminModal(false)}>
        <div className="">
          <div className="flex flex-col gap-3">
            <div>
              <label htmlFor="nickname">Usuario</label>
              <input  onChange={e => setNickname(formatText(e.target.value))} value={nickname} maxLength={40} id="nickname" name="nickname" type="text" required className="relative block w-full bg-white rounded-md border-0 py-1.5 px-2 text-gray-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 outline-none focus:z-10 focus:ring-2 focus:ring-inset focus:ring-pink-300 sm:text-sm sm:leading-6" placeholder="Nome de usuário"/>
            </div>

            <div>
              <label htmlFor="email-address">Email</label>
              <input  onChange={e => setEmail(e.target.value)} value={email} maxLength={75} id="email-address" name="email" type="email" autoComplete="email" required className="relative block w-full bg-white rounded-md border-0 py-1.5 px-2 text-gray-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 outline-none focus:z-10 focus:ring-2 focus:ring-inset focus:ring-pink-300 sm:text-sm sm:leading-6" placeholder="Email"/>
            </div>

            <div>
              <label htmlFor="password">Senha</label>
              <input onChange={e => setPassword(e.target.value)} value={password} id="password" name="password" type={showPassword? "text" : "password"} autoComplete="current-password" required className="relative block w-full bg-white rounded-md border-0 py-1.5 px-2 text-gray-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 outline-none focus:z-10 focus:ring-2 focus:ring-inset focus:ring-pink-300 sm:text-sm sm:leading-6" placeholder="Senha"/>
            </div>

            <div>
              <label htmlFor="password">Confirmar Senha</label>
              <input onChange={e => setConfirmPassword(e.target.value)} value={confirmPassword} id="password" name="password" type={showPassword? "text" : "password"} autoComplete="current-password" required className="relative block w-full bg-white rounded-md border-0 py-1.5 px-2 text-gray-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 outline-none focus:z-10 focus:ring-2 focus:ring-inset focus:ring-pink-300 sm:text-sm sm:leading-6" placeholder="Confirmar a senha"/>
            </div>

            <div className="flex items-center">
              <input onChange={showPass} type="checkbox" name="ShowPass" id="ShowPass"/>
              <label className='pl-2' htmlFor="ShowPass">Mostrar Senha</label>
            </div>
          </div>

          <button disabled={requisição} onClick={adminRegister} className={`w-full rounded-md shadow-md mt-3 px-2 py-2.5 transition-colors ${!requisição? 'bg-pink-400 text-white md:hover:bg-pink-500' : 'bg-pink-300 text-gray-200'}`}>Adicionar Administrador</button>

        </div>
      </Modal>

      <Modal tittle={'Manipular Usuário'} isOpen={userModal} onClose={() => setUserModal(false)}>
        <div className="">
          {!!selectedUser && 
            <div className="">
              <p className='text-base font-medium'>Código Cliente: <span className='font-normal'>{selectedUser.id}</span></p>
              <p className='text-base font-medium'>Usuário: <span className='font-normal'>{selectedUser.nickname}</span></p>
              <p className='text-base font-medium'>Tipo de Usuário: <span className='font-normal'>{selectedUser.classeUsuarioId == 1? 'Administrador' : 'Cliente'}</span></p>
              {selectedUser.classeUsuarioId == 1 && 
                <div className="">
                   <div className="flex items-center gap-1">
                      <p className='text-base font-medium'>Remover Acesso: </p>
                      <input onChange={e => e.target.checked? (setRemoveAccess(true)) : (setRemoveAccess(false))} checked={removeAccess} type="checkbox" name="ShowPass" id="ShowPass"/>
                    </div>
                </div>
              }
              <div className="flex items-center gap-1">
                <p className='text-base font-medium'>Banir: </p>
                <input onChange={e => e.target.checked? (setBan(true)) : (setBan(false))} checked={ban} type="checkbox" name="ShowPass" id="ShowPass"/>
              </div>
            </div>
          }

          <button disabled={requisição} onClick={updateUser} className={`w-full rounded-md shadow-md mt-3 px-2 py-2.5 transition-colors ${!requisição? 'bg-pink-400 text-white md:hover:bg-pink-500' : 'bg-pink-300 text-gray-200'}`}>Atualizar Dados</button>

        </div>
      </Modal>

      <div className="flex justify-between items-end flex-wrap mt-3">
          <button onClick={() => setAdminModal(true)} className='bg-gradient-to-r from-purple-700 to-pink-500 rounded-br-lg rounded-tl-lg text-white font-semibold py-2 px-3 transition-all lg:hover:scale-105 max-sm:w-full max-sm:mb-5'>Adicionar Adminstrador</button>

          <div className="flex flex-wrap gap-3 items-end max-sm:w-full">
              <Search list={filteredUsuarios} setFilteredList={setSearchFilteredProdutos}/>
              <div className="flex flex-wrap gap-3 items-end max-sm:w-full">
                <div className="flex flex-wrap gap-3 items-end max-sm:w-full max-sm:order-2">
                  <button className="flex justify-center items-center h-10  px-3  bg-zinc-800 rounded-lg cursor-pointer lg:hover:bg-zinc-700" onClick={() => {visibility != 3? setVisibility(prevCount => prevCount + 1) : setVisibility(1)}}>
                      {visibility == 1?
                          <FaUserAlt className='text-zinc-300 text-xl'/>
                          : visibility == 2?
                          <FaRegUser className='text-green-400 text-xl'/>
                          : visibility == 3 &&
                          <FaRegUser className='text-red-400 text-xl'/>
                      }
                  </button>
                </div>
                

              </div>
          </div>
      </div>

      <div className={`w-full h-96 rounded-lg bg-zinc-800 mt-5 overflow-scroll ${styles.scroll}`}>
        <table className='w-full font-sans'>
          <thead className='sticky top-0 bg-zinc-900'>
            <tr>
              <th scope='col' className='border-r border-neutral-700 text-lg font-medium text-gray-300 px-6 py-2 text-left'>#</th>
              <th scope='col' className='border-r border-neutral-700 text-lg font-medium text-gray-300 px-6 py-2 text-left'>Usuario</th>
              <th scope='col' className='border-r border-neutral-700 whitespace-nowrap text-lg text-center font-medium text-gray-300 px-6 py-2 text-left'>Tipo</th>
              <th scope='col' className='border-r border-neutral-700 text-lg font-medium text-gray-300 px-6 py-2 text-left'>Nome</th>
              <th scope='col' className='border-r border-neutral-700 whitespace-nowrap text-lg font-medium text-gray-300 px-6 py-2 text-left'>Email</th>
              <th scope='col' className='border-r border-neutral-700 whitespace-nowrap text-lg font-medium text-gray-300 px-6 py-2 text-left'>Telefone</th>
              <th scope='col' className='border-r border-neutral-700 whitespace-nowrap text-lg font-medium text-gray-300 px-6 py-2 text-center'>Pedidos</th>
              <th scope='col' className='border-r border-neutral-700 whitespace-nowrap text-lg font-medium text-gray-300 px-6 py-2 text-left'>Cep</th>
              <th scope='col' className='border-r border-neutral-700 text-lg font-medium text-gray-300 px-6 py-2 text-left'>Endereço</th>
              <th scope='col' className='border-r border-neutral-700 text-lg font-medium text-gray-300 px-6 py-2 text-left'>Bairro</th>
              <th scope='col' className='border-r border-neutral-700 text-lg font-medium text-gray-300 px-6 py-2 text-left'>Cidade</th>
              <th scope='col' className='border-r border-neutral-700 text-lg font-medium text-gray-300 px-6 py-2 text-left'>UF</th>
              <th scope='col' className='border-r border-neutral-700 whitespace-nowrap text-lg text-center font-medium text-gray-300 px-6 py-2 text-left'>Nº Casa</th>
              <th scope='col' className='border-r border-neutral-700 text-lg font-medium text-gray-300 px-6 py-2 text-left'>Complemento</th>
              <th scope='col' className='border-r border-neutral-700 text-lg font-medium text-gray-300 px-6 py-2 text-left'>Banido</th>
            </tr>
          </thead>
          <tbody>
            {searchFilteredProdutos.map(usuarios => (
              <tr onClick={() => openModal(usuarios)} className='even:bg-zinc-700 md:hover:bg-zinc-500 cursor-pointer'>
                <td className='px-6 py-4 whitespace-nowrap text-base font-normal text-gray-400'>{usuarios.id}</td>
                <td className='px-6 py-4 whitespace-nowrap text-base font-normal text-gray-400'>{usuarios.nickname}</td>
                <td className='px-6 py-4 whitespace-nowrap text-base font-normal text-center text-gray-400'>{usuarios.classeUsuarioId == 1? 'Administrador' : 'Cliente'}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-base font-normal text-gray-400 ${!usuarios.dados.nome && 'text-center'}`}>{usuarios.dados.nome? `${usuarios.dados.nome}` : '--'}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-base font-normal text-gray-400 ${!usuarios.email && 'text-center'}`}>{usuarios.email? `${usuarios.email}` : '--'}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-base font-normal text-gray-400 ${!usuarios.dados.telefone && 'text-center'}`}>{usuarios.dados.telefone? `${usuarios.dados.telefone}` : '--'}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-base font-normal text-gray-400 text-center`}>{usuarios.pedidos.length}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-base font-normal text-gray-400 ${!usuarios.dados.cep && 'text-center'}`}>{usuarios.dados.cep? `${usuarios.dados.cep}` : '--'}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-base font-normal text-gray-400 ${!usuarios.dados.endereco && 'text-center'}`}>{usuarios.dados.endereco? `${usuarios.dados.endereco}` : '--'}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-base font-normal text-gray-400 ${!usuarios.dados.bairro && 'text-center'}`}>{usuarios.dados.bairro? `${usuarios.dados.bairro}` : '--'}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-base font-normal text-gray-400 ${!usuarios.dados.cidade && 'text-center'}`}>{usuarios.dados.cidade? `${usuarios.dados.cidade}` : '--'}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-base font-normal text-gray-400 ${!usuarios.dados.uf && 'text-center'}`}>{usuarios.dados.uf? `${usuarios.dados.cidade}` : '--'}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-base text-center font-normal text-gray-400 ${!usuarios.dados.numCasa && 'text-center'}`}>{usuarios.dados.numCasa? `${usuarios.dados.numCasa}` : '--'}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-base text-center font-normal text-gray-400 ${!usuarios.dados.complemento && 'text-center'}`}>{usuarios.dados.complemento? `${usuarios.dados.complemento}` : '--'}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-base text-center font-normal text-gray-400`}>{usuarios.banido? 'Sim' : 'Não'}</td>
               


              </tr>
            ))}
          </tbody>
        </table>
      </div>
    
    </div>
  )
}

Pedidos.getLayout = function getLayout(page) {
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



  /* Pedidos */
  const prisma = new PrismaClient()

  const Usuarios = await prisma.usuario.findMany({
    include:{
      dados: true,
      pedidos:{
        select: {id:true}
      }
    },
  })

  const usuariosFormatados = Usuarios
  .sort((a, b) => b.id - a.id) // Ordenação decrescente pelo ID
  .map((usuario) => ({
    ...usuario,
    dataExpiracaoToken: usuario.dataExpiracaoToken?.toISOString() || null,
  }));

  return {
      props: {Usuarios:usuariosFormatados}
  }
}