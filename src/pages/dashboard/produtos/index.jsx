import React, { useState, useEffect, useRef } from 'react'
import { PrismaClient } from "@prisma/client";

import { getAllFilteredAtributesController } from '../../../controllers/getAllFilteredAtributes'

import { BsEyeSlashFill, BsEyeFill, BsPencilSquare, BsEye, BsEyeSlash, BsListNested, BsFillGrid1X2Fill, BsFilter } from 'react-icons/bs'


import Layout from '../layout'
import styles from '@/styles/dashboard/dashboard.module.css'
import Header from '@/components/Dashboard/ProductsHeader'
import Modal from '@/components/Modal'
import Search from '@/components/Dashboard/Search'

import ListBox from '@/components/ListBox'

import { MdOutlinePhotoSizeSelectActual } from 'react-icons/md';
import { FaThList } from 'react-icons/fa';

import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken';

export default function Produtos({Produtos, filteredAtributes}) {

    const [produtos, setProdutos] = useState(Produtos) // useState com todos produtos selecionados

    const updateProdutos = async () => { // Função que busca todos produtos na api
        const response = await fetch('/api/produto');
        const data = await response.json();
        setProdutos(data.Produtos);
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
    
    const listOfAtributes = {};
    
    Object.keys(filteredAtributes).forEach((key) => {
        listOfAtributes[key] = [{ name: 'Todas' }].concat(filteredAtributes[key]);
    });

    const [dataType, setDataType] = useState(3)
    const [visibility, setVisibility] = useState(1)
    const [selectedOrder, setSelectedOrder] = useState(Ordem[0])
    const [openFilter, setOpenFilter] = useState(false)

    const [selectedCategory, setSelectedCategory] = useState(listOfAtributes.Categorias[0])
    const [selectedSubCategory, setSelectedSubCategory] = useState(listOfAtributes.SubCategorias[0])
    const [selectedMeasureUnit, setSelectedMeasureUnit] = useState(listOfAtributes.UnidadesMedida[0])
    const [selectedFlavor, setSelectedFlavor] = useState(listOfAtributes.Sabores[0])
    const [selectedColor, setSelectedColor] = useState(listOfAtributes.Cores[0])

    // Filtra as SubCategorias de acordo com a categoria selecionada
    const [selectedSubcategoriesList, setSelectedSubcategoriesList] = useState()
    useEffect(() => {

        if(selectedCategory.id){
            setSelectedSubcategoriesList( listOfAtributes.SubCategorias.filter(subCat => subCat.categoria == selectedCategory.id));
        }else{
            setSelectedSubcategoriesList( listOfAtributes.SubCategorias)
        }
       
    },[selectedCategory])

     //

    const [filteredProdutos, setFilteredProdutos] = useState([]) 
    const [searchFilteredProdutos, setSearchFilteredProdutos] = useState(filteredProdutos) 

   


    useEffect(() => { // Função que filtra os dados que irão aparecer na tabela 
        
        let filteredOrderProdutos//filtro 1

        switch(selectedOrder.name) { //Filtra por ordem (pela ListBox)
            
        case 'Código':
            filteredOrderProdutos = produtos
            break;
        case 'Crescente':
            filteredOrderProdutos = produtos.sort((a, b) => a.detalhesPedidos.length - b.detalhesPedidos.length)
            break;
            case 'Decrescente':
                filteredOrderProdutos = produtos.sort((a, b) => b.detalhesPedidos.length - a.detalhesPedidos.length)
            break;
        default:
            filteredOrderProdutos = produtos
        }

        let filteredCatProdutos // filtro 2
        
        if(selectedCategory.name == 'Todas'){ // Filtra pelo produto selecionado
            filteredCatProdutos = filteredOrderProdutos
        }else{
            filteredCatProdutos = filteredOrderProdutos.filter((produto) => produto.categoriaId == selectedCategory.id)
        }

        let filteredSubCatProdutos // filtro 3
        
        if(selectedSubCategory.name == 'Todas'){ // Filtra pelo produto selecionado
            filteredSubCatProdutos = filteredCatProdutos
        }else{
            filteredSubCatProdutos = filteredCatProdutos.filter((produto) => produto.subCategoriaId == selectedSubCategory.id)
        }

        let filteredUniProdutos // filtro 4
        
        if(selectedMeasureUnit.name == 'Todas'){ // Filtra pelo produto selecionado
            filteredUniProdutos = filteredSubCatProdutos
        }else{
            filteredUniProdutos = filteredSubCatProdutos.filter((produto) => produto.unidadeMedidaId == selectedMeasureUnit.id)
        }

        let filteredSabProdutos // filtro 5
        
        if(selectedFlavor.name == 'Todas'){ // Filtra pelo produto selecionado
            filteredSabProdutos = filteredUniProdutos
        }else{
            filteredSabProdutos = filteredUniProdutos.filter((produto) => produto.saborId == selectedFlavor.id)
        }

        let filteredColorProdutos // filtro 6
        
        if(selectedColor.name == 'Todas'){ // Filtra pelo produto selecionado
            filteredColorProdutos = filteredSabProdutos
        }else{
            filteredColorProdutos = filteredSabProdutos.filter((produto) => produto.corId == selectedColor.id)
        }


        

        if(visibility == 2){ //Filtra pela disponibilidade (pelo RadioGroup)

            setFilteredProdutos(filteredColorProdutos.filter((produto) => !produto.disponivel));
        }
        else if(visibility == 3){
            setFilteredProdutos(filteredColorProdutos.filter((produto) => produto.disponivel));
        }
        else{
            setFilteredProdutos(filteredColorProdutos)
        }

    }, [produtos, selectedOrder, selectedCategory, selectedSubCategory, selectedMeasureUnit, selectedFlavor, selectedColor, visibility])
 

    /* Cadastrar Produtos */

    const [registerProduto, setRegisterProduto] = useState("")
    const [registerCategoria, setRegisterCategoria] = useState("")
    const [registerSubCategoria, setRegisterSubCategoria] = useState("")
    const [registerCor, setRegisterCor] = useState("")
    const [registerSabor, setRegisterSabor] = useState("")
    const [registerUnidade, setRegisterUnidade] = useState("")
    const [registerPreco, setRegisterPreco] = useState("")
    const [registerDescricao, setRegisterDescricao] = useState("")
    const [registerImagem, setRegisterImagem] = useState("")
    const [imagemUrl, setImagemUrl] = useState("")

    // Filtra as SubCategorias de acordo com a categoria selecionada
    const [registerSubcategoriesList, setRegisterSubcategoriesList] = useState()
    useEffect(() => {

        if(registerCategoria.id){
            setRegisterSubcategoriesList( filteredAtributes.SubCategoriasDisponiveis.filter(subCat => subCat.categoria == registerCategoria.id));
        }else{
            setRegisterSubcategoriesList( [])
        }
       
    },[registerCategoria])
    //


    
    const formatarProduto = (event) => { // Função que formata o texto do input 
        const productTextFormatted = formatText(event.target.value)
        setRegisterProduto(productTextFormatted);
    };

    const formatarDescricao = (event, tamanhoMaximo = 200) => {
        // Passo 1: transformar em minúsculas
        const descricao = event.target.value;
        let textoFormatado = descricao.toLowerCase();
      
        // Passo 2: corrigir a capitalização
        textoFormatado = textoFormatado
          .split('. ')
          .map((frase) => {
            if (frase.length > 2) {
              const primeiraLetra = frase.charAt(0).toUpperCase();
              const restanteFrase = frase.slice(1);
              return primeiraLetra + restanteFrase;
            } else {
              return frase.toLowerCase();
            }
          })
          .join('. ');
      
        textoFormatado = textoFormatado.charAt(0).toUpperCase() + textoFormatado.slice(1);
      
        // Passo 3: substituir quebras de linha por espaços
        textoFormatado = textoFormatado.replace(/(\r\n|\n|\r)/gm, ' ');
      
        // Passo 4: limitar tamanho, se necessário
        if (tamanhoMaximo !== null && textoFormatado.length > tamanhoMaximo) {
          textoFormatado = textoFormatado.substring(0, tamanhoMaximo).trim() + '...';
        }
        setRegisterDescricao(textoFormatado);
      };

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

    const handleRegisterProduto = async (event) => { // Função que registra os produtos
        event.preventDefault();

        const formData = new FormData();
        formData.append('registerProduto', registerProduto);
        formData.append('registerCategoria', registerCategoria.id);
        formData.append('registerSubCategoria', registerSubCategoria.id);
        formData.append('registerCor', registerCor.id);
        formData.append('registerSabor', registerSabor.id);
        formData.append('registerUnidade', registerUnidade.id);
        formData.append('registerPreco', registerPreco);
        formData.append('registerDescricao', registerDescricao);
        formData.append('registerImagem', registerImagem);

       
        try{
            setRequisição(true)
            const response = await fetch('/api/produto',{
                method: 'PUT', 
                body: formData,
            });
            if(response.ok){
                setRegisterProduto("")
                setRegisterCategoria("")
                setRegisterSubCategoria("")
                setRegisterCor("")
                setRegisterSabor("")
                setRegisterUnidade("")
                setRegisterPreco("")
                setRegisterDescricao("")
                setRegisterImagem("")
                setOpenRegisterModal(false)
                
                updateProdutos()
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
    
    const [EditProduto, setEditProduto] = useState("")
    const [EditProdutoID, setEditProdutoID] = useState("")
    const [EditCategoria, setEditCategoria] = useState("")
    const [EditSubCategoria, setEditSubCategoria] = useState("")
    const [EditCor, setEditCor] = useState("")
    const [EditSabor, setEditSabor] = useState("")
    const [EditUnidade, setEditUnidade] = useState("")
    const [EditPreco, setEditPreco] = useState("")
    const [EditDescricao, setEditDescricao] = useState("")
    const [EditImagem, setEditImagem] = useState("")
    const [EditImagemPublicID, setEditImagemPublicID] = useState("")
    const [EditImagemUrl, setEditImagemUrl] = useState("")
    const [selectedDisponibilityProduto, setSelectedDisponibilityProduto] = useState("");

    // Filtra as SubCategorias de acordo com a categoria selecionada
    const [editSubcategoriesList, setEditSubcategoriesList] = useState()
    useEffect(() => {

        if(EditCategoria.id){
            setEditSubcategoriesList( filteredAtributes.SubCategoriasDisponiveis.filter(subCat => subCat.categoria == EditCategoria.id));
        }else{
            setEditSubcategoriesList( [])
        }
       
    },[EditCategoria])
    //



    const formatarEditProduto = (event) => { // Função que formata o texto do input 
        const productTextFormatted = formatText(event.target.value)
        setEditProduto(productTextFormatted);
    };

    const formatarEditDescricao = (event, tamanhoMaximo = 200) => {
        // Passo 1: transformar em minúsculas
        const descricao = event.target.value
        let textoFormatado = descricao.toLowerCase();
      
        // Passo 2: corrigir a capitalização
        
        textoFormatado = textoFormatado.split(' ').map((palavra) => {
            if (palavra.length > 2) {
              return palavra.charAt(0).toUpperCase() + palavra.slice(1);
            } else {
                return palavra.toLowerCase();
            }
        }).join(' ');

        textoFormatado = textoFormatado.charAt(0).toUpperCase() + textoFormatado.slice(1);
        
        // Passo 3: substituir quebras de linha por espaços
        textoFormatado = textoFormatado.replace(/(\r\n|\n|\r)/gm, ' ');
      
        // Passo 4: limitar tamanho, se necessário
        if (tamanhoMaximo !== null && textoFormatado.length > tamanhoMaximo) {
          textoFormatado = textoFormatado.substring(0, tamanhoMaximo).trim() + '...';
        }
        setEditDescricao(textoFormatado);
    }

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

    const handleProductSelect = (produto) => { // Função que pega os dados do produto que foi selecionado

        setEditProdutoID(produto.id)
        setEditProduto(produto.nome)
        setEditCategoria(filteredAtributes.Categorias.find(item => item.name == produto.categoria.tipo))
        setEditSubCategoria(filteredAtributes.SubCategorias.find(item => item.name == produto.subCategoria.tipo))
        setEditUnidade(filteredAtributes.UnidadesMedida.find(item => item.name == produto.unidadeMedida.tipo))
        setEditSabor(filteredAtributes.Sabores.find(item => item.name == produto.sabor.sabor))
        setEditCor(filteredAtributes.Cores.find(item => item.name == produto.cor.cor))
        setEditPreco(produto.precoUnitario)
        setEditDescricao(produto.descricao)
        setEditImagem(produto.imagem)
        setEditImagemPublicID(produto.imagem.publicId)
        setEditImagemUrl(`https://res.cloudinary.com/divmuffya/image/upload/v${produto.imagem.version}/${produto.imagem.publicId}.${produto.imagem.format}`)
        setSelectedDisponibilityProduto(produto.disponivel)

    }


    /* Editar Produto */
    const handleEditProduct = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('editProduto', EditProduto);
        formData.append('editProdutoID', EditProdutoID);
        formData.append('editCategoria', EditCategoria.id);
        formData.append('editSubCategoria', EditSubCategoria.id);
        formData.append('editCor', EditCor.id);
        formData.append('editSabor', EditSabor.id);
        formData.append('editUnidade', EditUnidade.id);
        formData.append('editPreco', EditPreco);
        formData.append('editDescricao', EditDescricao);
        formData.append('editImagem', EditImagem);
        formData.append('editImagemPublicId', EditImagemPublicID);

        try{
            setRequisição(true)
            const response = await fetch('/api/produto',{
                method: 'POST', 
                body: formData,
            });
            if(response.ok){
                setRegisterProduto("")
                setRegisterCategoria("")
                setRegisterSubCategoria("")
                setRegisterCor("")
                setRegisterSabor("")
                setRegisterUnidade("")
                setRegisterPreco("")
                setRegisterDescricao("")
                setRegisterImagem("")
                setOpenEditModal(false)
                
                updateProdutos()
            }else{
                const errorResponse = await response.json();
                throw new Error(errorResponse.message);
            }
        }catch(error){
            handleError(error.message)
        }
        setRequisição(false)
    }

    /* Desativar/Ativar Produtos */
    const handleDisableProduct = async () => { // Função que define a disponibilidade dos produtos
        const productId = EditProdutoID
        const disponibilidade = selectedDisponibilityProduto

        try{
            setRequisição(true)
            const response = await fetch('/api/produto/disable',{
                method: 'POST', 
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({productId, disponibilidade}),
            });
            if(response.ok){
                setOpenDisableModal(false)
                updateProdutos()
            }else{
                const errorResponse = await response.json();
                throw new Error(errorResponse.message);
            }
        }catch(error){
            handleError(error.message)
        }
        setRequisição(false)
    }

    function formatPrice(value) {
        const floatValue = parseFloat(value);
        return floatValue.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});
    }

    const [requisição, setRequisição] = useState()

    return (
        <div style={{maxWidth:'90vw'}} className='w-full mx-auto px-5 pb-10'>

            {/* Mensagem de Erro*/}
            <span ref={errorBoxRef} className='absolute bottom-5 right-5 z-30  opacity-0 transition-opacity duration-300 ease-in-out bg-red-400/60 border-2 border-red-500 text-red-200 font-medium rounded-lg inline-block px-2 py-2 my-1'>{errorMessage}</span>

            {/* Modal de cadastro*/}                                                                                       {/* relative transform rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg px-4 pb-4 pt-5 //md:my-8 md:max-w-2xl md:px-4 lg:max-w-4xl*/}
            <Modal tittle={'Adicionar Produto'} isOpen={openRegisterModal} onClose={() => setOpenRegisterModal(false)} sx={'relative transform md:rounded-xl bg-white text-left max-md:w-full shadow-2xl transition-all md:my-8 md:max-w-3xl lg:max-w-4xl lg:p-8 px-5 pb-8 pt-14'}>
                <form onSubmit={handleRegisterProduto}>
                    <div className="grid lg:grid-cols-3 lg:grid-rows-4 lg:grid-flow-col sm:grid-cols-2 max-sm:grid-cols-1 gap-x-3 gap-y-3">
                        <div className="mb-4 order-1 col-span-1 row-span-1">
                            <label htmlFor="nome" className="font-bold mb-2 text-black ">
                            Nome do Produto
                            </label>
                            <input
                            id="nome"
                            type="text"
                            name="nome"
                            value={registerProduto}
                            onChange={formatarProduto}
                            max={50}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="mb-4 order-2 col-span-1 row-span-1">
                            <label htmlFor="nome" className="font-bold mb-2 text-black ">
                            Categoria
                            </label>
                            <ListBox inputStyle='w-full !bg-white shadow-none p-2 border border-gray-300 rounded-md' dropdownStyle='!bg-white !text-black' selectedValue={registerCategoria} setSelectedValue={setRegisterCategoria} List={filteredAtributes.CategoriasDisponiveis}/>
                        </div>

                        <div className="mb-4 order-3 col-span-1 row-span-1">
                            <label htmlFor="nome" className="font-bold mb-2 text-black ">
                            SubCategoria
                            </label>
                            <ListBox inputStyle='w-full !bg-white shadow-none p-2 border border-gray-300 rounded-md' dropdownStyle='!bg-white !text-black' selectedValue={registerSubCategoria} setSelectedValue={setRegisterSubCategoria} List={registerSubcategoriesList}/>
                        </div>

                        <div className="mb-4 order-4 col-span-1 row-span-1">
                            <label htmlFor="nome" className="font-bold mb-2 text-black ">
                            Unidade de Medida
                            </label>
                            <ListBox inputStyle='w-full !bg-white shadow-none p-2 border border-gray-300 rounded-md' dropdownStyle='!bg-white !text-black' selectedValue={registerUnidade} setSelectedValue={setRegisterUnidade} List={filteredAtributes.UnidadesDisponiveis}/>
                        </div>

                        <div className="mb-4 order-5 col-span-1 row-span-1">
                            <label htmlFor="nome" className="font-bold mb-2 text-black ">
                            Sabor
                            </label>
                            <ListBox inputStyle='w-full !bg-white shadow-none p-2 border border-gray-300 rounded-md' dropdownStyle='!bg-white !text-black' selectedValue={registerSabor} setSelectedValue={setRegisterSabor} List={filteredAtributes.SaboresDisponiveis}/>
                        </div>

                        <div className="mb-4 order-6 col-span-1 row-span-1">
                            <label htmlFor="nome" className="font-bold mb-2 text-black ">
                            Cor
                            </label>
                            <ListBox inputStyle='w-full !bg-white shadow-none p-2 border border-gray-300 rounded-md' dropdownStyle='!bg-white !text-black' selectedValue={registerCor} setSelectedValue={setRegisterCor} List={filteredAtributes.CoresDisponiveis}/>
                        </div>

                        <div className="relative mb-4 order-7 col-span-1 row-span-1">
                            <label htmlFor="preco" className="font-bold mb-2 text-black">
                            Preço
                            </label>
                            <div className="relative">
                                <input
                                id="preco"
                                type="number"
                                name="preco"
                                value={registerPreco}
                                onChange={(e) => setRegisterPreco(e.target.value)}
                                step="0.50"
                                placeholder="0.00"
                                className="w-full pl-7 p-2 border border-gray-300 rounded-md"
                                />
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="text-black sm:text-sm">R$</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:order-8 md:col-span-1 md:row-span-3 max-md:col-span-1  max-md:row-span-2 lg:row-span-2">
                            <label htmlFor="imagem" className="font-bold mb-2 text-black">
                                Imagem
                            </label>
                            <div className="md:h-64 lg:h-52 max-md:h-52 relative overflow-hidden flex justify-center rounded-lg border border-dashed border-gray-600/25 px-6 py-10 ">
                                <label htmlFor="imagem" className="absolute top-0 right-0 w-full h-full cursor-pointer z-20">
                                    {registerImagem && 
                                        <img className='w-full h-full object-cover' src={imagemUrl} alt="teste" />
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

                        <div className="mb-4 order-9 lg:col-span-1 md:col-span-2 row-span-2">
                            <label htmlFor="descricao" className="font-bold mb-2 text-black">
                            Descrição
                            </label>
                            <textarea
                            id="descricao"
                            name="descricao"
                            value={registerDescricao}
                            onChange={formatarDescricao}
                            maxLength={400}
                            rows={5}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>

                    <button
                        disabled={requisição}
                        type="submit"
                        className={`mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-violet-600 px-8 py-3 text-base font-medium text-white hover:bg-violet-700 ${requisição && 'opacity-70'}`}
                    >
                        Adicionar Produto
                    </button>
                </form>
            </Modal>

            {/* Modal de edição*/}
            <Modal tittle={'Editar Produto'} isOpen={openEditModal} onClose={() => setOpenEditModal(false)} sx={'relative transform md:rounded-xl bg-white text-left max-md:w-full shadow-2xl transition-all md:my-8 md:max-w-3xl lg:max-w-4xl lg:p-8 px-5 pb-8 pt-14'}>
                <form onSubmit={handleEditProduct}>
                    <div className="grid lg:grid-cols-3 lg:grid-rows-4 lg:grid-flow-col sm:grid-cols-2 max-sm:grid-cols-1 gap-x-3 gap-y-3">
                        <div className="mb-4 order-1 col-span-1 row-span-1">
                            <label htmlFor="nome" className="font-bold mb-2 text-black ">
                            Nome do Produto
                            </label>
                            <input
                            id="nome"
                            type="text"
                            name="nome"
                            value={EditProduto}
                            onChange={formatarEditProduto}
                            max={50}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>

                        <div className="mb-4 order-2 col-span-1 row-span-1">
                            <label htmlFor="nome" className="font-bold mb-2 text-black ">
                            Categoria
                            </label>
                            <ListBox inputStyle='w-full !bg-white shadow-none p-2 border border-gray-300 rounded-md' dropdownStyle='!bg-white !text-black' selectedValue={EditCategoria} setSelectedValue={setEditCategoria} List={filteredAtributes.CategoriasDisponiveis} defaultValue={EditCategoria}/>
                        </div>

                        <div className="mb-4 order-3 col-span-1 row-span-1">
                            <label htmlFor="nome" className="font-bold mb-2 text-black ">
                            SubCategoria
                            </label>
                            <ListBox inputStyle='w-full !bg-white shadow-none p-2 border border-gray-300 rounded-md' dropdownStyle='!bg-white !text-black' selectedValue={EditSubCategoria} setSelectedValue={setEditSubCategoria} List={editSubcategoriesList}/>
                        </div>

                        <div className="mb-4 order-4 col-span-1 row-span-1">
                            <label htmlFor="nome" className="font-bold mb-2 text-black ">
                            Unidade de Medida
                            </label>
                            <ListBox inputStyle='w-full !bg-white shadow-none p-2 border border-gray-300 rounded-md' dropdownStyle='!bg-white !text-black' selectedValue={EditUnidade} setSelectedValue={setEditUnidade} List={filteredAtributes.UnidadesDisponiveis}/>
                        </div>

                        <div className="mb-4 order-5 col-span-1 row-span-1">
                            <label htmlFor="nome" className="font-bold mb-2 text-black ">
                            Sabor
                            </label>
                            <ListBox inputStyle='w-full !bg-white shadow-none p-2 border border-gray-300 rounded-md' dropdownStyle='!bg-white !text-black' selectedValue={EditSabor} setSelectedValue={setEditSabor} List={filteredAtributes.SaboresDisponiveis}/>
                        </div>

                        <div className="mb-4 order-6 col-span-1 row-span-1">
                            <label htmlFor="nome" className="font-bold mb-2 text-black ">
                            Cor
                            </label>
                            <ListBox inputStyle='w-full !bg-white shadow-none p-2 border border-gray-300 rounded-md' dropdownStyle='!bg-white !text-black' selectedValue={EditCor} setSelectedValue={setEditCor} List={filteredAtributes.CoresDisponiveis}/>
                        </div>

                        <div className="relative mb-4 order-7 col-span-1 row-span-1">
                            <label htmlFor="preco" className="font-bold mb-2 text-black">
                            Preço
                            </label>
                            <div className="relative">
                                <input
                                id="preco"
                                type="number"
                                name="preco"
                                value={EditPreco}
                                onChange={(e) => setEditPreco(e.target.value)}
                                step="0.50"
                                placeholder="0.00"
                                className="w-full pl-7 p-2 border border-gray-300 rounded-md"
                                />
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="text-black sm:text-sm">R$</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:order-8 md:col-span-1 md:row-span-3 max-md:col-span-1  max-md:row-span-2 lg:row-span-2">
                            <label htmlFor="imagem" className="font-bold mb-2 text-black">
                                Imagem
                            </label>
                            <div className="md:h-64 lg:h-52 max-md:h-52 relative overflow-hidden flex justify-center rounded-lg border border-dashed border-gray-600/25 px-6 py-10 ">
                                <label htmlFor="imagem" className="absolute top-0 right-0 w-full h-full cursor-pointer z-20">
                                    {EditImagemUrl && 
                                        <img className='w-full h-full object-cover' src={EditImagemUrl} alt="teste" />
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

                        <div className="mb-4 order-9 lg:col-span-1 md:col-span-2 row-span-2">
                            <label htmlFor="descricao" className="font-bold mb-2 text-black">
                            Descrição
                            </label>
                            <textarea
                            id="descricao"
                            name="descricao"
                            value={EditDescricao}
                            onChange={formatarEditDescricao}
                            maxLength={400}
                            rows={5}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>

                    <button
                        disabled={requisição}
                        type="submit"
                        className={`mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-violet-600 px-8 py-3 text-base font-medium text-white hover:bg-violet-700 ${requisição && 'opacity-70'}`}
                    >
                        Editar Produto
                    </button>
                </form>
            </Modal>

            {/* Modal da disponibilidade*/}
            <Modal tittle={selectedDisponibilityProduto? 'Desabilitar Produto' : 'Habilitar Produto'} isOpen={openDisableModal} onClose={() => setOpenDisableModal(false)}>
                {selectedDisponibilityProduto?
                <div>
                    <p>Deseja Desabilitar esse Produto?</p>

                    <button
                    disabled={requisição}
                    onClick={handleDisableProduct}
                    className={`mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-violet-600 px-8 py-3 text-base font-medium text-white lg:hover:bg-violet-700 ${requisição && 'opacity-70'}`}
                    >
                        Desabilitar Produto
                    </button>
                </div>

                :

                <div>
                    <p>Deseja Habilitar esse Produto?</p>
                    <button
                    disabled={requisição}
                    onClick={handleDisableProduct}
                    className={`mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-violet-600 px-8 py-3 text-base font-medium text-white lg:hover:bg-violet-700 ${requisição && 'opacity-70'}`}
                    >
                        Habilitar Produto
                    </button>
                </div>
                }
            </Modal>

            {/* Header */}
            <Header/>

            {/* Header da tabela */}
            <div className="flex justify-between items-end flex-wrap mt-3">

                <button onClick={() => {setOpenRegisterModal(true)}} className='bg-gradient-to-r from-purple-700 to-pink-500 rounded-br-lg rounded-tl-lg text-white font-semibold py-2 px-3 transition-all lg:hover:scale-105 max-sm:w-full max-sm:mb-5'>Adicionar Produto</button>
                
                <div className="flex flex-wrap items-end gap-3 max-sm:w-full">

                    <Search list={filteredProdutos} setFilteredList={setSearchFilteredProdutos} fieldName={'nome'}/>

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
                            <button onClick={() => setOpenFilter(!openFilter)} className={`flex justify-center items-center rounded-lg lg:hover:bg-zinc-700 h-10 px-3 ${openFilter? 'bg-gradient-to-r from-purple-700 to-pink-500': 'bg-zinc-800'}`}><BsFilter className='text-zinc-300 text-xl'/></button>
                        </div>

                        <div className="flex flex-wrap gap-3 items-end max-sm:w-full">
                            <div className="w-36 max-sm:w-full ">
                                <span className='text-white'>Ordernar por</span>
                                <ListBox inputStyle='lg:hover:bg-zinc-700' selectedValue={selectedOrder} setSelectedValue={setSelectedOrder} List={Ordem}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {openFilter &&
                <div className="grid lg:grid-cols-5 md:grid-cols-3 gap-x-10 gap-y-3 items-end w-full border-y border-zinc-800 py-3 mt-3">
                    <div className="max-sm:w-full">
                        <span className='text-white'>Categoria</span>
                        <ListBox inputStyle='lg:hover:bg-zinc-700' selectedValue={selectedCategory} setSelectedValue={setSelectedCategory} List={listOfAtributes.Categorias}/>
                    </div>

                    <div className="max-sm:w-full">
                        <span className='text-white'>SubCategoria</span>
                        <ListBox inputStyle='lg:hover:bg-zinc-700' selectedValue={selectedSubCategory} setSelectedValue={setSelectedSubCategory} List={selectedSubcategoriesList}/>
                    </div>

                    <div className="max-sm:w-full">
                        <span className='text-white'>Unidade de Medida</span>
                        <ListBox inputStyle='lg:hover:bg-zinc-700' selectedValue={selectedMeasureUnit} setSelectedValue={setSelectedMeasureUnit} List={listOfAtributes.UnidadesMedida}/>
                    </div>

                    <div className="max-sm:w-full">
                        <span className='text-white'>Sabores</span>
                        <ListBox inputStyle='lg:hover:bg-zinc-700' selectedValue={selectedFlavor} setSelectedValue={setSelectedFlavor} List={listOfAtributes.Sabores}/>
                    </div>

                    <div className="max-sm:w-full">
                        <span className='text-white'>Sabores</span>
                        <ListBox inputStyle='lg:hover:bg-zinc-700' selectedValue={selectedColor} setSelectedValue={setSelectedColor} List={listOfAtributes.Cores}/>
                    </div>
                </div>
            }
        
            {/* Tabela */}
            {searchFilteredProdutos == null || searchFilteredProdutos == '' && <p className='font-medium text-white text-xl text-center mt-10'>Produtos não encontrados</p>}

            {searchFilteredProdutos != null && searchFilteredProdutos != '' && dataType == 1 &&
                <div className={`w-full h-96 rounded-lg bg-zinc-800 mt-5 overflow-x-scroll ${styles.scroll}`}>
                    <table className='w-full font-sans'>
                        <thead className='sticky top-0 bg-zinc-900 '>
                            <tr>
                                <th scope='col' className='border-r border-neutral-700 text-lg font-medium text-gray-300 px-6 py-2 text-left'>#</th>
                                <th scope='col' className='border-r border-neutral-700 text-lg font-medium text-gray-300 px-6 py-2 text-left'>Nome</th>
                                <th scope='col' className='border-r border-neutral-700 text-lg font-medium text-gray-300 px-6 py-2 text-left'>Categoria</th>
                                <th scope='col' className='border-r border-neutral-700 text-lg font-medium text-gray-300 px-6 py-2 text-left'>SubCategoria</th>
                                <th scope='col' className='border-r border-neutral-700 text-lg font-medium text-gray-300 px-6 py-2 text-center'>U.M</th>
                                <th scope='col' className='border-r border-neutral-700 text-lg font-medium text-gray-300 px-6 py-2 text-center'>Sabor</th>
                                <th scope='col' className='border-r border-neutral-700 text-lg font-medium text-gray-300 px-6 py-2 text-center'>Cor</th>
                                <th scope='col' className='border-r border-neutral-700 text-lg font-medium text-gray-300 px-6 py-2 text-center'>Vendas</th>
                                <th scope='col' className='border-r border-neutral-700 text-lg font-medium text-gray-300 whitespace-nowrap px-6 py-2 text-center'>Preco U.</th>
                                <th scope='col' className='border-neutral-700 text-lg font-medium text-gray-300 px-6 py-2 text-left'>Opções</th>
                            </tr>
                        </thead>

                        <tbody>
                            {searchFilteredProdutos.map(produto => (
                                 <tr key={produto.id} className='even:bg-zinc-700'>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-400'>{produto.id}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-400'>{produto.nome}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-400'>{produto.categoria.tipo}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-400'>{produto.subCategoria.tipo}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-400 text-center'>{produto.unidadeMedida.tipo}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-400 text-center'>{produto.sabor.sabor}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-400 text-center'>{produto.cor.cor}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-400 text-center'>{produto.detalhesPedidos ? produto.detalhesPedidos.length : 0}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-center text-gray-400'>{formatPrice(produto.precoUnitario)}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-400 text-end'>
                                        <div className="flex gap-5">
                                            <button onClick={() => {setOpenEditModal(true); handleProductSelect(produto)}} className='text-cyan-300'><BsPencilSquare className='inline mr-1'/>Editar</button>
                                            {produto.disponivel?  
                                            <button onClick={() => {setOpenDisableModal(true); handleProductSelect(produto)}} className='text-green-400'><BsEyeFill className='inline mr-1'/>Habilitado</button>
                                            :
                                            <button onClick={() => {setOpenDisableModal(true); handleProductSelect(produto)}} className='text-red-400'><BsEyeSlashFill className='inline mr-1'/>Desabilitado</button>
                                            }
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }

            {searchFilteredProdutos != null && searchFilteredProdutos != '' && dataType == 2 &&
                <div  className={`w-full h-96 rounded-lg bg-zinc-700 mt-5 overflow-scroll ${styles.scroll}`}>
                    {searchFilteredProdutos.map(produto => (
                        <div key={produto.id} className="grid grid-cols-9  odd:bg-zinc-800">
                            <div className="grid col-span-2 m-2">
                            <div className="flex justify-center items-end h-48 rounded-lg bg-zinc-700 overflow-hidden m-2">
                                <img className='sm:object-cover w-full h-full' src={`https://res.cloudinary.com/divmuffya/image/upload/v${produto.imagem.version}/${produto.imagem.publicId}.${produto.imagem.format}`} alt={produto.nome} />
                            </div>
                            </div>
                            
                            <div className="grid col-span-3 my-3 px-5 pr-3">
                                <p className='whitespace-nowrap text-white text-base font-semibold py-1'>Código: <span className='text-gray-400 font-sans'>#{produto.id}</span></p>
                                <p className='whitespace-nowrap text-white text-base font-semibold py-1'>Nome: <span className='text-gray-400 font-sans'>{produto.nome}</span></p>
                                <p className='whitespace-nowrap text-white text-base font-semibold py-1'>Categoria: <span className='text-gray-400 font-sans'>{produto.categoria.tipo}</span></p>
                                <p className='whitespace-nowrap text-white text-base font-semibold py-1'>SubCategoria: <span className='text-gray-400 font-sans'>{produto.subCategoria.tipo}</span></p>
                                <p className='whitespace-nowrap text-white text-base font-semibold py-1'>Produtos Cadastrados: <span className='text-gray-400 font-sans'>{produto.id}</span></p>
                            </div>

                            <div className="grid col-span-4 px-3 my-3">
                            <p className='whitespace-nowrap text-white text-base font-semibold py-1'>Unidade de Medida: <span className='text-gray-400 font-sans'>{produto.unidadeMedida.tipo}</span></p>
                            <p className='whitespace-nowrap text-white text-base font-semibold py-1'>Sabor: <span className='text-gray-400 font-sans'>{produto.sabor.sabor}</span></p>
                            <p className='whitespace-nowrap text-white text-base font-semibold py-1'>Cor: <span className='text-gray-400 font-sans'>{produto.cor.cor}</span></p>
                            <p className='whitespace-nowrap text-white text-base font-semibold py-1'>Vendas: <span className='text-gray-400 font-sans'>{produto.detalhesPedidos ? produto.detalhesPedidos.length : 0}</span></p>
                                <span className='flex items-center gap-3 whitespace-nowrap text-white text-base font-semibold py-1'>
                                        <button onClick={() => {setOpenEditModal(true); handleProductSelect(produto)}} className='bg-cyan-500/10 border border-cyan-500 rounded-full px-2 py-1 text-cyan-300'><BsPencilSquare className='inline mr-1'/>Editar</button>                                                                                          
                                    {produto.disponivel?  
                                        <button onClick={() => {setOpenDisableModal(true); handleProductSelect(produto)}} className='bg-green-500/10 border border-green-500 rounded-full px-2 py-1 text-green-400'><BsEyeFill className='inline mr-1'/>Habilitado</button>
                                        :
                                        <button onClick={() => {setOpenDisableModal(true); handleProductSelect(produto)}} className='bg-red-500/10 border border-red-500 rounded-full px-2 py-1 text-red-400'><BsEyeSlashFill className='inline mr-1'/>Desabilitado</button>
                                    }</span>
                            </div>
                        </div>
                    ))}
                </div>
            }

            {searchFilteredProdutos && dataType == 3 &&
                <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 xs:grid-cols-1 gap-x-5 gap-y-5 mt-5">

                    {searchFilteredProdutos.map(produto => (
                        <div key={produto.id} onDoubleClick={() => {setOpenEditModal(true); handleProductSelect(produto)}} className="p-5 rounded-2xl bg-zinc-800 transition-all hover:scale-105 cursor-pointer">
                            <div className="flex justify-center items-end h-48 rounded-lg bg-zinc-700 overflow-hidden">
                                <img className='object-cover w-full h-full ' src={`https://res.cloudinary.com/divmuffya/image/upload/v${produto.imagem.version}/${produto.imagem.publicId}.${produto.imagem.format}`} alt={produto.nome} />
                            </div>
                            <div className="mt-4 flex flex-col">
                                <div className="flex justify-between">
                                    <div className="flex">
                                        <p className='text-zinc-500 font-semibold text-sm'>{produto.categoria.tipo}</p>
                                        <span className='text-zinc-500 font-semibold text-sm mx-2'>-</span>
                                        <p className='text-zinc-500 font-semibold text-sm'>{produto.subCategoria.tipo}</p>
                                    </div>
                                    <p className='text-zinc-500 font-semibold text-base font-sans'>#{produto.id}</p>
                                </div>
                                <p className='text-white font-semibold text-base'>{produto.nome}</p>
                                <p className='text-zinc-500 font-normal text-base'>{produto.sabor.sabor}</p>
                                <div className="flex justify-between mt-2">
                                    {produto.disponivel?  
                                        <button onClick={() => {setOpenDisableModal(true); handleProductSelect(produto)}} className='bg-green-500/10 border border-green-500 rounded-full px-2 py-1 text-green-400'><BsEyeFill className='inline mr-1'/>Habilitado</button>
                                        :
                                        <button onClick={() => {setOpenDisableModal(true); handleProductSelect(produto)}} className='bg-red-500/10 border border-red-500 rounded-full px-2 py-1 text-red-400'><BsEyeSlashFill className='inline mr-1'/>Desabilitado</button>
                                    }
                                    <button onClick={() => {setOpenEditModal(true); handleProductSelect(produto)}} className='bg-cyan-500/10 border border-cyan-500 rounded-full px-2 py-1 text-cyan-300'><BsPencilSquare/></button>                                                                                          
                                </div>
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
    const prisma = new PrismaClient();
    const filteredAtributes = await getAllFilteredAtributesController()


    const Produtos = await prisma.produto.findMany({
        include: {
            imagem: true,
            categoria: {
                select: {
                tipo: true,
                },
            },
            subCategoria: {
                select: {
                tipo: true,
                },
            },
            unidadeMedida: {
                select: {
                tipo: true,
                },
            },
            sabor: {
                select: {
                sabor: true,
                },
            },
            cor: {
                select: {
                cor: true,
                },
            },
            detalhesPedidos: {
                select: {
                id: true
                },
            }
        },
    });

    const produtosFormatados = Produtos
    .sort((a, b) => b.id - a.id) // Ordenação decrescente pelo ID
    .map((produto) => {
        return {
          ...produto,
          precoUnitario: produto.precoUnitario.toString(),
        };
    });

      await prisma.$disconnect();

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

    return {
        props: {
            filteredAtributes,
            Produtos: produtosFormatados
        }
    }
}