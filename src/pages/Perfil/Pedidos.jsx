import React, {useContext, useState} from 'react'
import Link from 'next/link';
import jwt from 'jsonwebtoken';
import { parseCookies } from 'nookies'
import { PrismaClient } from "@prisma/client";

import Layout from '../layout'
import { AuthContext } from '../../contexts/AuthContext'
import Modal from '@/components/Modal';

import styles from '../../styles/dashboard/dashboard.module.css'
import Head from 'next/head';
import Navbar from '@/components/PerfilHeader';

export default function Perfil({userData, Pedidos}) {

  const [pedidoModal, setPedidoModal] = useState(false)

    const { user } = useContext(AuthContext)

    const [email, setEmail] = useState()

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

  const [selectedPedido, setSelectedPedido] = useState(false)

  return (
    <>
      <Head>
        <title>Meus Pedidos</title>
      </Head>

      <Modal tittle={'Detalhes do Pedido'} isOpen={pedidoModal} onClose={() => setPedidoModal(false)}>
        {!!selectedPedido &&
          <div className="w-full">

            <p className='text-base font-medium whitespace-nowrap'>Código do Pedido: <span className='font-normal'>{selectedPedido.id}</span></p>

            <p className='<stext-base font-medium'>Pedido:</p>
            <div className={`h-36 bg-gray-100 rounded-lg shadow-inner  overflow-auto ${styles.scroll}`}>
              {selectedPedido.detalhes.map (detalhe => (
                <div key={detalhe.id} className="border-b border-b-gray-200 p-3">
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

            <div className="flex flex-col gap-3 mt-3">
              <div className="flex justify-between items-end">
                <p className='text-lg font-medium'>Preço Total: <span className='font-normal'>{formatarValorMonetario(selectedPedido.precoTotal)}</span></p>
              </div>
            </div>
        </div>
        }
      </Modal>

      {!!user && !user.CompletedDetails && 
          <div className="flex justify-center items-center w-full p-1 bg-red-400/50">
              <p className='text-white font-medium'>Atualize seus dados para poder consumir nossos serviços</p>
          </div>
      }
  
      <div style={{minHeight: '70vh'}}>
        <div className="grid grid-cols-4 gap-x-10 w-full lg:px-28 px-8 my-5">
          <Navbar/> 

          <div className="lg:col-span-3 col-span-4 max-lg:mt-3">
            <div className="border-b border-gray-900/10 pb-3">
                <h2 className="text-base font-semibold leading-7 text-gray-900">Meus Pedidos</h2>

            </div>
            

            <div className={`w-full h-72 rounded-sm bg-gray-50 shadow-md overflow-x-scroll ${styles.scroll}`}>
              <table className='w-full font-sans'>
                <thead className='border-b border-b-gray-200'>
                  <tr>
                    <th scope='col' className='text-base text-gray-700 text-center font-bold p-4'>#</th>
                    <th scope='col' className='text-base text-gray-700 text-center font-bold p-4'>Produtos</th>
                    <th scope='col' className='text-base text-gray-700 text-left font-bold p-4'>Data</th>
                    <th scope='col' className='text-base text-gray-700 text-left font-bold p-4'>Situação</th>
                    <th scope='col' className='text-base text-gray-700 text-left font-bold p-4'>Valor Total</th>
                    <th scope='col' className='text-base text-gray-700 text-center font-bold p-4'></th>
                  </tr>
                </thead>

                <tbody>
                  {Pedidos && Pedidos.map(pedido => (

                    <tr key={pedido.id} className='border-b border-b-gray-200'>

                      <td className='text-md text-center p-4'><span className='bg-gray-200 rounded-full px-4 py-1'>{pedido.id}</span></td>

                      <td className='text-md text-center p-4'>{pedido.detalhes.length}</td>

                      <td className='text-md text-left p-4'>{formatarData(pedido.dataPedido)}</td>

                      <td className='text-md text-left whitespace-nowrap p-4'>{pedido.situacao.situacao}</td>

                      <td className='text-md text-left whitespace-nowrap p-4'>{formatarValorMonetario(pedido.precoTotal)}</td>

                      <td className=''>
                        <div className="flex justify-center items-center gap-3">
                          <button onClick={() =>   {setPedidoModal(true); setSelectedPedido(pedido)}} className='flex justify-center items-center text-sm text-gray-500 whitespace-nowrap bg-gray-200 rounded-md p-2 pt-1 transition-colors shadow-md md:hover:bg-pink-300 md:hover:text-white'>Ver Pedido</button>
                        </div>
                      </td>

                    </tr>
                  ))
                  }
                  
                </tbody>

              </table>
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

  

  const Pedidos = await prisma.pedido.findMany({
    where:{
        usuarioId: id
    },
    include:{
        detalhes:{
          include:{
            produto:{select:{
              nome: true,
              imagem:true,
              sabor:{select:{sabor:true}},
              unidadeMedida:{select:{tipo: true}},
              cor:{select:{cor: true}},

            }}
          }
        },
        situacao:true,
    }
  })

  const pedidosFormatados = Pedidos.map((pedido) => {
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

  prisma.$disconnect()

  return {
    props: {Pedidos: pedidosFormatados},
  };
    
  }

Perfil.getLayout = function getLayout(page) {
    return (
      <Layout>
        {page}
      </Layout>
    )
  }