import React, { useState, useEffect, useRef  } from 'react'
import { PrismaClient } from "@prisma/client";

import { BsEyeFill, BsTrashFill, BsFillGrid1X2Fill, BsEyeSlash, BsEye, BsEyeSlashFill   } from 'react-icons/bs'
import { MdOutlinePhotoSizeSelectActual } from 'react-icons/md';
import { FaThList } from 'react-icons/fa';

import Layout from '../layout'
import Modal from '@/components/Modal'

import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken';

export default function Produtos({Decoracoes}) {

  const [decoracoes, setDecoracoes] = useState(Decoracoes) // useState com todas decorações selecionados


  const updateDecoracoes = async () => { // Função que busca todos produtos na api
      const response = await fetch('/api/decoracao');
      const data = await response.json();
      setDecoracoes(data);
  }

  const [requisição, setRequisição] = useState(false)

  /* Modais */
  const [openRegisterModal, setOpenRegisterModal] = useState(false) //Modal do Registro
  const [openEditModal, setOpenEditModal] = useState(false) //Modal da edição
  const [openDisableModal, setOpenDisableModal] = useState(false) //Modal da desativação
  const [openDeleteModal, setOpenDeleteModal] = useState(false) //Modal da Exclusão


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

  /* Filtragem dos dados */  

    const [dataType, setDataType] = useState(1)
    const [visibility, setVisibility] = useState(1)
   
    const [filteredDecoracoes, setFilteredDecoracoes] = useState(decoracoes)

  useEffect(() => { // Função que filtra os dados que irão aparecer na tabela 
      
      if(visibility == 2){ //Filtra pela disponibilidade (pelo RadioGroup)

          setFilteredDecoracoes(decoracoes.filter((produto) => !produto.disponivel));
      }
      else if(visibility == 3){
          setFilteredDecoracoes(decoracoes.filter((produto) => produto.disponivel));
      }
      else{
          setFilteredDecoracoes(decoracoes)
      }

  }, [decoracoes, visibility])
  


  /* Cadastrar Produtos */

  const [registerImagem, setRegisterImagem] = useState("")
  const [imagemUrl, setImagemUrl] = useState("")


  const formatarImagem = (event) => {
      const novaImagem = event.target.files[0];
      
      if(novaImagem){
          const Reader = new FileReader();
          Reader.onload = () => {
              setImagemUrl(Reader.result)
          }

          Reader.readAsDataURL(novaImagem)
          setRegisterImagem(novaImagem);
      }
  }

  const handleRegisterDecoracao = async (event) => { // Função que registra os produtos
      event.preventDefault();

      const formData = new FormData();
      formData.append('registerImagem', registerImagem);

     
      try{
          setRequisição(true)
          const response = await fetch('/api/decoracao',{
              method: 'PUT', 
            body: formData,
        });
        if(response.ok){
            setRegisterImagem("")
            setImagemUrl("")
            
            updateDecoracoes()
            setOpenRegisterModal(false)
        }else{
            const errorResponse = await response.json();
            throw new Error(errorResponse.message);
        }
    }catch(error){
        handleError(error.message)
    }
    setRequisição(false)
}

  /* Manipulação do Produto*/
  
  const [EditDecoracaoId, setEditDecoracaoId] = useState("")
  const [EditImagem, setEditImagem] = useState("")
  const [EditImagemID, setEditImagemID] = useState("")
  const [EditImagemPublicID, setEditImagemPublicID] = useState("")
  const [EditImagemUrl, setEditImagemUrl] = useState("")
  const [selectedDisponibilityDecoracao, setSelectedDisponibilityDecoracao] = useState("");

  const formatarEditImagem = (event) => {
      const novaImagem = event.target.files[0];
      
      if(novaImagem){
          const Reader = new FileReader();
          Reader.onload = () => {
              setEditImagemUrl(Reader.result)
          }

          Reader.readAsDataURL(novaImagem)
          setEditImagem(novaImagem);
      }
  }

  const handleDecoracaoSelect = (decoracao) => { // Função que pega os dados do decoracao que foi selecionado

      setEditDecoracaoId(decoracao.id)
      setEditImagem(decoracao.imagem)
      setEditImagemID(decoracao.imagem.id)
      setEditImagemPublicID(decoracao.imagem.publicId)
      setEditImagemUrl(`https://res.cloudinary.com/divmuffya/image/upload/v${decoracao.imagem.version}/${decoracao.imagem.publicId}.${decoracao.imagem.format}`)
      setSelectedDisponibilityDecoracao(decoracao.disponivel)

  }

  /* Editar Produto */
  const handleEditProduct = async () => {

      const formData = new FormData();
      formData.append('editImagem', EditImagem);
      formData.append('editImagemId', EditImagemID);
      formData.append('editImagemPublicId', EditImagemPublicID);

      try{
        setRequisição(true)
        const response = await fetch('/api/decoracao',{
            method: 'POST', 
            body: formData,
        });
            if(response.ok){
              setRegisterImagem("")
              setOpenEditModal(false)
              
              updateDecoracoes()
            }else{
                const errorResponse = await response.json();
                throw new Error(errorResponse.message);
            }
        }catch(error){
            handleError(error.message)
        }
        setRequisição(false)
    }
    
    /* Desativar/Ativar ou Excluir Produtos */
    
    
    const handleDisableDecoracao = async () => { // Função que define a disponibilidade dos produtos
        
        try{
            
            setRequisição(true)
            const response = await fetch('/api/decoracao',{
                method: 'DELETE', 
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({EditDecoracaoId, selectedDisponibilityDecoracao}),
                
            });
            
            if(response.ok){
                
                updateDecoracoes()
                setOpenDisableModal(false)
            }
            else{
                setRequisição(false)
                const errorResponse = await response.json();
                throw new Error(errorResponse.message);
            }
        }
        catch(error){
            handleError(error.message)
        }
        setRequisição(false)
    }
    
    const handleDeleteDecoracao = async () =>{
        
        const publicIdImagem = EditImagemPublicID
        
        try{
          setRequisição(true)
          
          const response = await fetch('/api/decoracao/delete',{
              method: 'DELETE', 
              headers: {"Content-Type": "application/json"},
              body: JSON.stringify({publicIdImagem}),
              
            });
            
            if(response.ok){
                updateDecoracoes()
                setOpenDeleteModal(false)
            }
            else{
                
                const errorResponse = await response.json();
                throw new Error(errorResponse.message);
                
            }
        }
        catch(error){
            handleError(error.message)
        }
        setRequisição(false)
  }

  return (
      <div style={{maxWidth:'100rem'}} className='w-full mx-auto px-5 pb-10'>

          {/* Mensagem de Erro*/}
          <span ref={errorBoxRef} className='absolute bottom-5 right-5 z-30  opacity-0 transition-opacity duration-300 ease-in-out bg-red-400/60 border-2 border-red-500 text-red-200 font-medium rounded-lg inline-block px-2 py-2 my-1'>{errorMessage}</span>

          {/* Modal de cadastro*/}                                                                                     
          <Modal tittle={'Adicionar Produto'} isOpen={openRegisterModal} onClose={() => setOpenRegisterModal(false)}>
          <form onSubmit={handleRegisterDecoracao}>
                  <div className='w-full'>
                      <label htmlFor="imagem" className="font-bold mb-2 text-black">
                          Imagem
                      </label>
                      <div className="md:h-72 max-md:h-72 relative overflow-hidden flex justify-center rounded-lg border border-dashed border-gray-600/25 px-6 py-10 ">
                          <label htmlFor="imagem" className="absolute top-0 right-0 w-full h-full cursor-pointer z-20">
                              {registerImagem && 
                                  <img className='w-full h-full object-cover' src={imagemUrl} alt="Decoração" />
                              }
                          </label>

                          <div className="text-center ">
                              <MdOutlinePhotoSizeSelectActual className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                  <label htmlFor="imagem" className="relative cursor-pointer rounded-md font-semibold text-violet-600 hover:text-violet-700">
                                      <div className="w-full h-full">
                                          <span>Enviar uma foto</span>
                                          <input id="imagem" name="imagem" type="file" accept='image/*' className="sr-only" onChange={formatarImagem}/>

                                      </div>
                                  </label>
                              </div>
                              <p className="text-xs leading-5 text-gray-600">PNG, JPG até 10MB</p>
                          </div>
                      </div>
                  </div>

                  <button
                    disabled={requisição}
                    type="submit"
                    className={`mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-violet-600 px-8 py-2 text-base font-medium text-white hover:bg-violet-700 ${requisição && 'opacity-70'}`}
                  >
                      Adicionar Decoração
                  </button>
              </form>
          </Modal>

          {/* Modal de edição*/}
          <Modal tittle={'Editar Decoração'} isOpen={openEditModal} onClose={() => setOpenEditModal(false)}>

              <div className='w-full'>
                  <label htmlFor="imagem" className="font-bold mb-2 text-black">
                      Clique na imagem para edita-la
                  </label>
                  <div className="md:h-72 max-md:h-72 relative overflow-hidden flex justify-center rounded-lg border border-dashed border-gray-600/25 px-6 py-10 ">
                      <label htmlFor="imagem" className="absolute top-0 right-0 w-full h-full cursor-pointer z-20">
                          {EditImagemUrl && 
                              <img className='w-full h-full object-cover' src={EditImagemUrl} alt="Decoração" />
                          }
                      </label>

                      <div className="text-center ">
                          <MdOutlinePhotoSizeSelectActual className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                          <div className="mt-4 flex text-sm leading-6 text-gray-600">
                              <label htmlFor="imagem" className="relative cursor-pointer rounded-md font-semibold text-violet-600 hover:text-violet-700">
                                  <div className="w-full h-full">
                                      <span>Enviar uma foto</span>
                                      <input id="imagem" name="imagem" type="file" accept='image/*' className="sr-only" onChange={formatarEditImagem}/>

                                  </div>
                              </label>
                          </div>
                          <p className="text-xs leading-5 text-gray-600">PNG, JPG até 10MB</p>
                      </div>
                  </div>
              </div>

              <button
                disabled={requisição}
                onClick={handleEditProduct}
                className={`mt-3 flex w-full items-center justify-center rounded-md border border-transparent bg-violet-600 px-8 py-3 text-base font-medium text-white hover:bg-violet-700 ${requisição && 'opacity-70'}`}
                >
                  Editar Produto
              </button>
          </Modal>

          {/* Modal da disponibilidade*/}
          <Modal tittle={selectedDisponibilityDecoracao? 'Desabilitar Decoração' : 'Habilitar Decoração'} isOpen={openDisableModal} onClose={() => setOpenDisableModal(false)}>
              {selectedDisponibilityDecoracao?
              <div>
                  <p>Deseja Desabilitar essa Decoração?</p>

                  <button

                    disabled={requisição}   
                    onClick={handleDisableDecoracao}
                    className={`mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-violet-600 px-8 py-3 text-base font-medium text-white lg:hover:bg-violet-700 ${requisição && 'opacity-70'}`}
                    >
                      Desabilitar Decoração
                  </button>
              </div>

                :

                <div>
                  <p>Deseja Habilitar essa Decoração?</p>
                  <button
                    disabled={requisição}   
                    onClick={handleDisableDecoracao}
                    className={`mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-violet-600 px-8 py-3 text-base font-medium text-white lg:hover:bg-violet-700 ${requisição && 'opacity-70'}`}
                    >
                      Habilitar Decoração
                  </button>
              </div>
              }
          </Modal>

          {/* Modal de exclusão*/}
          <Modal tittle="Excluir Decoração" isOpen={openDeleteModal} onClose={() => setOpenDeleteModal(false)}>
             
              <div>
                  <p>Tem certeza que deseja excluir essa decoração?</p>

                  <button
                    disabled={requisição}   
                    onClick={handleDeleteDecoracao}
                    className={`mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-violet-600 px-8 py-3 text-base font-medium text-white lg:hover:bg-violet-700 ${requisição && 'opacity-70'}`}
                    >
                      Excluir Decoração
                  </button>
              </div>

          </Modal>

          {/* Header da tabela */}
          <div className="flex justify-between items-end flex-wrap mt-5">

              <button onClick={() => {setOpenRegisterModal(true)}} className='bg-gradient-to-r from-purple-700 to-pink-500 rounded-br-lg rounded-tl-lg text-white font-semibold h-10 px-3 transition-all lg:hover:scale-105 max-sm:w-full max-sm:mb-5'>Adicionar Decoração</button>
              
              <div className="flex flex-wrap gap-3 items-end max-sm:w-full">
                  <div className="flex flex-wrap gap-3 items-end max-sm:w-full max-sm:order-2">
                      <button className="flex justify-center items-center h-10  px-3  bg-zinc-800 rounded-lg cursor-pointer lg:hover:bg-zinc-700" onClick={() => {visibility != 3? setVisibility(prevCount => prevCount + 1) : setVisibility(1)}}>
                          {visibility == 1?
                              <BsEyeFill className='text-zinc-300 text-xl'/>
                              : visibility == 2?
                              <BsEyeSlash className='text-red-400 text-xl'/>
                              : visibility == 3 &&
                              <BsEye className='text-green-400 text-xl'/>
                          }
                      </button>

                      <button className="flex justify-center items-center h-10  px-3  bg-zinc-800 rounded-lg cursor-pointer lg:hover:bg-zinc-700" onClick={() => {dataType != 2? setDataType(prevCount => prevCount + 1) : setDataType(1)}}>
                          {dataType == 1?
                              <FaThList  className='text-zinc-300 text-xl'/>
                              : 
                              <BsFillGrid1X2Fill className='text-zinc-300 text-xl'/>
                          }
                      </button>
                  </div>
              </div>
          </div>
      
          {/* Tabela */}
          {filteredDecoracoes == null || filteredDecoracoes == '' && <p className='font-medium text-white text-xl text-center mt-10'>Decorações não encontradas</p>}

          {filteredDecoracoes != null && filteredDecoracoes != '' && dataType == 1 &&
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 mt-5">
                  {filteredDecoracoes.map(decoracao => (
                      <div key={decoracao.id} className='relative transition-all lg:hover:scale-105 group mb-3' >
                          <img onClick={() => {setOpenEditModal(true); handleDecoracaoSelect(decoracao)}} className='w-full rounded-xl cursor-pointer' src={`https://res.cloudinary.com/divmuffya/image/upload/v${decoracao.imagem.version}/${decoracao.imagem.publicId}.${decoracao.imagem.format}`} alt={decoracao.nome} />
                      
                          <div className="hidden absolute right-0 top-0 justify-between w-full gap-5 px-1 mt-1 z-10 transition-all group-hover:flex">

                              {decoracao.disponivel?  
                                  <button onClick={() => {setOpenDisableModal(true); handleDecoracaoSelect(decoracao)}} className='bg-green-500/30 border border-green-500 rounded-full px-2 py-2 text-green-400'><BsEyeFill/></button>
                                  :
                                  <button onClick={() => {setOpenDisableModal(true); handleDecoracaoSelect(decoracao)}} className='bg-red-500/30 border border-red-500 rounded-full px-2 py-2 text-red-400'><BsEyeSlashFill/></button>
                              }

                              <button onClick={() => {setOpenDeleteModal(true); handleDecoracaoSelect(decoracao)}} className='bg-gray-500/30 border border-gray-500 rounded-full px-2 py-2 text-gray-400'><BsTrashFill/></button>                                                                                          
                          </div>

                      </div>
                  ))}
              </div>
          }


          {filteredDecoracoes != null && filteredDecoracoes != '' && dataType == 2 &&
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mt-5">
                  {filteredDecoracoes.map(decoracao => (
                      <div key={decoracao.id} className='relative transition-all lg:hover:scale-105 group mb-3' >
                          <img onClick={() => {setOpenEditModal(true); handleDecoracaoSelect(decoracao)}} className='w-full rounded-xl cursor-pointer' src={`https://res.cloudinary.com/divmuffya/image/upload/v${decoracao.imagem.version}/${decoracao.imagem.publicId}.${decoracao.imagem.format}`} alt={decoracao.nome} />
                      
                          <div className="hidden absolute right-0 top-0 justify-between w-full gap-5 px-1 mt-1 z-10 transition-all group-hover:flex">

                              {decoracao.disponivel?  
                                  <button onClick={() => {setOpenDisableModal(true); handleDecoracaoSelect(decoracao)}} className='bg-green-500/30 border border-green-500 rounded-full px-2 py-2 text-green-400'><BsEyeFill/></button>
                                  :
                                  <button onClick={() => {setOpenDisableModal(true); handleDecoracaoSelect(decoracao)}} className='bg-red-500/30 border border-red-500 rounded-full px-2 py-2 text-red-400'><BsEyeSlashFill/></button>
                              }

                              <button onClick={() => {setOpenDeleteModal(true); handleDecoracaoSelect(decoracao)}} className='bg-gray-500/30 border border-gray-500 rounded-full px-2 py-2 text-gray-400'><BsTrashFill/></button>                                                                                          
                          </div>

                      </div>
                  ))}
              </div>
          }

      </div>
  )
}

Produtos.getLayout = function getLayout(page) {
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

  const prisma = new PrismaClient();

  const Decoracoes = await prisma.decoracoes.findMany({
      include: {
          imagem: true,
      }
  });
    
  await prisma.$disconnect();

  return {
      props: {
          Decoracoes
      }
  }
}

