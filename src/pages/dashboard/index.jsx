import React, { useEffect, useRef, useState } from 'react'
import Layout from './layout'
import { BsCheck, BsX } from "react-icons/bs";

import styles from '../../styles/dashboard/dashboard.module.css'
import {Card, ExtendedCard} from '../../components/Dashboard/DashCards';
import Calendar from '../../components/Dashboard/DashCalendar'
import { createInitialuser } from '@/utils/db';
import { parseCookies } from 'nookies';

import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import Modal from '@/components/Modal';
import ListBox from '@/components/ListBox';


export default function Dashboard({pedidos, pedidosPendentes, ganhosMes, ganhosDiario, ganhosDia,  vendasMes, vendasDia, vendasRecentes, produtosMaisVendidos, situacoes}) {

  const [ganhoMes, setGanhoMes] = useState(ganhosMes)
  const [ganhoDiario, setGanhoDiario] = useState(ganhosDiario)
  const [ganhoData, setGanhoData] = useState(0)
  const [ganhoDia, setGanhoDia] = useState(ganhosDia)
  
  const [ todosPedidos, setPedidos ] = useState(pedidos)
  const [ todosPedidosPendentes, setTodosPedidosPendentes ] = useState(pedidosPendentes)

  const[vendaMes, setVendaMes] = useState(vendasMes)
  const[vendaDia, setVendaDia] = useState(vendasDia)
  const[vendaRecentes, setVendaRecentes] = useState(vendasRecentes)
  const[topProdutos, setTopProdutos] = useState(produtosMaisVendidos)


  const[selectedDate, setSelectedDate] = useState({})

  /* Atualizar os Pedidos */
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

        setGanhoMes(data.ganhosMes)
        setGanhoDiario(data.ganhosDiario)
        setGanhoDia(data.ganhosDia)

        setPedidos(data.pedidos)

        setTodosPedidosPendentes(data.pedidosPendentes)

        setVendaMes(data.vendasMes)
        setVendaDia(data.vendasDia)
        setVendaRecentes(data.vendasRecentes)
        setTopProdutos(data.produtosMaisVendidos)
        getGanhoData()

      } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message);
      }
    } catch (error) {
      handleError(error.message)
    }
  
  }

  /* Função que pega o lucro por Data */
  const pickDate = (ranges) => {
    setSelectedDate(ranges)
  };

  const getGanhoData = async () => {

    try{
      setRequisição(true)
        const response = await fetch('/api/dashboard/getProfitDate',{
            method: 'POST', 
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({selectedDate}),
        });
        if(response.ok){
            setGanhoData(await response.json())
        }else{
            const errorResponse = await response.json();
            throw new Error(errorResponse.message);
        }
      }catch(error){
        handleError(error.message)
      }
      setRequisição(false)

  }

  useEffect(() => {
    getGanhoData()
  },[])

  /* Situação do pedido */

  const [situacaoModal, setSituacaoModal] = useState(false)
  const [situacaoConfirmModal, setSituacaoConfirmModal] = useState(false)
 

  const [selectedSituacao, setSelectedSituacao] = useState(situacoes[0])
  const [selectedPedido, setSelectedPedido] = useState()

  const [requisição, setRequisição] = useState(false)
  

  const atualizarSituacaoPedido = async (pedido, situacao) => {

    try {  
      // Enviar a requisição para a API

      setRequisição(true)

      const response = await fetch('/api/dashboard/updateOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pedidoId: pedido.id,
          situacaoId: situacao,
        }),
      });
  
      if (response.ok) {
        updateOrders()
        setSituacaoConfirmModal(false)
      } else {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message);
      }
    } catch (error) {
      handleError(error.message)
    }
    setRequisição(false)
  }

  const handleSituacao = pedido => {
    const index = situacoes.findIndex((situacao) => situacao.id === pedido.situacaoId);
    if (index !== -1) {
      setSelectedSituacao(situacoes[index]);
    }

    setSelectedPedido(pedido)
    setSituacaoModal(true)
  }

  /* Funções básicas */
  function formatarData(dataString) {
    const data = new Date(dataString);
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = String(data.getFullYear());
    return `${dia}/${mes}/${ano}`;
  }

  function obterPrimeiroNome(nomeCompleto) {
    const nomes = nomeCompleto.split(' ');
    return nomes[0];
  }

  const formatarValorMonetario = (valor) => {
    const valorFormatado = parseFloat(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return valorFormatado;
  }


  const [calendarioModal, setCalendarioModal] = useState(false)

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
    <div style={{maxWidth:'100rem'}} className='w-full mx-auto px-5'>

      {/* Mensagem de Erro*/}
            <span ref={errorBoxRef} className='absolute bottom-5 right-5 z-30  opacity-0 transition-opacity duration-300 ease-in-out bg-red-400/60 border-2 border-red-500 text-red-200 font-medium rounded-lg inline-block px-2 py-2 my-1'>{errorMessage}</span>

      <Modal tittle={'Confirmar Alteração'} isOpen={situacaoConfirmModal} onClose={() => setSituacaoConfirmModal(false)}>
        <div className="w-full">
          <p className='text-base'>Deseja realmente alterar a situação do pedido?</p>
          <p className='text-base font-medium'>Situação selecionada: <span className='font-normal'>{selectedSituacao.name}</span></p>
          
          <div className="flex justify-between gap-3">
            <button onClick={() => setSituacaoConfirmModal(false)} className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent px-8 py-2.5 text-base font-medium text-black transition-colors hover:bg-gray-200">Cancelar</button>
            <button disabled={requisição} onClick={() => atualizarSituacaoPedido(selectedPedido,selectedSituacao.id )} className={`mt-6 flex w-full items-center justify-center rounded-md border border-transparent px-8 py-2.5 text-base font-medium transition-colors ${!requisição? 'bg-pink-400 text-white md:hover:bg-pink-500' : 'bg-pink-300 text-gray-200'}`}>Confirmar</button>
          </div>
        </div>
      </Modal>

      <Modal tittle={'Mudar a situação do Pedido'} isOpen={situacaoModal} onClose={() => setSituacaoModal(false)}>
        <div className="w-full">
          <p className='text-base font-semibold'>Situação</p>
          <ListBox inputStyle='!bg-gray-50 shadow-sm lg:hover:bg-zinc-700' dropdownStyle='!bg-white' selectedValue={selectedSituacao} setSelectedValue={setSelectedSituacao} List={situacoes}/>
          <button onClick={() => {setSituacaoConfirmModal(true); setSituacaoModal(false)}} className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-pink-400 px-8 py-2.5 text-base font-medium text-white transition-colors hover:bg-pink-500">Alterar</button>
        </div>
      </Modal>

      <Modal tittle={''} isOpen={calendarioModal} onClose={() => setCalendarioModal(false)} sx={'relative z-50 transform rounded-lg bg-zinc-800 text-left shadow-xl transition-all max-md:w-full max-md:mx-3 sm:my-8 sm:w-full sm:max-w-lg px-4 pb-4 pt-5'}>
        <div className="flex justify-center items-center w-full">
          <Calendar onClick={getGanhoData} onChange={pickDate} requisição={requisição}/>
        </div>
      </Modal>

      <div className={`grid lg:grid-cols-4 md:grid-cols-2 gap-x-8 gap-y-5 h-full ${styles.gridTemplate}`}>

        <div className="lg:col-span-3 md:col-span-2 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1  gap-x-8 gap-y-5 -mt-16 z-10">
          <Card  bg={"bg-gradient-to-br from-pink-400 via-pink-500 to-pink-700"} titulo="Lucro do Mês" ganho={ganhoMes}/>

          <Card bg={"bg-gradient-to-r from-blue-600 to-violet-600"} titulo="Lucro Diário" ganho={ganhoDiario}/>
         
          <Card openModal={setCalendarioModal} bg={"bg-gradient-to-r from-amber-500 to-orange-500"} titulo="Lucro Por Data" ganho={ganhoData} data={true}/>
          
          <Card bg={"bg-gradient-to-l from-zinc-800 via-zinc-700 to-zinc-800"} titulo="Lucro do Dia" ganho={ganhoDia}/>
         
          <ExtendedCard bg={"bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800"} vendaMes={vendaMes} vendaDia={vendaDia}/>
        </div>

        <div className="lg:flex hidden lg:col-span-1 md:row-span-1 lg:-mt-16">
          <Calendar onClick={getGanhoData} onChange={pickDate}/>
        </div>
      </div>

        
      <div className={`grid pt-5 pb-5 gap-x-8 gap-y-5 ${styles.gridTemplate}`}>
        <div className="order-last lg:col-span-3 grid lg:grid-cols-3 max-lg:grid-cols-1 gap-x-8 gap-y-5">

          {/* Novos Pedidos*/}
          <div className="relative col-span-1">
            <h2 className='text-white font-bold text-xl pb-3'>Novos Pedidos</h2>

            <div className="lg:block hidden absolute bottom-0 w-full h-5 z-10 bg-gradient-to-t from-neutral-900 to-transparent"></div>
            <div className={`grid max-lg:grid-flow-col gap-5 pr-3 lg:h-60 h-52 lg:overflow-y-scroll max-lg:overflow-x-scroll ${styles.scroll} pb-5`}>
             
              {!!todosPedidosPendentes && todosPedidosPendentes.map(pedido => (
                  <div key={pedido.id} className={`max-lg:w-72 h-44 px-3 rounded-2xl bg-zinc-800 transition-all lg:overflow-x-scroll  ${styles.scroll}`}>
                    <div style={{minWidth: '16rem'}} className="relative w-full h-full">
                      <div className="flex justify-between  pt-2">
                        <span className='text-white font-bold text-lg'>{pedido.usuario.dados.nome}</span>
                        <span className='text-pink-400 font-semibold font-sans text-md'>#{pedido.id}</span>
                      </div>
    
                      <div className='w-72'>
                        <ul className='flex flex-col flex-wrap h-16 font-sans'>
                          <li><span className='text-gray-400 font-medium text-sm'>Produtos: {pedido.detalhes.length}</span></li>
                          <li><span className='text-gray-400 font-medium text-sm'>Data: {formatarData(pedido.dataPedido)}</span></li>
                          <li><span className='text-gray-400 font-medium text-sm'>Tel: {pedido.usuario.dados.telefone}</span></li>
                        </ul>
                        <span className='inline-block text-pink-400 font-light text-sm cursor-pointer transition-all hover:opacity-90'>Ver detalhes</span>
                      </div>
    
                        <span className='absolute bottom-5 text-2xl font-bold text-white tabular-nums font-sans'>{formatarValorMonetario(pedido.precoTotal)}</span>
                        <div className="absolute bottom-5 right-0 flex gap-2">
                          <button disabled={requisição} onClick={() => {atualizarSituacaoPedido(pedido, 2)}} className={`flex justify-center items-center w-14 h-8 rounded-lg transition-all bg-zinc-500 hover:opacity-70 ${requisição && 'opacity-70'}`}><BsCheck className='text-white text-2xl'/></button>
                          <button disabled={requisição} onClick={() => {atualizarSituacaoPedido(pedido, 7)}} className={`flex justify-center items-center w-14 h-8 rounded-lg transition-all bg-red-500 hover:opacity-70 ${requisição && 'opacity-70'}`}><BsX className='text-white text-2xl'/></button>
                      </div>
                    </div>
                  </div>
                ))
              }

              {!todosPedidosPendentes || !todosPedidosPendentes.length > 0 &&
              <div className="flex justify-center items-center h-44 px-3 rounded-2xl bg-zinc-800">
                <p className='font-medium text-white text-center text-lg'>Não há pedidos pendentes por agora!</p>
              </div>
              }


            </div>
          </div>

          {/*Tabela de Pedidos*/}
          <div className="lg:col-span-2 md:col-span-1 transition-all">
            <h2 className='text-white font-bold text-xl pb-3'>Pedidos</h2>
            <div style={{height: 'calc(100% - 2.5rem)', maxHeight: '250px'}} className={`w-full rounded-2xl bg-zinc-800 overflow-x-scroll ${styles.scroll}`}>
              <table className='w-full rounded-2xl mt-3 font-sans'>
                <thead>
                  <tr>
                    <th scope='col' className='text-lg font-semibold text-white text-center px-3'>Código</th>
                    <th scope='col' className='text-lg font-semibold text-white text-left px-3'>Cliente</th>
                    <th scope='col' className='text-lg font-semibold text-white text-center'>Produtos</th>
                    <th scope='col' className='text-lg font-semibold text-white text-left px-3'>Data</th>
                    <th scope='col' className='text-lg font-semibold text-white text-left px-3'>Preço</th>
                    <th scope='col' className='text-lg font-semibold text-white text-center px-3'>Situação</th>
                  </tr>
                </thead>
                <tbody>
                  {!!todosPedidos && todosPedidos.map(pedido => (
                      <tr key={pedido.id} onDoubleClick={() => {if(pedido.situacaoId > 1){handleSituacao(pedido)}}}  className='cursor-pointer md:hover:bg-zinc-600 '>
                        <td scope='col' className='text-base font-medium text-gray-400 text-center px-3'>{pedido.id}</td>
                        <td scope='col' className='text-base font-medium text-gray-400 text-left px-3'>{obterPrimeiroNome(pedido.usuario.dados.nome)}</td>
                        <td scope='col' className='text-base font-medium text-gray-400 text-center px-3'>{pedido.detalhes.length}</td>
                        <td scope='col' className='text-base font-medium text-gray-400 text-left px-3'>{formatarData(pedido.dataPedido)}</td>
                        <td scope='col' className='text-base font-medium text-gray-400 text-left px-3'>{formatarValorMonetario(pedido.precoTotal)}</td>
                        <td scope='col' className={`text-base font-normal text-center px-3 ${pedido.situacaoId == 1 && 'text-yellow-500'} ${pedido.situacaoId == 2 && 'text-orange-500'} ${pedido.situacaoId == 3 && 'text-blue-500'} ${pedido.situacaoId == 4 && 'text-purple-500'} ${pedido.situacaoId == 5 && 'text-purple-500'} ${pedido.situacaoId == 6 && 'text-green-500'} ${pedido.situacaoId == 7 && 'text-red-500'}`}><span onClick={() => {if(pedido.situacaoId > 1 && pedido.situacaoId != 7 ){handleSituacao(pedido)}}}>{pedido.situacao.situacao}</span></td>
                        <td scope='col' className='w-28 col-span-1 text-base font-light text-pink-400 cursor-pointer text-center p-2 transition-all hover:opacity-90'><Link href={{}}>Detalhes</Link></td>
                      </tr>
                    )) 
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="order-first lg:order-last font-sans col-span-1 gap-y-5 z-10 grid grid-rows-2">
            
            <div className={`relative bg-zinc-800 shadow-md rounded-2xl px-3 pt-2 overflow-x-scroll ${styles.scroll} `}>
              <div className="absolute left-0 bottom-0 w-full h-5 bg-gradient-to-t from-zinc-800 to-transparent"></div>
              <div style={{minWidth:'14rem'}} className="w-full">

                
                
                <div className="flex justify-between items-center">
                  <p className='text-white font-bold text-lg'>Mais vendidos</p>
                  <Link href={'/dashboard/produtos'} className='inline-block text-pink-400 font-light text-sm cursor-pointer transition-all hover:opacity-90'>Ver todas</Link>
                </div>

                <div className={`max-h-24 overflow-y-scroll pr-1 ${styles.scroll} `}>

                  {!!topProdutos && topProdutos.map(produto => (

                    <div key={produto.id} className="flex justify-between items-start my-2">
                      <div className="">
                        <p className='text-white font-normal text-base -mb-2'>{produto.nomeProduto}</p>  
                        <span className='text-gray-400 font-normal text-sm mt-0'>{produto.nomeSubCategoria}</span>
                      </div>
                      <span className='inline-block text-white font-normal text-sm'>{produto.quantidadeVendas}</span>
                    </div>
                    ))
                  }
                </div>

                {!topProdutos || !topProdutos.length > 0 && 
                  <div className="flex justify-center items-center h-24 px-3 rounded-2xl bg-zinc-800">
                    <p className='text-white font-normal text-center text-base mb-7'>Nenhum Produto Vendido Recentemente</p>
                  </div>
                }
                
              </div>
            </div>


            <div className={`relative bg-zinc-800 shadow-md rounded-2xl px-3 pt-2 overflow-x-scroll ${styles.scroll} `}>
              <div className="absolute left-0 bottom-0 w-full h-5 bg-gradient-to-t from-zinc-800 to-transparent"></div>
              <div style={{minWidth:'14rem'}} className="w-full">
                
                <div className="flex justify-between items-center">
                  <p className='text-white font-bold text-lg'>Vendas Recentes</p>
                  <Link href={{}} className='inline-block text-pink-400 font-light text-sm cursor-pointer transition-all hover:opacity-90'>Ver todas</Link>
                </div>
             
                <div className={`max-h-24 overflow-y-scroll pr-1 ${styles.scroll} `}>

                  {!!vendaRecentes && vendaRecentes.map(venda => (

                    <div key={venda.id} className="flex justify-between items-start my-2">
                      <div className="">
                        <p className='text-white font-normal text-base -mb-2'>{obterPrimeiroNome(venda.nomeCliente)}</p>  
                        <span className='text-gray-400 font-normal text-sm mt-0'>{venda.horasAtras}</span>
                      </div>
                      <span className='inline-block text-white font-normal text-sm'>{formatarValorMonetario(venda.precoVenda)}</span>
                    </div>

                    ))
                  }

                  {!vendaRecentes.length > 0 && 
                     <div className="flex justify-center items-center h-24 px-3 rounded-2xl bg-zinc-800">
                        <p className='text-white font-normal text-center text-base mb-7'>Sem vendas Recentes</p>
                     </div>
                  }

                </div>
              </div>
            </div>

         </div>
      </div>

    </div>
  )
}




Dashboard.getLayout = function getLayout(page) {
    return (
      <Layout>
        {page}
      </Layout>
    )
}

export async function getServerSideProps(ctx) {
  await createInitialuser();

  const prisma = new PrismaClient()

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

   
    const hoje = new Date();
    const currentDay = hoje.getDate();
  
    // Obtém o primeiro dia do mês atual
    const firstDayOfMonth = new Date(hoje.getFullYear(), hoje.getMonth(), 1);


  /* Lucro */

  // Obter o ganho no mês
  const ganhoMes = await prisma.pedido.aggregate({
    _sum: {
      precoTotal: true,
    },
    where: {
      dataPagamento: {
        gte: firstDayOfMonth, // Início do mês atual
        lt: hoje, // Fim do mês atual
      },
      pago: true, // Filtrar apenas os pedidos pagos
    },
  });

  // Obter o ganho diário (média dos últimos 7 dias)
  const ganhoDiario = await prisma.pedido.aggregate({
    _avg: {
      precoTotal: true,
    },
    where: {
      dataPagamento: {
        gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T00:00:00Z', // 7 dias atrás
        lt: hoje, // Fim do dia atual
      },
      pago: true, // Filtrar apenas os pedidos pagos
    },
  });

  // Obter o ganho do dia atual
  const ganhoDia = await prisma.pedido.aggregate({
    _sum: {
      precoTotal: true,
    },
    where: {
      dataPagamento: {
        gte: new Date().toISOString().split('T')[0] + 'T00:00:00Z', // Início do dia atual
        lt: new Date().toISOString().split('T')[0] + 'T23:59:59Z', // Fim do dia atual
      },
      pago: true, // Filtrar apenas os pedidos pagos
    },
  });
  
   /* Vendas */

   // Query para buscar os pedidos do mês atual
   const vendasMes = await prisma.pedido.findMany({
    where: {
      dataPedido: {
        gte: firstDayOfMonth, // A partir do primeiro dia do mês atual
        lte: hoje,
      },
      pago:true,
      situacaoId:{
        in: [ 3, 4, 5, 6]
      }
    },
    include: {
      detalhes: true, // Inclui os detalhes dos pedidos
    },
  });

  // Filtra os pedidos que foram feitos no dia atual
  const vendasDia = vendasMes.filter((pedido) => {
    const pedidoDay = pedido.dataPagamento.getDate();
    return pedidoDay === currentDay;
  });

  const seteDiasAtras = new Date(hoje.getTime() - 7 * 24 * 60 * 60 * 1000); // Data de sete dias atrás

  // Obter as vendas recentes
  const vendasRecentes = await prisma.pedido.findMany({
    where: {
      dataEntrega: {
        gte: seteDiasAtras,
        lt: hoje,
      },
      situacaoId: {
        in: [3, 4, 5, 6, 7], // Situação ID 1, 2, 3, 4 e 5
      },
      pago:true
    },
    include: {
      usuario: {
        select: {
          dados: {
            select: {
              nome: true,
            },
          },
        },
      },
    },
    orderBy: {
      dataEntrega: 'desc', // Ordenar por data de pedido descendente (mais recente primeiro)
    },
    take: 10, // Limitar a 10 vendas recentes
  });

  // Função para formatar as horas atrás
  function formatarHorasAtras(dataPedido) {
    const diffHoras = Math.floor((hoje - dataPedido) / (1000 * 60 * 60));

    if (diffHoras < 24) {
      if (diffHoras === 1) {
        return 'Há 1 hora';
      } else {
        return `Há ${diffHoras} horas`;
      }
    } else {
      const diffDias = Math.floor(diffHoras / 24);

      if (diffDias === 1) {
        return 'Há 1 dia';
      } else {
        return `Há ${diffDias} dias`;
      }
    }
  }

  // Função para formatar as horas atrás
  function formatarHorasAtras(dataPedido) {
  const diffMilissegundos = hoje - dataPedido;
  const diffMinutos = Math.floor(diffMilissegundos / (1000 * 60));

  if (diffMinutos < 60) {
    if (diffMinutos === 1) {
      return 'Há 1 minuto';
    } else {
      return `Há ${diffMinutos} minutos`;
    }
  } else {
    const diffHoras = Math.floor(diffMinutos / 60);

    if (diffHoras < 24) {
      if (diffHoras === 1) {
        return 'Há 1 hora';
      } else {
        return `Há ${diffHoras} horas`;
      }
    } else {
      const diffDias = Math.floor(diffHoras / 24);

      if (diffDias === 1) {
        return 'Há 1 dia';
      } else {
        return `Há ${diffDias} dias`;
      }
    }
  }
}


  // Formatar as vendas recentes
  const vendasFormatadas = vendasRecentes.map((venda) => {
    const id = venda.id;
    const nomeCliente = venda.usuario.dados.nome;
    const precoVenda = (venda.precoTotal).toString();
    const horasAtras = formatarHorasAtras(venda.dataEntrega);

    return {
      id,
      nomeCliente,
      precoVenda,
      horasAtras,
    };
  });


  /* Pedidos */
  const pedidos  = await prisma.pedido.findMany({
    where: {
      situacaoId: {
        in: [1, 2, 3, 4, 5]
      },
    },
    
    include:{
      detalhes: true,
      situacao: true,
      usuario: {
        select:{
          dados: {
            select:{
              nome: true,
              telefone: true
            }
          }
        }
      }
    }
  })

  // Converter as datas para string
  const pedidosFormatados = pedidos.map((pedido) => {
    return {

      ...pedido,
      dataPedido: pedido.dataPedido.toISOString(),
      dataPagamento: pedido.dataPagamento? pedido.dataPagamento.toISOString() : null,
      dataEntrega: pedido.dataPagamento? pedido.dataPagamento.toISOString() : null,
      desconto: pedido.desconto ? pedido.desconto.toString() : null,
      precoTotal: pedido.precoTotal.toString(),
      detalhes: pedido.detalhes.map((detalhe) => ({
        ...detalhe,
        precoUnitario: detalhe.precoUnitario.toString(),
      })),

    };
  });

  const pedidosPendentes = pedidosFormatados.filter((pedido) => pedido.situacaoId === 1);

  /* Produtos */

  const produtosMaisVendidos = await prisma.produto.findMany({
    select: {
      id:true,
      nome: true,
      subCategoria: {
        select: {
          tipo: true,
        },
      },
      detalhesPedidos: {
        select: {
          pedido: {
            select: {
              pago: true
            }
          },
          quant: true
        }
      }
    },
    orderBy: {
      detalhesPedidos: {
        _count: 'desc',
      },
    },
    take: 5,
  });

  const produtosMaisVendidosFiltrados = produtosMaisVendidos
  .filter((produto) =>
    produto.detalhesPedidos.some((detalhe) => detalhe.pedido.pago === true)
  )
  .map((produto) => {

    const id = produto.id;
    const nomeProduto = produto.nome;
    const nomeSubCategoria = produto.subCategoria.tipo;
    const  quantidadeVendas = produto.detalhesPedidos
    .filter((detalhe) => detalhe.pedido.pago === true)
    .reduce((total, detalhe) => total + detalhe.quant, 0);

    const mensagemVendas = quantidadeVendas === 1 ? '1 venda' : `${quantidadeVendas} vendas`;


    return{
        id,
        nomeProduto,
        nomeSubCategoria,
        quantidadeVendas: mensagemVendas,
      };
  });

  /* Situações */
  const situacoes = await prisma.situacao.findMany({
    where:{
      id: {
        in: [3,4,5,6,7]
      }
    }
  })

  const situacoesRemapeadas = situacoes.map((situacao) => ({
    id: situacao.id,
    name: situacao.situacao,
  }));

  await prisma.$disconnect();

  return {
    props: {
      ganhosMes: (ganhoMes._sum.precoTotal || 0).toString(),
      ganhosDiario: (ganhoDiario._avg.precoTotal || 0).toString(),
      ganhosDia: (ganhoDia._sum.precoTotal || 0).toString(),

      pedidos: pedidosFormatados,
      pedidosPendentes,

      vendasMes: vendasMes.length,
      vendasDia: vendasDia.length,
      vendasRecentes: vendasFormatadas,

      produtosMaisVendidos: produtosMaisVendidosFiltrados,
      situacoes: situacoesRemapeadas
    },
  };
}