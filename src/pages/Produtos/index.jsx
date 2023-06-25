import React, {useContext, useEffect, useState } from 'react'
import { setCookie } from 'nookies'
import Head from 'next/head'

import Layout from '../layout'

import { PrismaClient } from '@prisma/client'
import { BsEyeFill, BsEyeSlashFill, BsPencilSquare, BsFilter } from 'react-icons/bs'
import { getAllFilteredAtributesController } from '@/controllers/getAllFilteredAtributes'
import ListBox from '@/components/ListBox'
import Modal from '@/components/Modal'

import Background from '../../assets/img/backgrounds/Background05.jpg'
import Image from 'next/image'
import Router, { useRouter } from 'next/router'

import { AuthContext } from '../../contexts/AuthContext'
import Link from 'next/link'

export default function Produtos({Produtos, filteredAtributes}) {

  const { user, isAuthenticated, carrinhoDeCompras, setCarrinhoDeCompras } = useContext(AuthContext)
  
  /* Produtos mais vendidos */
  const produtosMaisVendidos = Produtos.sort((a, b) => b.detalhesPedidos.length - a.detalhesPedidos.length).slice(0, 5);

  /* Função que formata a string de dinheiro dos produtos*/ 
  const formatarValorMonetario = (valor) => {
    const valorFormatado = parseFloat(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return valorFormatado;
  }

  /* Filtros */
  const listOfAtributes = {};
  
  Object.keys(filteredAtributes).forEach((key) => {
      listOfAtributes[key] = [{ name: 'Todas' }].concat(filteredAtributes[key]);
  });

  const [selectedCategory, setSelectedCategory] = useState(listOfAtributes.Categorias[0])
  const [selectedSubCategory, setSelectedSubCategory] = useState(listOfAtributes.SubCategorias[0])
  const [selectedFlavor, setSelectedFlavor] = useState("Todas")

  // Filtra as SubCategorias de acordo com a categoria selecionada
  const [selectedSubcategoriesList, setSelectedSubcategoriesList] = useState([{ name: 'Todas' }])
  useEffect(() => {

      if(selectedCategory.id){
        setSelectedSubcategoriesList([
          { name: 'Todas' },
          ...listOfAtributes.SubCategorias.filter(subCat => subCat.categoria == selectedCategory.id)
        ]);
      }
      if(selectedCategory.id == undefined){
        setSelectedSubcategoriesList( [{ name: 'Todas' }])
      }
  },[selectedCategory])

  const [filteredProdutos, setFilteredProdutos] = useState([]) 
  
  useEffect(() => { // Função que filtra os dados que irão aparecer na tabela 

      let produtos = Produtos// filtro 1

      let filteredCatProdutos // filtro 1
      
      if(selectedCategory.name == 'Todas'){ // Filtra pelo produto selecionado
          filteredCatProdutos = produtos
      }else{
          filteredCatProdutos = produtos.filter((produto) => produto.categoriaId == selectedCategory.id)
      }

      let filteredSubCatProdutos // filtro 2
      
      if(selectedSubCategory.name == 'Todas'){ // Filtra pelo produto selecionado
          filteredSubCatProdutos = filteredCatProdutos
      }else{
          filteredSubCatProdutos = filteredCatProdutos.filter((produto) => produto.subCategoriaId == selectedSubCategory.id)
      }

      let filteredSabProdutos // filtro 3
      
      if(selectedFlavor == 'Todas'){ // Filtra pelo produto selecionado
          filteredSabProdutos = filteredSubCatProdutos
      }
      else{
        filteredSabProdutos = filteredSubCatProdutos.filter((produto) => produto.sabor.sabor == selectedFlavor)
      }

      setFilteredProdutos(filteredSabProdutos)

  }, [selectedCategory, selectedSubCategory, selectedFlavor])

  /* Alteração da Categoria por Redirecionamento */
  const router = useRouter();
  useEffect(() => {
    if (router.query.categoria === 'Bolos') {
      setSelectedCategory(listOfAtributes.Categorias[1])
    }
    if (router.query.categoria === 'Salgados') {
      setSelectedCategory(listOfAtributes.Categorias[2])
    }
    if (router.query.categoria === 'Doces') {
      setSelectedCategory(listOfAtributes.Categorias[3])
    }
  }, [router.query]);



  const [selectedProduct, setSelectedProduct] = useState([])

  const [showMobileFilter, setShowMobileFilter] = useState(false)

  /* Modais */
  const [openModal, setOpenModal] = useState(false)
  const [openLoginModal, setOpenLoginModal] = useState(false)

  const [openPayModal, setOpenPayModal] = useState(false)
  
  /* Finalizar Compra */
  const [countProduct, setCountProduct] = useState(1)
  const [finalPrice, setFinalPrice] = useState()

  useEffect(() => {
    const unitPrice = parseFloat(selectedProduct.precoUnitario)
    setFinalPrice(unitPrice * countProduct)

  },[selectedProduct, countProduct])
  
  /* Carrinho de Compras */
  const [produtoNoCarrinho, setProdutoNoCarrinho] = useState()

 

   useEffect(() => {

    const produtoNoCarrinho = carrinhoDeCompras.find((produto) => produto.id === selectedProduct.id);
  
    if(produtoNoCarrinho){
      setProdutoNoCarrinho(true)
    }else{
      setProdutoNoCarrinho(false)
    }
    
  },[selectedProduct])

  const adicionarAoCarrinho = produto => {
    const produtoExistente = carrinhoDeCompras.find((item) => item.id === produto.id);

    if (!produtoExistente) {
      const novoCarrinho = [...carrinhoDeCompras, produto];
      setCarrinhoDeCompras(novoCarrinho);
      setCookie(null, 'carrinho', JSON.stringify(novoCarrinho), {
        maxAge: 30 * 24 * 60 * 60, // 30 dias em segundos
        path: '/', // Caminho válido em todo o site
      });
    }

    setOpenModal(false)
    setSelectedProduct([])
    
  }
  
  const removerDoCarrinho = (produto) => {
    const novoCarrinho = carrinhoDeCompras.filter((item) => item.id !== produto.id);
    setCarrinhoDeCompras(novoCarrinho);
    setCookie(null, 'carrinho', JSON.stringify(novoCarrinho), {
      maxAge: 30 * 24 * 60 * 60, // 30 dias em segundos
      path: '/', // Caminho válido em todo o site
    });

    setOpenModal(false)
    setSelectedProduct([])
  }

  const comprarProduto = produto => {
    const produtoExistente = carrinhoDeCompras.find((item) => item.id === produto.id);

    if (!produtoExistente) {
      const novoCarrinho = [...carrinhoDeCompras, produto];
      setCarrinhoDeCompras(novoCarrinho);
      setCookie(null, 'carrinho', JSON.stringify(novoCarrinho), {
        maxAge: 30 * 24 * 60 * 60, // 30 dias em segundos
        path: '/', // Caminho válido em todo o site
      });
    }

    Router.push("/Carrinho")
    
  }

  const handleRegisterPedido = async () => {

    try {
      setRequisição(true)
      const response = await fetch('/api/compra', {
        method: 'PUT',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(

          {idProduto: selectedProduct.id, 
          countProduct, 
          precoUnitario:selectedProduct.precoUnitario, 
          precoFinal: finalPrice,
          idUsuario: user.id }
        ),
      });

      if(!response.ok){
        const errorResponse = await response.json();
        throw new Error(errorResponse.message);
      }
      
    } 
    catch (error) {
      handleError(error.message)
    }
    setRequisição(false)
  }

  const [requisição, setRequisição] = useState()

  return (
    <>
      <Head>
        <title>Produtos</title>
      </Head>

      <Modal tittle={'Confirmar Compra'} isOpen={openPayModal} onClose={() => setOpenPayModal(false)}>
        <div>
          {selectedProduct.length != 0 &&
            <div className="flex justify-between gap-x-3 gap-y-3">

              <div className="flex flex-col gap-2">
                <div className="">
                  <p className='font-semibold'>Produto:</p>
                  <span className='text-gray-700'>{selectedProduct.nome}</span>
                </div>

                <div className="">
                  <p className='font-semibold'>Sabor:</p>
                  <span className='text-gray-700'>{selectedProduct.sabor.sabor}</span>
                </div>
                
                <div className="">
                  <p className='font-semibold'>Unidade:</p>
                  <span className='text-gray-700'>{selectedProduct.unidadeMedida.tipo}</span>
                </div>

                <div className="">
                  <p className='font-semibold'>Preço:</p>
                  <span className='font-semibold text-xl text-pink-500 '>{formatarValorMonetario(finalPrice)}</span>
                </div>

              </div>

              <div className='relative mb-3' >
                <img className='w-28 rounded-xl ' src={`https://res.cloudinary.com/divmuffya/image/upload/v${selectedProduct.imagem.version}/${selectedProduct.imagem.publicId}.${selectedProduct.imagem.format}`} alt={selectedProduct.nome} />
                <div className="">
                  <p className='font-semibold'>Quantidade:</p>
                  <div className="flex items-center gap-3">
                    <button onClick={() => {countProduct != 1 && setCountProduct(countProduct - 1)}} className={`flex justify-center items-center w-6 h-5 font-semibold text-lg rounded-md p-2 pt-1 ${countProduct == 1? 'bg-gray-300' : 'bg-gray-200'}`}>-</button>
                    <span>{countProduct}</span>
                    <button onClick={() => setCountProduct(countProduct + 1)} className='flex justify-center items-center w-6 h-5 font-semibold text-lg bg-gray-200 rounded-md p-2 pt-1'>+</button>
                  </div>
                </div>
              </div>

            </div>
          }
          <div className="md:flex gap-3 justify-center items-center">
            <button disabled={requisição} onClick={handleRegisterPedido} className={`mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-pink-400 px-8 py-2.5 text-base font-medium text-white transition-colors hover:bg-pink-500 ${requisição && 'opacity-70'}`}>
                Finalizar Pedido
            </button>
          </div>
        </div>
      </Modal>


      <Modal tittle={'Olá!'} isOpen={openLoginModal} onClose={() => setOpenLoginModal(false)}>
        <div>
          <p className='text-gray-700'>Para realizar uma compra, é necessário estar logado em nossa plataforma. Faça o login ou crie uma conta para desfrutar de todas as vantagens e facilidades de nossos serviços.</p>
          <div className="md:flex gap-3 justify-center items-center">
            <Link href={'/login'} className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-pink-400 py-1.5 text-base font-medium text-white transition-colors hover:bg-pink-500">Entrar</Link>
            <Link href={'/singup'} className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent py-1.5 text-base font-medium text-black transition-colors hover:bg-gray-200">Criar uma conta</Link>
          </div>
        </div>
      </Modal>

      {/* Modal do Produto*/}
      <Modal tittle={''} isOpen={openModal} onClose={() => setOpenModal(false)}>
        <div>
          {selectedProduct.length != 0 &&
            <div className="flex gap-x-3 gap-y-3">
              <div className='w-1/2 relative mb-3' >
                <img style={{minWidth: "9rem"}} className='w-full rounded-xl ' src={`https://res.cloudinary.com/divmuffya/image/upload/v${selectedProduct.imagem.version}/${selectedProduct.imagem.publicId}.${selectedProduct.imagem.format}`} alt={selectedProduct.nome} />
              </div>

              <div className="w-1/2 mb-4 order-1">

                  <div>
                    <h2 className="text-2xl font-bold"> {selectedProduct.nome} </h2>
                    <p className="text-sm font-bold text-gray-600 -mt-1"> {selectedProduct.subCategoria.tipo} </p>
                  </div>

                  <p className='my-1 font-medium text-gray-600 text-base'>{selectedProduct.descricao}</p>
                  
                  <p className='text-gray-600'>Sabor: {selectedProduct.sabor.sabor}</p>
                  

                  <div className=" mt-2">
                    <p className='text-gray-600 text-xs'>{selectedProduct.unidadeMedida.tipo}</p>
                    <p className='text-xl font-semibold text-pink-500'>{formatarValorMonetario(selectedProduct.precoUnitario)}</p>
                  </div>
                  
              </div>
              
            </div>
          }
          <div className="md:flex gap-3 justify-center items-center">
            <button onClick={() => {if (produtoNoCarrinho) {
                removerDoCarrinho(selectedProduct);
              } else {
                adicionarAoCarrinho(selectedProduct);
              }}} type="submit" className="mt-6 flex w-full items-center justify-center rounded-md border border-pink-400 text-pink-400 px-8 py-2.5 text-base font-medium transition-colors hover:bg-pink-500 hover:text-white">
                {produtoNoCarrinho?  "Remover do Carrinho" : "Adicionar ao Carrinho" }
            </button>

            <button className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-pink-400 px-8 py-2.5 text-base font-medium text-white transition-colors hover:bg-pink-500" onClick={() => {if(!isAuthenticated){
              setOpenLoginModal(true)
              setOpenModal(false)
            }else{
              comprarProduto(selectedProduct)
            }}} >
                Comprar Produto
            </button>
          </div>
        </div>
      </Modal>

      {/* Display de Filtro Mobile */}
      {showMobileFilter == true && 
        <Modal tittle={''} isOpen={showMobileFilter} onClose={() => setShowMobileFilter(false)}>
          <div className="w-full">
            <p className='text-base font-semibold'>Categoria</p>
            <ListBox inputStyle='!bg-gray-50 shadow-sm lg:hover:bg-zinc-700' dropdownStyle='!bg-white' selectedValue={selectedCategory} setSelectedValue={setSelectedCategory} List={listOfAtributes.Categorias}/>
          </div>

          <div className="w-full">
            <p className='text-base font-semibold'>Subcategoria</p>
            <ListBox inputStyle='!bg-gray-50 shadow-sm lg:hover:bg-zinc-700' dropdownStyle='!bg-white' selectedValue={selectedSubCategory} setSelectedValue={setSelectedSubCategory} List={selectedSubcategoriesList}/>
          
          </div>

          <div className="w-full">
            <p className='text-base font-semibold'>Sabor</p>
            {listOfAtributes.Sabores.map((sabor, index) => (
              <label key={index} className='flex justify-start items-center gap-2 mb-1 cursor-pointer'>
                <span
                  className={`w-4 h-4 border rounded-md shadow-sm ${
                    selectedFlavor === sabor.name ? 'bg-pink-300' : 'bg-gray-50 border-gray-300'
                  }`}
                />
                <input className='hidden' onChange={e => setSelectedFlavor(e.target.value)} type='radio' name='selectedFlavor' value={sabor.name}/>
                <p className='text-base'>{sabor.name}</p>
              </label>
            ))}
          </div>
        </Modal>
      }

      <div style={{minHeight: '80vh'}} className='my-5 md:px-20 sm:px-14 max-sm:px-5'>

        <div className="sticky top-0 bg-white w-full flex flex-wrap justify-between items-center py-3 mb-4">
          <h1 className='text-xl font-semibold'>Todos nossos Produtos</h1>
          <div onClick={() => setShowMobileFilter(true)} className={`flex justify-center items-center gap-2 lg:hidden px-3 py-1.5 rounded-md text-white bg-zinc-800 transition-all ${showMobileFilter && '!bg-pink-400'}`}>Filtrar <BsFilter className='text-2xl'/></div>
        </div>

        <div className="grid md:grid-cols-6">

          {/* Sidebar */}
          <div className="max-lg:hidden col-span-1">
            
            {/* SideBar de filtros */}
            <div className="flex flex-col justify-center items-start gap-y-3  p-3 rounded-lg bg-gray-100 shadow-lg">
              <div className="w-full">
                <p className='text-base font-semibold'>Categoria</p>
                <ListBox inputStyle='!bg-gray-50 shadow-sm lg:hover:bg-zinc-700' dropdownStyle='!bg-white' selectedValue={selectedCategory} setSelectedValue={setSelectedCategory} List={listOfAtributes.Categorias}/>
              </div>

              <div className="w-full">
                <p className='text-base font-semibold'>Subcategoria</p>
                <ListBox inputStyle='!bg-gray-50 shadow-sm lg:hover:bg-zinc-700' dropdownStyle='!bg-white' selectedValue={selectedSubCategory} setSelectedValue={setSelectedSubCategory} List={selectedSubcategoriesList}/>
              
              </div>

              <div className="w-full">
                <p className='text-base font-semibold'>Sabor</p>
                {listOfAtributes.Sabores.map((sabor, index) => (
                  <label key={index} className='flex justify-start items-center gap-2 mb-1 cursor-pointer'>
                    <span
                      className={`w-4 h-4 border rounded-md shadow-sm ${
                        selectedFlavor === sabor.name ? 'bg-pink-300' : 'bg-gray-50 border-gray-300'
                      }`}
                    />
                    <input className='hidden' onChange={e => setSelectedFlavor(e.target.value)} type='radio' name='selectedFlavor' value={sabor.name}/>
                    <p className='text-base'>{sabor.name}</p>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center items-start gap-y-3  p-3 rounded-lg bg-gray-100 shadow-lg mt-5">
              <div className="relative w-full flex justify-center items-center rounded-lg transition-all md:hover:scale-105">
                <Image className='w-full h-36 object-cover rounded-lg' src={Background} alt="" />
                <div className="absolute w-full h-full bg-gray-900/40"></div>
                <div className="absolute text-center z-10">
                  <h2 className=' text-base text-white font-extrabold'>Bolos Personalizados</h2>
                  <p className='text-white font-medium'>Faça uma encomenda agora!</p>
                </div>
              </div>
            </div>

          </div>
      
          <div className="col-span-5 max-lg:col-span-6 lg:ml-5">

            {/* Top Produtos */}
            <div className="">
              <h2 className='block sticky top-0 text-lg font-semibold bg-white py-3 mb-2'>Produtos mais vendidos</h2>
              <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-x-5 gap-y-5 px-2">
                
                {Produtos && produtosMaisVendidos.map(produto => (
                  <div key={produto.id} onClick={() => {setOpenModal(true); setSelectedProduct(produto)}} className="p-3 pb-5 rounded-lg bg-gray-100 transition-all h-fit md:hover:scale-105 cursor-pointer shadow-lg">
                    <div className="flex justify-center items-end rounded-lg overflow-hidden">
                        <img className='object-cover' src={`https://res.cloudinary.com/divmuffya/image/upload/v${produto.imagem.version}/${produto.imagem.publicId}.${produto.imagem.format}`} alt={produto.nome} />
                    </div>
                  
                    <div className="mt-4 flex flex-col">
                        <p className='black font-semibold text-sm 2xl:text-lg text-center'>{produto.nome}</p>
                        <p className='text-gray-600 font-medium text-sm 2xl:text-base text-center'>{produto.subCategoria.tipo} - {produto.sabor.sabor}</p>
                        <p className='text-gray-600 font-medium text-sm 2xl:text-base text-center -mt-1'>{produto.unidadeMedida.tipo}</p>
                        <p className='text-pink-400 font-sans font-semibold text-lg 2xl:text-xl text-center'>{formatarValorMonetario(produto.precoUnitario)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Todos Produtos */}
            <div className="mt-3">
              <h2 className='col-span-5 block text-lg font-semibold mb-2'>Todos Produtos</h2>
              <div className="col-span-5 grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-x-5 gap-y-5 px-2">
                {Produtos && filteredProdutos.map(produto => (
                  <div key={produto.id} onClick={() => {setOpenModal(true); setSelectedProduct(produto)}} className="p-3 pb-5 rounded-lg bg-gray-100 transition-all h-fit md:hover:scale-105 cursor-pointer shadow-lg">
                    <div className="flex justify-center items-end rounded-lg overflow-hidden">
                        <img className='object-cover' src={`https://res.cloudinary.com/divmuffya/image/upload/v${produto.imagem.version}/${produto.imagem.publicId}.${produto.imagem.format}`} alt={produto.nome} />
                    </div>
                  
                    <div className="mt-4 flex flex-col">
                        <p className='black font-semibold text-sm 2xl:text-lg text-center'>{produto.nome}</p>
                        <p className='text-gray-600 font-medium text-sm 2xl:text-base text-center'>{produto.subCategoria.tipo} - {produto.sabor.sabor}</p>
                        <p className='text-gray-600 font-medium text-xs lg:text-sm text-center -mt-1'>{produto.unidadeMedida.tipo}</p>
                        <p className='text-pink-400 font-sans font-semibold text-lg 2xl:text-xl text-center'>{formatarValorMonetario(produto.precoUnitario)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </>
  )
}

export async function getStaticProps(ctx) {
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

  await prisma.$disconnect();

    const produtosComPrecoString = Produtos.map((produto) => {
      return {
        ...produto,
        precoUnitario: produto.precoUnitario.toString(),
      };
    });

    return {
      props: {
          filteredAtributes,
          Produtos: produtosComPrecoString
      }
  }
}

Produtos.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}