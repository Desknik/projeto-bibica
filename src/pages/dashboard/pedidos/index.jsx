import React, { useEffect, useRef, useState } from 'react'
import Layout from '../layout'
import styles from '../../../styles/dashboard/dashboard.module.css'

import { CgDetailsMore } from 'react-icons/cg'
import { BsEye, BsEyeFill, BsEyeSlash, BsFilter } from 'react-icons/bs'

import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client'
import Modal from '@/components/Modal'
import ListBox from '@/components/ListBox'


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
        setFilteredList(list.filter(item => item.usuario.dados.nome.toUpperCase().includes(searchValue.trim().toUpperCase())))
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

export default function Pedidos({Pedidos, situacoes, todasSituacoes}) {

  const [pedidos, setPedidos] = useState(Pedidos)

  const listOfSituations = [
    { id: 0, name: 'Todas' },
    ...situacoes
  ];

  const updateOrders = async (pedido, situacao) => {

    try {
      // Montar o objeto com as informações a serem enviadas para a API
  
      // Enviar a requisição para a API
      const response = await fetch('/api/dashboard/getPedidos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
  
      if (response.ok) {
        const data = await response.json()

        setPedidos(data.todosPedidos)
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


  const [descricao, setDescricao] = useState()

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

  const formatarData = dataString => {
    const data = new Date(dataString);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = String(data.getFullYear());
    return `${dia}/${mes}/${ano}`;
  }

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
    setDescricao(textoFormatado);
  };


  const [pedidoModal, setPedidoModal] = useState(false)
  const [selectedPedido, setSelectedPedido] = useState()
  const [selectedSituacao, setSelectedSituacao] = useState(situacoes[0])

  const openModal = pedido => {
    setSelectedPedido(pedido)

    const index = situacoes.findIndex((situacao) => situacao.id === pedido.situacaoId);
    if (index !== -1) {
      setSelectedSituacao(situacoes[index]);
    }

    setSelectedPedido(pedido)

    setDescricao(pedido.descricao)
    setPedidoModal(true)
  }

  const [requisição, setRequisição] = useState(false)

  const atualizarPedido = async (pedido, situacao, descricao) => {

    try {  
      setRequisição(true)

      const response = await fetch('/api/dashboard/updateOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pedidoId: pedido.id,
          situacaoId: situacao.id,
          descricao
        }),
      });
  
      if (response.ok) {
        updateOrders()
        setPedidoModal(false)
      } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message);
      }
    } catch (error) {
      handleError(error.message)
    }
    setRequisição(false)
  }

  /* Filtragem */

  const [selectedFilteredSituacao, setSelectedFilteredSituacao] = useState(listOfSituations[0])

  const[filteredPedidos, setFilteredPedidos] = useState(pedidos)
  const[searchFilteredProdutos, setSearchFilteredProdutos] = useState(filteredPedidos)
  const [visibility, setVisibility] = useState(1)

  useEffect(() => {

    let filteredSituacao

    if(selectedFilteredSituacao.name == 'Todas'){ // Filtra pelo produto selecionado
      filteredSituacao = pedidos
    }
    else{
      filteredSituacao = pedidos.filter((pedido) => pedido.situacaoId == selectedFilteredSituacao.id)
    }

    if(visibility == 2){ //Filtra pela disponibilidade (pelo RadioGroup)

      setFilteredPedidos(filteredSituacao.filter((pedido) => !pedido.situacaoId == 7));
    }
    else if(visibility == 3){
      setFilteredPedidos(filteredSituacao.filter((pedido) => pedido.situacaoId == 7));
    }
    else{
      setFilteredPedidos(filteredSituacao)
    }

  },[pedidos, visibility, selectedFilteredSituacao])

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

      <Modal tittle={'Detalhes do Pedido'} isOpen={pedidoModal} onClose={() => setPedidoModal(false)}>
        {!!selectedPedido &&
          <div className="flex flex-col gap-3 w-full">

            <p className='text-base font-medium whitespace-nowrap'>Código do Pedido: <span className='font-normal'>{selectedPedido.id}</span></p>
            <div>
              <p className='text-base font-medium whitespace-nowrap'>Código do Cliente: <span className='font-normal'>{selectedPedido.usuarioId}</span></p>
              <p className='text-base font-medium'>Cliente: <span className='font-normal'>{selectedPedido.usuario.dados.nome}</span></p>
              <p className='text-base font-medium'>Telefone: <span className='font-normal'>{selectedPedido.usuario.dados.telefone}</span></p>
            </div>

            <p className='<stext-base font-medium'>Pedido:</p>
            <div className={`h-36 bg-gray-100 rounded-lg shadow-inner  overflow-auto ${styles.scroll}`}>
              {selectedPedido.detalhes.map (detalhe => (
                <div className="border-b border-b-gray-200 p-3">
                  <div className="flex items-start gap-3">
                      <div className="w-20 flex justify-center items-end rounded-lg overflow-hidden">
                        <img className='object-cover' src={`https://res.cloudinary.com/divmuffya/image/upload/v${detalhe.produto.imagem.version}/${detalhe.produto.imagem.publicId}.${detalhe.produto.imagem.format}`} alt={detalhe.produto.nome} />
                      </div>

                      <div className="flex flex-col gap-1">
                        <p className='text-base font-medium'>Produto: <span className='font-normal'>{detalhe.quant}x {detalhe.produto.nome}</span></p>
                        <div className="flex gap-1">
                          <p className='text-base font-medium'>Sabor: <span className='font-normal'>{detalhe.produto.sabor.sabor}</span></p>
                          <p className='text-base font-medium'>Cor: <span className='font-normal'>{detalhe.produto.cor.cor}</span></p>
                        </div>
                        <p className='text-base font-medium'>Unidade de Medida: <span className='font-normal'>{detalhe.produto.unidadeMedida.tipo}</span></p>
                      </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <div className="">
                <p className='text-base font-medium'>Situaçao:</p>
                {selectedSituacao.id == 7 && <p className='text-gray-500'>{selectedSituacao.name}</p>}
               
                {selectedSituacao.id != 7 && <ListBox inputStyle='!bg-gray-50 shadow-sm lg:hover:bg-zinc-700' dropdownStyle='!bg-white' selectedValue={selectedSituacao} setSelectedValue={setSelectedSituacao} List={situacoes}/>}
              
              </div>

              <p className='text-base font-medium'>Pago: <span className='font-normal'>{selectedPedido.pago? 'Sim' : 'Não'}</span></p>
            </div>
            <p className='text-base font-medium'>Descricão:</p>
            <div className="">
              <div className="">
                <textarea
                id="descricao"
                name="descricao"
                value={descricao}
                onChange={formatarDescricao}
                maxLength={400}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="flex justify-between items-end">
              <p className='text-lg font-medium'>Preço Total: <span className='font-normal'>{selectedPedido.precoTotal}</span></p>
              <button disabled={requisição} onClick={() => atualizarPedido(selectedPedido, selectedSituacao, descricao)} className={`rounded-md shadow-md px-2 py-1 transition-colors ${!requisição? 'bg-pink-400 text-white md:hover:bg-pink-500' : 'bg-pink-300 text-gray-200'}`}>Atualizar Pedido</button>
            </div>
        </div>
        }
      </Modal>

      <div className="flex justify-between items-end flex-wrap mt-3">
          <div className="w-full flex flex-wrap gap-3 items-end justify-end max-sm:w-full">
              <Search list={filteredPedidos} setFilteredList={setSearchFilteredProdutos}/>
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
                </div>
                
                <div className="flex flex-wrap gap-3 items-end max-sm:w-full">
                  <div className="w-36 max-sm:w-full ">
                    <span className='text-white'>Situação</span>
                    <ListBox inputStyle='lg:hover:bg-zinc-700' selectedValue={selectedFilteredSituacao} setSelectedValue={setSelectedFilteredSituacao} List={listOfSituations}/>
                  </div>
                </div>

              </div>
          </div>
      </div>

      <div className={`w-full t h-96 rounded-lg bg-zinc-800 mt-5 overflow-scroll ${styles.scroll}`}>
        <table className='w-full font-sans'>
          <thead className='sticky top-0 bg-zinc-900'>
            <tr>
              <th scope='col' className='border-r border-neutral-700 text-lg font-medium text-gray-300 px-6 py-2 text-left'>#</th>
              <th scope='col' className='border-r border-neutral-700 text-lg font-medium text-gray-300 px-6 py-2 text-left'>Cliente</th>
              <th scope='col' className='border-r border-neutral-700 text-lg font-medium text-gray-300 px-6 py-2 text-center'>Produtos</th>
              <th scope='col' className='border-r border-neutral-700 whitespace-nowrap text-lg font-medium text-gray-300 px-6 py-2 text-left'>Data do Pedido</th>
              <th scope='col' className='border-r border-neutral-700 whitespace-nowrap text-lg font-medium text-gray-300 px-6 py-2 text-left'>Data de Pagamento</th>
              <th scope='col' className='border-r border-neutral-700 whitespace-nowrap text-lg font-medium text-gray-300 px-6 py-2 text-left'>Data de Entrega</th>
              <th scope='col' className='border-r border-neutral-700 text-lg font-medium text-gray-300 px-6 py-2 text-center'>Situação</th>
              <th scope='col' className='border-r border-neutral-700 text-lg font-medium text-gray-300 px-6 py-2 text-left'>Valor</th>
            </tr>
          </thead>
          <tbody>
            {searchFilteredProdutos.map(pedido => (
              <tr onClick={() => openModal(pedido)} className='even:bg-zinc-700 md:hover:bg-zinc-500 cursor-pointer'>
                <td className='px-6 py-4 whitespace-nowrap text-base font-normal text-gray-400'>{pedido.id}</td>
                <td className='px-6 py-4 text-base text-ellipsis font-normal text-gray-400'>{obterPrimeiroNome(pedido.usuario.dados.nome)}</td>
                <td className='px-6 py-4 whitespace-nowrap text-base font-normal text-gray-400 text-center'>{pedido.detalhes.length}</td>
                <td className='px-6 py-4 whitespace-nowrap text-center text-base font-normal text-gray-400'>{formatarData(pedido.dataPedido)}</td>
                <td className='px-6 py-4 whitespace-nowrap text-center text-base font-normal text-gray-400'>{pedido.dataPagamento? formatarData(pedido.dataPagamento) : '--'}</td>
                <td className='px-6 py-4 whitespace-nowrap text-center text-base font-normal text-gray-400'>{pedido.dataEntrega? formatarData(pedido.dataEntrega) : '--'}</td>
                <td className='px-6 py-4 whitespace-nowrap text-base font-normal text-center'><span className={`${pedido.situacaoId == 1 && 'text-yellow-500'} ${pedido.situacaoId == 2 && 'text-orange-500'} ${pedido.situacaoId == 3 && 'text-blue-500'} ${pedido.situacaoId == 4 && 'text-purple-500'} ${pedido.situacaoId == 5 && 'text-purple-500'} ${pedido.situacaoId == 6 && 'text-green-500'} ${pedido.situacaoId == 7 && 'text-red-500'}`}>{pedido.situacao.situacao}</span></td>
                <td className='px-6 py-4 whitespace-nowrap text-base font-normal text-gray-400'>{formatarValorMonetario(pedido.precoTotal)}</td>
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

  const pedidos = await prisma.pedido.findMany(
    {
      include:{
        usuario:{
          select:{
            dados:{
              select:{
                id:true,
                nome:true,
                telefone:true
              }
            }
          }
        },
        situacao:true,
        detalhes: {
          include:{
            produto: {select:{
              nome: true,
              imagem:true,
              sabor:{select:{sabor:true}},
              unidadeMedida:{select:{tipo: true}},
              cor:{select:{cor: true}},

            }}
          }
        }
      }
    }
  )

  const situacoes = await prisma.situacao.findMany()

  const todasSituacoes = situacoes.map((situacao) => ({
    id: situacao.id,
    name: situacao.situacao,
  }));

  const situacoesRemapeadas = todasSituacoes.filter(situacao => [3, 4, 5, 6, 7].includes(situacao.id));

  // Converter a propriedade `dataPedido` para uma string
  const pedidosFormatados = pedidos
  .sort((a, b) => b.id - a.id) // Ordenação decrescente pelo ID
  .map((pedido) => {
    return {

      ...pedido,
      dataPedido: pedido.dataPedido.toISOString(),
      dataPagamento: pedido.dataPagamento? pedido.dataPagamento.toISOString() : null,
      dataEntrega: pedido.dataEntrega? pedido.dataEntrega.toISOString() : null,
      desconto: pedido.desconto ? pedido.desconto.toString() : null,
      precoTotal: pedido.precoTotal.toString(),
      detalhes: pedido.detalhes.map(detalhe => ({
        ...detalhe,
        precoUnitario: detalhe.precoUnitario.toString(),
      })),

    };
  });

  return {
      props: {Pedidos: pedidosFormatados, situacoes:situacoesRemapeadas, todasSituacoes}
  }
}