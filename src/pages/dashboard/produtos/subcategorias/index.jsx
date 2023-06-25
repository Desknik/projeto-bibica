import React, { useState, useEffect, useRef } from 'react'
import { PrismaClient } from "@prisma/client";

import { BsEyeSlashFill, BsEyeFill, BsPencilSquare, BsEye, BsEyeSlash, BsListNested, BsFillGrid1X2Fill } from 'react-icons/bs'

//import { useForm } from 'react-hook-form'

import Layout from '../../layout'
import styles from '../../../../styles/dashboard/dashboard.module.css'
import Header from '../../../../components/Dashboard/ProductsHeader'
import Modal from '../../../../components/Modal'
import Search from '../../../../components/Dashboard/Search'

import ListBox from '../../../../components/ListBox'
import { FaThList } from 'react-icons/fa';

import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken';

export default function SubCategorias({subCategorias, Categorias}) {
    const [categoriasDisponiveis, setCategoriasDisponiveis] = useState(Categorias.filter(categoria => categoria.disponivel)) // useState com todas subcategorias selecionadas
    const [subCategories, setSubCategories] = useState(subCategorias) // useState com todas subcategorias selecionadas

    const updateSubCategories = async () => { // Função que busca todas subCategorias na api
        const response = await fetch('/api/subcategoria');
        const data = await response.json();
        setSubCategories(data);
    }

    /* Modais */
    const [openRegisterModal, setOpenRegisterModal] = useState(false) //Modal do Registro
    const [openEditModal, setOpenEditModal] = useState(false) //Modal da edição
    const [openDisableModal, setOpenDisableModal] = useState(false) //Modal da desativação

    /* Formatação dos textos dos inputs */
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

    /* Filtragem dos dados */  

    const Ordem = [
        { name: 'Código' },
        { name: 'Crescente' },
        { name: 'Decrescente' },
    ]

    const listCategories = [{ name: 'Todas' }].concat(Categorias);


    const [dataType, setDataType] = useState(1)
    const [visibility, setVisibility] = useState(1)
    const [selectedOrder, setSelectedOrder] = useState(Ordem[0])
    const [selectedCategory, setSelectedCategory] = useState(listCategories[0])
    const [filteredSubCategories, setFilteredSubCategories] = useState([])

    useEffect(() => { // Função que filtra os dados que irão aparecer na tabela 
        let filteredOrderSubCategories//filtro 1

        switch(selectedOrder.name) { //Filtra por ordem (pela ListBox)
            
        case 'Código':
            filteredOrderSubCategories = subCategories
            break;
        case 'Crescente':
            filteredOrderSubCategories = subCategories.sort((a, b) => a.produtos.length - b.produtos.length)
            break;
            case 'Decrescente':
                filteredOrderSubCategories = subCategories.sort((a, b) => b.produtos.length - a.produtos.length)
            break;
        default:
            filteredOrderSubCategories = subCategories
        }

        let filteredSubCategories // filtro 2
        
        if(selectedCategory.name == 'Todas'){ // Filtra pela subCategoria selecionada
            filteredSubCategories = filteredOrderSubCategories
        }else{
            filteredSubCategories = filteredOrderSubCategories.filter((subcategoria) => subcategoria.categoriaId == selectedCategory.id)
        }

        if(visibility == 2){ //Filtra pela disponibilidade (pelo RadioGroup)

            setFilteredSubCategories(filteredSubCategories.filter((subcategoria) => !subcategoria.disponivel));
        }
        else if(visibility == 3){
            setFilteredSubCategories(filteredSubCategories.filter((subcategoria) => subcategoria.disponivel));
        }
        else{
            setFilteredSubCategories(filteredSubCategories)
        }

    }, [subCategories, selectedOrder, selectedCategory, visibility])
 

    /* Cadastrar SubCategorias */

    //const { register, handleSubmit } = useForm() // Funções que vão ser usadas para pegar os dados dos formulários (não usado nesse caso)

    const [nomeSubCategoria, setNomeSubCategoria] = useState("")
    const [Categoria, setCategoria] = useState("")
    
    const formatSubCategoriaChange = (event) => { // Função que formata o texto do input 
        const subCategoriaFormatada = formatText(event.target.value)
        setNomeSubCategoria(subCategoriaFormatada);
    };

    const handleRegisterSubCategoria = async (event) => { // Função que registra as subCategorias
        event.preventDefault();

        const idCategoria = Categoria.id

         try{
            setRequisição(true)
            const response = await fetch('/api/subcategoria',{
                method: 'PUT', 
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({idCategoria, nomeSubCategoria}),
            });
            if(response.ok){
                setOpenRegisterModal(false)
                setNomeSubCategoria('')
                updateSubCategories()
            }else{
                const errorResponse = await response.json();
                throw new Error(errorResponse.message);
            }
        }catch(error){
            handleError(error.message)
        }
        setRequisição(false)
    }

    /* Manipulação da SubCategoria*/

    const [selectedSubCategoria, setSelectedSubCategoria] = useState("");
    const [selectedTypeSubCategoria, setSelectedTypeSubCategoria] = useState("");
    const [selectedTypeCategoria, setSelectedTypeCategoria] = useState("");
    const [selectedDisponibilitySubCategoria, setSelectedDisponibilitySubcategoria] = useState("");

    const handleCategoriaSelect = (subCategoria) => { // Função que pega os dados da subCategoria que foi selecionada
        setSelectedSubCategoria(subCategoria)
        setSelectedTypeSubCategoria(subCategoria.tipo)
        setSelectedTypeCategoria(Categorias.find(c => c.id === subCategoria.categoriaId))
        setSelectedDisponibilitySubcategoria(subCategoria.disponivel)
    }

    const formatSelectedTypeSubCategoria = (event) => { // Função que formata o texto do input 
        const subCategoriaFormatada = formatText(event.target.value)
        setSelectedTypeSubCategoria(subCategoriaFormatada);
    };

    /* Editar SubCategorias */
    const handleEditSubCategoria = async () => {
        const idSubCategoria = selectedSubCategoria.id
        const tipoSubCategoria = selectedTypeSubCategoria
        const idCategoria = selectedTypeCategoria.id

        try{
            setRequisição(true)
            const response = await fetch('/api/subcategoria',{
                method: 'POST', 
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({idSubCategoria, tipoSubCategoria, idCategoria}),
            });
            if(response.ok){
                setOpenEditModal(false)
                updateSubCategories()
            }else{
                const errorResponse = await response.json();
                throw new Error(errorResponse.message);
            }
        }catch(error){
            handleError(error.message)
        }
        setRequisição(false)
    }

    /* Desativar/Ativar SubCategorias */
    const handleDisableCategoria = async () => { // Função que define a disponibilidade da subcategoria
        const idSubCategoria = selectedSubCategoria.id
        const disponibilidade = selectedDisponibilitySubCategoria

        try{
            setRequisição(true)
            const response = await fetch('/api/subcategoria',{
                method: 'DELETE', 
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({idSubCategoria, disponibilidade}),
            });
            if(response.ok){
                setOpenDisableModal(false)
                updateSubCategories()
            }else{
                const errorResponse = await response.json();
                throw new Error(errorResponse.message);
            }
        }catch(error){
            handleError(error.message)
        }
        setRequisição(false)
    }

    const [requisição, setRequisição] = useState()

    return (
        <div style={{maxWidth:'100rem'}} className='w-full mx-auto px-5 pb-10'>

            {/* Mensagem de Erro*/}
            <span ref={errorBoxRef} className='absolute bottom-5 right-5 z-30  opacity-0 transition-opacity duration-300 ease-in-out bg-red-400/60 border-2 border-red-500 text-red-200 font-medium rounded-lg inline-block px-2 py-2 my-1'>{errorMessage}</span>

            {/* Modal de cadastro*/}
            <Modal tittle={'Adicionar SubCategoria'} isOpen={openRegisterModal} onClose={() => setOpenRegisterModal(false)}>
                <form onSubmit={handleRegisterSubCategoria}>
                    <div className="grid grid-cols-1 gap-x-3 gap-y-3">
                        <div className="col-span-1 row-span-1">
                            <label htmlFor="nome" className="font-bold mb-2 text-black ">
                            Categoria Pertecente
                            </label>
                            <ListBox inputStyle='!bg-white shadow-none border border-gray-300 rounded-md' dropdownStyle='!bg-white !text-black' selectedValue={Categoria} setSelectedValue={setCategoria} List={categoriasDisponiveis}/>
                        </div>

                        <div className="col-span-1 row-span-1">
                            <label htmlFor="nome" className="font-bold mb-2 text-black ">
                            Nome da SubCategoria
                            </label>
                            <input
                                id="subcategoria"
                                type="text"
                                name="categoria"
                                value={nomeSubCategoria}
                                maxLength={40}
                                onChange={formatSubCategoriaChange}
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>
                        
                    <button
                        disabled={requisição}
                        type="submit"
                        className={`mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-violet-600 px-8 py-3 text-base font-medium text-white lg:hover:bg-violet-700 ${requisição && 'opacity-70'}`}
                    >
                        Adicionar SubCategoria
                    </button>
                </form>
            </Modal>

            {/* Modal de edição*/}
            <Modal tittle={'Editar SubCategoria'} isOpen={openEditModal} onClose={() => setOpenEditModal(false)}>
                <div className="grid grid-cols-1 gap-x-3 gap-y-3">
                    <input
                        id="categoria"
                        type="text"
                        name="categoria"
                        value={selectedTypeSubCategoria}
                        maxLength={40}
                        onChange={formatSelectedTypeSubCategoria}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />

                        <div className="col-span-1 row-span-1">
                            <label htmlFor="nome" className="font-bold mb-2 text-black ">
                            Categoria Pertecente
                            </label>
                            <ListBox inputStyle='!bg-white shadow-none border border-gray-300 rounded-md' dropdownStyle='!bg-white !text-black' selectedValue={selectedTypeCategoria} setSelectedValue={setSelectedTypeCategoria} List={Categorias}/>
                        </div>

                    <button
                        disabled={requisição}
                        onClick={handleEditSubCategoria}
                        className={`mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-violet-600 px-8 py-3 text-base font-medium text-white lg:hover:bg-violet-700 ${requisição && 'opacity-70'}`}
                    >
                        Editar SubCategoria
                    </button>
                </div>
            </Modal>

            {/* Modal da disponibilidade*/}
            <Modal tittle={selectedDisponibilitySubCategoria? 'Desabilitar SubCategoria' : 'Habilitar SubCategoria'} isOpen={openDisableModal} onClose={() => setOpenDisableModal(false)}>
                {selectedDisponibilitySubCategoria?
                <div>
                    <p>Deseja Desabilitar essa SubCategoria?</p>

                    <button
                        disabled={requisição}
                        onClick={handleDisableCategoria}
                    className={`mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-violet-600 px-8 py-3 text-base font-medium text-white lg:hover:bg-violet-700 ${requisição && 'opacity-70'}`}
                    >
                        Desabilitar SubCategoria
                    </button>
                </div>

                :

                <div>
                    <p>Deseja Habilitar essa SubCategoria?</p>
                    <button
                        disabled={requisição}
                        onClick={handleDisableCategoria}
                    className={`mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-violet-600 px-8 py-3 text-base font-medium text-white lg:hover:bg-violet-700 ${requisição && 'opacity-70'}`}
                    >
                        Habilitar SubCategoria
                    </button>
                </div>
                }
            </Modal>

            {/* Header */}
            <Header/>

            {/* Header da tabela */}
            <div className="flex justify-between items-end flex-wrap mt-5">

                <button onClick={() => {setOpenRegisterModal(true)}} className='bg-gradient-to-r from-purple-700 to-pink-500 rounded-br-lg rounded-tl-lg text-white font-semibold h-10 px-3 transition-all lg:hover:scale-105 max-sm:w-full max-sm:mb-5'>Adicionar SubCategoria</button>
                
                <div className="flex flex-wrap items-end gap-3 max-sm:w-full">

                    <Search list={subCategories} setFilteredList={setFilteredSubCategories} fieldName={'tipo'}/>

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

                            <button className="flex justify-center items-center h-10  px-3  bg-zinc-800 rounded-lg cursor-pointer lg:hover:bg-zinc-700" onClick={() => {dataType != 3? setDataType(prevCount => prevCount + 1) : setDataType(1)}}>
                                {dataType == 1?
                                    <FaThList  className='text-zinc-300 text-xl'/>
                                    : dataType == 2?
                                    <BsListNested className='text-zinc-300 text-xl'/>
                                    : dataType == 3 &&
                                    <BsFillGrid1X2Fill className='text-zinc-300 text-xl'/>
                                }
                            </button>
                        </div>
                       

                        <div className="flex flex-wrap gap-3 items-end max-sm:w-full">
                            <div className="w-36 max-sm:w-full ">
                                <span className='text-white'>Ordernar por</span>
                                <ListBox inputStyle='lg:hover:bg-zinc-700' selectedValue={selectedOrder} setSelectedValue={setSelectedOrder} List={Ordem}/>
                            </div>

                            <div className="w-36 max-sm:w-full">
                                <span className='text-white'>Categoria</span>
                                <ListBox inputStyle='lg:hover:bg-zinc-700' selectedValue={selectedCategory} setSelectedValue={setSelectedCategory} List={listCategories}/>
                            </div>
                        </div>
                    </div>
                    

                </div>
            </div>
        
            {/* Tabela */}
            {filteredSubCategories == null || filteredSubCategories == '' && <p className='font-medium text-white text-xl text-center mt-10'>SubCategoria não encontrada</p>}

            {filteredSubCategories != null && filteredSubCategories != '' && dataType == 1 &&
                <div  className={`w-full h-96 rounded-lg bg-zinc-800 mt-5 overflow-x-scroll ${styles.scroll}`}>
                    <table className='w-full font-sans'>
                        <thead className='bg-zinc-900 '>
                            <tr>
                                <th scope='col' className='border-r border-neutral-700 text-lg font-medium text-gray-300 px-6 py-2 text-left'>#</th>
                                <th scope='col' className='border-r border-neutral-700 text-lg font-medium text-gray-300 px-6 py-2 text-left'>Nome</th>
                                <th scope='col' className='border-r border-neutral-700 text-lg font-medium text-gray-300 px-6 py-2 text-left'>Categoria</th>
                                <th scope='col' className='border-r border-neutral-700 text-lg font-medium text-gray-300 px-6 py-2 text-left'>Ativo</th>
                                <th scope='col' className='border-r border-neutral-700 text-lg font-medium text-gray-300 px-6 py-2 text-center'>Produtos Cadastrados</th>
                                <th scope='col' className='border-neutral-700 text-lg font-medium text-gray-300 px-6 py-2 text-left'>Opções</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filteredSubCategories.map(subCategoria => (
                                 <tr key={subCategoria.id} className='even:bg-zinc-700'>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-400'>{subCategoria.id}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-400'>{subCategoria.tipo}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-400'>{Categorias.find(c => c.id === subCategoria.categoriaId).name}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-400'>{subCategoria.disponivel === true? 'Sim' : 'Não'}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-400 text-center'>{subCategoria.produtos ? subCategoria.produtos.length : 0}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-400 text-end'>
                                        <div className="flex gap-5">
                                            <button onClick={() => {setOpenEditModal(true); handleCategoriaSelect(subCategoria)}} className='text-cyan-300'><BsPencilSquare className='inline mr-1'/>Editar</button>
                                            {subCategoria.disponivel?  
                                            <button onClick={() => {setOpenDisableModal(true); handleCategoriaSelect(subCategoria)}} className='text-green-400'><BsEyeFill className='inline mr-1'/>Habilitado</button>
                                            :
                                            <button onClick={() => {setOpenDisableModal(true); handleCategoriaSelect(subCategoria)}} className='text-red-400'><BsEyeSlashFill className='inline mr-1'/>Desabilitado</button>
                                            }
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }

            {filteredSubCategories != null && filteredSubCategories != '' && dataType == 2 &&
                <div  className={`w-full h-96 rounded-lg bg-zinc-700 mt-5 overflow-scroll ${styles.scroll}`}>
                    {filteredSubCategories.map(subCategoria => (
                        <div key={subCategoria.id} className="grid grid-cols-6  odd:bg-zinc-800">
                            <div className="grid col-span-2 my-3 px-5 pr-3">
                                <p className='text-white text-base font-semibold py-1'>Código:</p>
                                <p className='text-white text-base font-semibold py-1'>Tipo:</p>
                                <p className='text-white text-base font-semibold py-1'>Categoria:</p>
                                <p className='text-white text-base font-semibold py-1'>Ativo:</p>
                                <p className='text-white text-base font-semibold py-1'>Produtos Cadastrados:</p>
                                <p className='text-white text-base font-semibold py-1'>Opções:</p>
                            </div>

                            <div className="grid col-span-4 px-3 my-3">
                                <span className='font-semibold text-gray-400 font-sans py-1'>#{subCategoria.id}</span>
                                <span className='font-semibold text-gray-400 font-sans py-1'>{subCategoria.tipo}</span>
                                <span className='font-semibold text-gray-400 font-sans py-1'>{Categorias.find(c => c.id === subCategoria.categoriaId).name}</span>
                                <span className='font-semibold text-gray-400 font-sans py-1'>{subCategoria.disponivel === true? 'Sim' : 'Não'}</span>
                                <span className='font-semibold text-gray-400 font-sans py-1'>{subCategoria.produtos ? subCategoria.produtos.length : 0}</span>
                                <span className='flex items-center gap-3 text-white text-base font-semibold py-1'>
                                        <button onClick={() => {setOpenEditModal(true); handleCategoriaSelect(subCategoria)}} className='bg-cyan-500/10 border border-cyan-500 rounded-full px-2 py-1 text-cyan-300'><BsPencilSquare className='inline mr-1'/>Editar</button>                                                                                          
                                    {subCategoria.disponivel?  
                                        <button onClick={() => {setOpenDisableModal(true); handleCategoriaSelect(subCategoria)}} className='bg-green-500/10 border border-green-500 rounded-full px-2 py-1 text-green-400'><BsEyeFill className='inline mr-1'/>Habilitado</button>
                                        :
                                        <button onClick={() => {setOpenDisableModal(true); handleCategoriaSelect(subCategoria)}} className='bg-red-500/10 border border-red-500 rounded-full px-2 py-1 text-red-400'><BsEyeSlashFill className='inline mr-1'/>Desabilitado</button>
                                    }</span>
                            </div>
                        </div>
                    ))}

                </div>
            }

            {filteredSubCategories != null && filteredSubCategories != '' && dataType == 3 &&
                <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-x-5 gap-y-5 mt-5">

                    {filteredSubCategories.map(subCategoria => (
                         <div key={subCategoria.id} onDoubleClick={() => {setOpenEditModal(true); handleCategoriaSelect(subCategoria)}} className="relative rounded-lg bg-zinc-800 transition-all lg:hover:scale-105 cursor-pointer">

                            <p className='mt-3 ml-3 text-zinc-300 font-semibold text-md font-sans'># {subCategoria.id}</p>
                            <button onClick={() => {setOpenEditModal(true); handleCategoriaSelect(subCategoria)}} className='absolute top-0 right-0 m-3 bg-cyan-500/10 border border-cyan-500 rounded-full px-2 py-2 text-cyan-300'><BsPencilSquare/></button>

                            <div className="m-3 mt-0 flex flex-col">
                                <p className='text-white font-semibold text-base'>Tipo:  <span className='text-zinc-300 pl-2 font-normal text-lg'>{subCategoria.tipo}</span> </p>
                                <p className='text-white font-semibold text-base'>Categoria:  <span className='text-zinc-300 pl-2 font-normal text-lg'>{Categorias.find(c => c.id === subCategoria.categoriaId).name}</span> </p>
                                <p className='text-white font-semibold text-base'>Disponivel:  <span className='text-zinc-300 pl-2 font-normal text-lg'>{subCategoria.disponivel === true? 'Sim' : 'Não'}</span> </p>
                                <p className='text-white font-semibold text-base'>Produtos Cadastrados:  <span className='text-zinc-300 pl-2 font-normal text-lg font-sans'>{subCategoria.produtos ? subCategoria.produtos.length : 0}</span></p>
                                <div className="flex justify-end gap-5 mt-3">
                                    {subCategoria.disponivel?  
                                        <button onClick={() => {setOpenDisableModal(true); handleCategoriaSelect(subCategoria)}} className='bg-green-500/10 border border-green-500 rounded-full px-2 py-1 text-green-400'><BsEyeFill className='inline mr-1'/>Habilitado</button>
                                        :
                                        <button onClick={() => {setOpenDisableModal(true); handleCategoriaSelect(subCategoria)}} className='bg-red-500/10 border border-red-500 rounded-full px-2 py-1 text-red-400'><BsEyeSlashFill className='inline mr-1'/>Desabilitado</button>
                                    }
                                </div>
                                
                            </div>

                        </div>
                    ))}

                </div>
            }
        </div>
    )
}

SubCategorias.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}


export async function getServerSideProps(ctx) {
    const prisma = new PrismaClient();
    
    const categorias = await prisma.categoria.findMany({
        select: {
            id: true,
            tipo: true,
            disponivel: true,
        },

    });
    const Categorias = categorias.map(categoria => ({ id:categoria.id ,name: categoria.tipo, disponivel: categoria.disponivel}));

    const subCategorias = await prisma.subCategoria.findMany(
    {
        include: {
            produtos: {
                select: {
                    id: true,
                },
            } // inclui os dados dos produtos relacionados
        }
    });

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
    await prisma.$disconnect();
    
    return {
        props: {
            Categorias,
            subCategorias
        }
    }
}