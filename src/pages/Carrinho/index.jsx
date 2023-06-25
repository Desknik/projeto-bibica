import React, {useContext, useState, useEffect, useRef} from 'react'
import Head from 'next/head'
import Link from 'next/link';
import jwt from 'jsonwebtoken';
import { parseCookies, setCookie } from 'nookies'
import { PrismaClient } from "@prisma/client";

import Layout from '../layout'
import { AuthContext } from '../../contexts/AuthContext'
import Modal from '@/components/Modal';

import { FaTrash } from 'react-icons/fa'
import styles from '../../styles/dashboard/dashboard.module.css'
import ListBox from '@/components/ListBox';

export default function Perfil({Produtos}) {

  const { user, isAuthenticated, carrinhoDeCompras, setCarrinhoDeCompras } = useContext(AuthContext)

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

  /* Modais */
  const [cleanModal, setCleanModal] = useState(false)
  const [openBuyModal, setOpenBuyModal] = useState(false)
  const [openPayModal, setOpenPayModal] = useState(false)
  const [successModal, setSuccessModal] = useState(false)

  /* Manipulação do carrinho */

  useEffect(() => {
    if (carrinhoDeCompras.length > 0) {

        const carrinhoAtualizado = carrinhoDeCompras.map((produto) => {
            const quantidade = 1; // Defina a quantidade desejada para cada produto
            const precoFinal = parseFloat(produto.precoUnitario) * quantidade;
          
            return {
              ...produto,
              quantidade,
              precoFinal
            };
        });

        setCarrinhoDeCompras(carrinhoAtualizado);
        setCookie(null, 'carrinho', JSON.stringify(carrinhoAtualizado), {
          maxAge: 30 * 24 * 60 * 60, // 30 dias em segundos
          path: '/', // Caminho válido em todo o site
        });
    }
  }, []);


  const limparCarrinho = () => {
    setCarrinhoDeCompras([]);
    setCookie(null, 'carrinho', JSON.stringify([]), {
      maxAge: 30 * 24 * 60 * 60, // 30 dias em segundos
      path: '/', // Caminho válido em todo o site
    });
    setCleanModal(false)
  };

  const removerDoCarrinho = (produto) => {
    const novoCarrinho = carrinhoDeCompras.filter((item) => item.id !== produto.id);
    setCarrinhoDeCompras(novoCarrinho);
    setCookie(null, 'carrinho', JSON.stringify(novoCarrinho), {
      maxAge: 30 * 24 * 60 * 60, // 30 dias em segundos
      path: '/', // Caminho válido em todo o site
    });

    setCleanModal(false)
  }

  const comprarProduto = produto => {
    const produtoExistente = carrinhoDeCompras.find((item) => item.id === produto.id);

    if (!produtoExistente) {
      const novoCarrinho = [...carrinhoDeCompras, produto];
      
      const carrinhoAtualizado = novoCarrinho.map((produto) => {
        const quantidade = 1; // Defina a quantidade desejada para cada produto
        const precoFinal = parseFloat(produto.precoUnitario) * quantidade;
      
        return {
          ...produto,
          quantidade,
          precoFinal
        };
      });

      setCarrinhoDeCompras(carrinhoAtualizado);
      setCookie(null, 'carrinho', JSON.stringify(carrinhoAtualizado), {
        maxAge: 30 * 24 * 60 * 60, // 30 dias em segundos
        path: '/', // Caminho válido em todo o site
      });
    }
    
    setOpenModal(false)
  }

  /*  */
  const atualizarQuantidade = (produto, quantidade) => {
    quantidade = Math.max(1, quantidade); // Garante que a quantidade mínima seja 1

    const carrinhoAtualizado = carrinhoDeCompras.map((item) => {
      if (item.id === produto.id) {
        return {
          ...item,
          quantidade: quantidade,
          precoFinal: parseFloat(item.precoUnitario) * quantidade,
        };
      }
      return item;
    });
    setCarrinhoDeCompras(carrinhoAtualizado);
  };

  //
  const [subTotal, setSubTotal] = useState(0);

  useEffect(() => {
    
      const total = carrinhoDeCompras.reduce(
        (acumulador, produto) => acumulador + produto.precoFinal,
        0
      );
      setSubTotal(total);
    
  }, [carrinhoDeCompras]);

  const [desconto, setDesconto] = useState(0);

  const [total, setTotal] = useState(0);
  useEffect(() => {
    setTotal(subTotal - desconto);
  }, [carrinhoDeCompras, subTotal, desconto]);

  const [cupom, setCupom] = useState();
  const [cep, setCep] = useState();

  /* Finalizar compra */   

  const Metodos = [
    { id: 1, name: 'Entrega' },
    { id: 2, name: 'Retirada' },
    { id: 3, name: 'Combinar no WhatsApp' },
  ]

  const [selectedMetodo, setSelectedMetodo] = useState(Metodos[0])
  const [linkWhatsApp, setLinkWhatsapp] = useState('')

  const handleRegisterPedido = async () => {

    try {

      const response = await fetch('/api/compra', {
        method: 'PUT',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(
    {idUsuario: user.id,
            metodoEntrega: selectedMetodo.name,
            produtos: carrinhoDeCompras,
            desconto,
            precoTotal: total
          }
        ),
      });

      if(response.ok){
        setOpenPayModal(false)
        limparCarrinho()

        
      const data = await response.json();
        const { nome, codigoPedido, telefone } = data;
        
        const mensagem = `Oi, aqui é o(a) ${nome}. Acabei de fazer um pedido com o código ${codigoPedido}. Gostaria de confirmar o pagamento através do PIX. Aguardo o seu contato com o código do PIX. Obrigado!`;
        setLinkWhatsapp(`https://api.whatsapp.com/send?phone=55${telefone}&text=${encodeURIComponent(mensagem)}`)
        setSuccessModal(true)

        window.open(linkWhatsApp, '_blank');
      }
      else{
        const errorResponse = await response.json();
        throw new Error(errorResponse.message);
      }

    } 
    catch (error) {
      handleError(error.message)
    }
  }

  /* Products*/
  const [openModal, setOpenModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState([])

  const adicionarAoCarrinho = produto => {
    const produtoExistente = carrinhoDeCompras.find((item) => item.id === produto.id);

    if (!produtoExistente) {
      const novoCarrinho = [...carrinhoDeCompras, produto];
      
      const carrinhoAtualizado = novoCarrinho.map((produto) => {
        const quantidade = 1; // Defina a quantidade desejada para cada produto
        const precoFinal = parseFloat(produto.precoUnitario) * quantidade;
      
        return {
          ...produto,
          quantidade,
          precoFinal
        };
      });

      setCarrinhoDeCompras(carrinhoAtualizado);
      setCookie(null, 'carrinho', JSON.stringify(carrinhoAtualizado), {
        maxAge: 30 * 24 * 60 * 60, // 30 dias em segundos
        path: '/', // Caminho válido em todo o site
      });
    }
    

    setOpenModal(false)
    setSelectedProduct([])
    
  }

  const [produtoNoCarrinho, setProdutoNoCarrinho] = useState()

  useEffect(() => {

    const produtoNoCarrinho = carrinhoDeCompras.find((produto) => produto.id === selectedProduct.id);
  
    if(produtoNoCarrinho){
      setProdutoNoCarrinho(true)
    }else{
      setProdutoNoCarrinho(false)
    }
    
  },[selectedProduct])
  
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
    <>
      <Head>
        <title>Carrinho de Compras</title>
      </Head>

       {/* Modal de sucesso na compra*/}
       <Modal tittle={'Compra realizada com sucesso!'} isOpen={successModal} onClose={() => setSuccessModal(false)}>
        <div>
          <p>Seu pedido foi enviado e estamos ansiosos para atendê-lo(a)!</p>
          <p>Para dar continuidade à sua compra, clique no botão abaixo para ser redirecionado(a) para o WhatsApp.</p>
          <Link href={linkWhatsApp} target='_blank' className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-pink-400 px-8 py-2.5 text-base font-medium text-white transition-colors hover:bg-pink-500" >
            Continuar no WhatsApp
          </Link>
          <p className='text-xs mt-1'>Caso o pagamento não seja realizado em até 24 horas, o pedido será cancelado. </p>
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
              setOpenModal(false)
            }else{
              comprarProduto(selectedProduct)
            }}} >
                Comprar Produto
            </button>
          </div>
        </div>
      </Modal>

      <div className='my-10 px-10'>

        {/* Mensagem de Erro*/}
        <span ref={errorBoxRef} className='absolute bottom-5 right-5 z-30  opacity-0 transition-opacity duration-300 ease-in-out bg-red-400/60 border-2 border-red-500 text-red-200 font-medium rounded-lg inline-block px-2 py-2 my-1'>{errorMessage}</span>

        <h1 className='my-4 text-2xl'>Carrinho de Compras</h1>

        <Modal tittle={'Método de Entrega'} isOpen={openPayModal} onClose={() => setOpenPayModal(false)}>
          <div className="w-full flex flex-col gap-3">
            <div className="">
              <p className='text-gray-600'>Por favor, selecione o método de entrega desejado para o seu pedido:</p>

              <ListBox inputStyle='my-3 !bg-gray-50 lg:hover:bg-zinc-700' dropdownStyle='!bg-gray-50' selectedValue={selectedMetodo} setSelectedValue={setSelectedMetodo} List={Metodos}/>
             

              {/* Se os dados obrigatórios não estiver completo */}
              {user && !user.CompletedDetails &&
                <div className="mr-10">
                  <p className='text-center text-red-500'>Você precisa atualizar seus dados para utilizar esse método:</p>
                  <div className="flex justify-center mt-2">
                    <Link href={'/Perfil/Dados'} className='bg-gray-100 text-sm text-red-500 rounded-md shadow-md px-2 py-1 md:hover:bg-gray-200'>Atualizar dados</Link>
                  </div>
                </div>
              }

              {/* Se o endereço não estiver completo */}
              {selectedMetodo.id == 1 && user && !user.dados.cep &&
                <div className="mr-10">
                  <p className='text-center text-red-500'>Você precisa atualizar seu endereço para utilizar esse método:</p>
                  <div className="flex justify-center mt-2">
                    <Link href={'/Perfil/Dados'} className='bg-gray-100 text-sm text-red-500 rounded-md shadow-md px-2 py-1 md:hover:bg-gray-200'>Atualizar Endereço</Link>
                  </div>
                </div>
              }

              {/* Se os dados do método entrega estiverem corretos */}
              {selectedMetodo.id == 1 && user && user.CompletedDetails && user.dados.cep &&

                <div className="">
                <h2 className='font-medium text-gray-700'>Confirme seus dados:</h2>
                <div className="flex flex-col gap-1">
                  <p className='font-medium text-gray-600'>Nome: <span className='font-normal text-gray-600'>{user.dados.nome}</span></p>
                  <p className='font-medium text-gray-600'>Endereço: <span className='font-normal text-gray-600'>{`${user.dados.endereco}, ${user.dados.bairro}, ${user.dados.numCasa}, ${user.dados.complemento}, ${user.dados.cep}, ${user.dados.cidade} / ${user.dados.uf} `}</span></p>
                  <p className='font-medium text-gray-600'>Email: <span className='font-normal text-gray-600'>{user.email}</span></p>
                  <p className='font-medium text-gray-600'>Telefone: <span className='font-normal text-gray-600'>{user.dados.telefone}</span></p>
                </div>
                <Link href={'/Perfil/Dados'} className='inline-block mt-2 bg-gray-100 text-sm text-pink-400 shadow-md rounded-md px-2 py-1 md:hover:bg-gray-200'>Alterar Meus Dados</Link>

                <div className="mt-5 gap-5">
                  <p className='text-xl text-gray-700 font-medium font-sans'>Total à Pagar: <span className='text-xl text-pink-400 font-medium font-sans'>{formatarValorMonetario(total)}</span> </p>
                </div>
                

                <div className="mt-5">
                  <p className='text-sm text-gray-600'>Após a conclusão da compra, você será redirecionado ao WhatsApp para confirmar o seu pedido e combinar os detalhes restantes, caso necessário.</p>
                </div>
                </div>
              }

              {/* Se os dados do método retirada estiverem corretos */}
              {selectedMetodo.id != 1 && user && user.CompletedDetails &&

                                

                <div className="">
                  <h2 className='font-medium text-gray-700'>Confirme seus dados:</h2>
                  <p className='text-gray-600'>Nome: {user.dados.nome}</p>
                  <p className='text-gray-600'>Email: {user.email}</p>
                  <p className='text-gray-600'>Telefone: {user.dados.telefone}</p>
                  <Link href={'/Perfil/Dados'} className='inline-block mt-2 bg-gray-100 text-sm text-pink-400 shadow-md rounded-md px-2 py-1 md:hover:bg-gray-200'>Alterar Meus Dados</Link>

                  <div className="mt-5 gap-5">
                    <p className='text-xl text-gray-700 font-medium font-sans'>Total à Pagar: <span className='text-xl text-pink-400 font-medium font-sans'>{formatarValorMonetario(total)}</span> </p>
                  </div>

                  <div className="mt-5">
                    <p className='text-sm text-gray-600'>Após a conclusão da compra, você será redirecionado ao WhatsApp para confirmar o seu pedido e combinar os detalhes restantes, caso necessário.</p>
                  </div>
                </div>

                
              }

              <button disabled={selectedMetodo.id == 1 && user && !user.dados.cep} onClick={handleRegisterPedido} className={`w-full font-semibold px-3 py-2 mt-5 rounded-md shadow-md transition-all ${selectedMetodo.id == 1 && user && !user.dados.cep? 'bg-gray-300 text-gray-500' : 'bg-gray-100 md:hover:bg-pink-400 lg:hover:text-white'}`}>
                Finalizar Compra
              </button>

            </div>
          </div>
        </Modal>

        <Modal tittle={'Método de Pagamento'} isOpen={openBuyModal} onClose={() => setOpenBuyModal(false)}>
          <div className="w-full flex flex-col gap-3">
            <button onClick={() => {setOpenPayModal(true); setOpenBuyModal(false)}} className='w-full bg-gray-100 font-semibold px-3 py-2 rounded-md shadow-md transition-all lg:hover:bg-pink-400 lg:hover:text-white'>
              PAGAR PELO WHATSAPP (PIX)
            </button>

            <button disabled className='w-full bg-gray-300 text-gray-500 px-3 py-2 rounded-md shadow-md'>
              PIX
            </button>

            <button disabled className='w-full bg-gray-300 text-gray-500 px-3 py-2 rounded-md shadow-md'>
              CARTÃO DE CRÉDITO
            </button>
          </div>
        </Modal>

        <Modal tittle={'Limpar Carrinho'} isOpen={cleanModal} onClose={() => setCleanModal(false)}>
        <div>
          <p>Deseja remover todos os itens do seu carrinho?</p>
          
          <div className="flex max-md:flex-col md:gap-5 justify-center items-center mt-3">
            <button onClick={limparCarrinho} className="flex w-full items-center justify-center rounded-md border border-transparent bg-pink-400 py-1.5 text-base font-medium text-white transition-colors hover:bg-pink-500">
                Confirmar
            </button>

            <button onClick={() => setCleanModal(false)} className="flex w-full items-center justify-center rounded-md border border-transparent py-1.5 text-base font-medium text-gray-600 transition-colors hover:bg-gray-200">
                Cancelar
            </button>
          </div>
        </div>
      </Modal>

        {!!carrinhoDeCompras && carrinhoDeCompras.length > 0 &&
          <div className="grid grid-cols-12 gap-5 w-full">

            <div className="lg:col-span-9 col-span-12">
              
                <div  className={`w-full rounded-sm bg-gray-50 shadow-md overflow-x-scroll ${styles.scroll}`}>
                  <table className='w-full table-auto font-sans'>
                    <thead className='border-b border-b-gray-200'>
                      <tr>
                        <th scope='col' className='text-base text-gray-700 text-left font-bold p-4'>Produto</th>
                        <th scope='col' className='text-base text-gray-700 text-center font-bold p-4'>Qnt.</th>
                        <th scope='col' className='text-base text-gray-700 text-center font-bold p-4'>Preço</th>
                        <th scope='col' className='text-base text-gray-700 text-center font-bold p-4'></th>
                      </tr>
                    </thead>

                    <tbody>
                      {carrinhoDeCompras.map(produto => (
                        <tr className='border-b border-b-gray-200'>

                          <td className='min-w-fit'>
                            <div className='flex gap-3 p-4 pb-5'>
                              <div className='w-24 h-24' >
                                <img  className='w-full rounded-xl ' src={`https://res.cloudinary.com/divmuffya/image/upload/v${produto.imagem.version}/${produto.imagem.publicId}.${produto.imagem.format}`} alt={produto.nome} />
                              </div>

                              <div className="">
                                <p className='font-medium text-md whitespace-nowrap'>Nome: <span className='font-normal text-gray-700'>{produto.nome}</span></p>
                                <p className='font-medium whitespace-nowrap'>Sabor: <span className='font-normal text-gray-700'>{produto.sabor.sabor}</span></p>
                                <p className='font-medium whitespace-nowrap'>Unidade: <span className='font-normal text-gray-700'>{produto.unidadeMedida.tipo}</span></p>
                              </div>
                            </div>
                          </td>

                          <td className=''>
                            <div className="flex justify-center items-center p-4 gap-3">
                              <button onClick={() =>  atualizarQuantidade(produto, produto.quantidade - 1)} className={`flex justify-center items-center w-6 h-5 font-semibold text-lg rounded-md p-2 pt-1 ${ produto.quantidade === 1? 'bg-gray-300' : 'bg-gray-200'}`}>-</button>
                              <span>{produto.quantidade}</span>
                              <button onClick={() =>   atualizarQuantidade(produto, produto.quantidade + 1)} className='flex justify-center items-center w-6 h-5 font-semibold text-lg bg-gray-200 rounded-md p-2 pt-1'>+</button>
                            </div>
                          </td>

                          <td>
                            <div className="flex flex-col justify-center items-center p-4">
                              <span className='whitespace-nowrap'>{produto.quantidade} x {formatarValorMonetario(produto.precoUnitario)}</span>
                              <span className=''>Total: { formatarValorMonetario(produto.precoFinal)}</span>
                            </div>
                          </td>

                          <td>
                            <button onClick={() => removerDoCarrinho(produto)} className='transition-colors md:hover:bg-gray-200 rounded-full p-1.5'>
                              <FaTrash className='text-gray-500'/>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>

                  </table>
                </div>
                <div className="flex justify-end">
                  <button onClick={() => setCleanModal(true)} className='bg-gray-100  text-gray-600 hover:bg-gray-200 rounded-md shadow-md px-3 py-1.5 mt-2'>Limpar Carrinho</button>
                </div>
            </div>
        
            <div className="lg:col-span-3 md:col-span-6 col-span-12 max-lg:order-3">
              <div className="sticky top-0">
                <div className="flex flex-col justify-center items-center bg-gray-50 rounded-sm shadow-md">
                  <h2 className='p-4 border-b border-b-gray-200 text-xl'>RESUMO</h2>

                  <div className="">
                  <div className="w-full flex flex-wrap justify-center items-center p-2 gap-3">
                      <p className='text-lg text-gray-600 font-sans'>Subtotal:</p>
                      <span className='text-lg text-gray-600 font-sans'> {formatarValorMonetario(subTotal)}</span>
                  </div>

                  <div className="w-full flex flex-wrap justify-center items-center pb-2 gap-3">
                      <p className='text-lg text-gray-600 font-sans'>Desconto:</p>
                      <span className='text-lg text-gray-600 font-sans'> {formatarValorMonetario(desconto)}</span>
                  </div>
                  </div>

                  <div className="w-full flex flex-wrap justify-center items-center bg-gray-100 p-4 gap-5">
                      <p className='text-xl text-gray-700 font-medium font-sans'>Total:</p>
                      <span className='text-xl text-pink-400 font-medium font-sans'>{formatarValorMonetario(total)}</span>
                  </div>
                </div>

                <div className="w-full mt-3">
                  <button onClick={() => {setOpenBuyModal(true) }} className='w-full px-2 py-2 bg-pink-400 rounded-md text-white hover:bg-pink-500'>Finalizar Compra</button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-9 md:col-span-6 col-span-12">
              <div className="w-full flex max-lg:flex-col gap-3">

                <div className="w-full bg-gray-50 rounded-sm shadow-md p-3">
                  <h2 className='text-xl pb-3'>Cupom de Desconto</h2>

                  <div className="flex items-center gap-3">
                    <div className="w-full flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300  outline-none">
                        <input type="text" value={cupom} onChange={e => setCupom(e.target.value)} name="nome" id="nome" autocomplete="nome" className="block w-full flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-500 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="Cupom"/>
                    </div>

                    <div className="flex justify-end">
                      <button onClick={{}} className='px-2 py-1.5 bg-pink-400 rounded-md text-white hover:bg-pink-500 whitespace-nowrap'>Aplicar Cupom</button>
                    </div>
                  </div>
                </div>

                <div className="w-full bg-gray-50 rounded-sm shadow-md p-3">
                  <h2 className='text-xl pb-3'>Calcular Frete</h2>

                  <div className="flex items-center gap-3">
                    <div className="w-full flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300  outline-none">
                        <input type="text" value={cep} onChange={e => setCep(e.target.value)} name="nome" id="nome" autocomplete="nome" className="block w-full flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-500 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6" placeholder="CEP"/>
                    </div>

                    <div className="flex justify-end">
                      <button onClick={{}} className='px-2 py-1.5 bg-pink-400 rounded-md text-white hover:bg-pink-500 whitespace-nowrap'>Calcular</button>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          
        }

        {!!carrinhoDeCompras && carrinhoDeCompras.length == 0 &&
          <div className="p-10">
            <div className="flex justify-center items-center w-full">
              <p className='font-semibold text-gray-600 pb-5 border-b border-b-pink-400'>Carrinho de Compras vazio.</p>
            </div>
          </div>
        }

        {/* Top Produtos */}
        <div className="col-span-5 mt-5">
          <h2 className='block sticky top-0 text-lg font-semibold py-3 mb-2'>Produtos em Destaque</h2>
          <div className="grid xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 sm:grid-cols-3 max-sm:grid-cols-2 x grid-cols-1 gap-x-5 gap-y-5">
            
            {Produtos.map(produto => (
              <div key={produto.id} onClick={() => {setOpenModal(true); setSelectedProduct(produto)}} className="p-3 pb-5 rounded-lg bg-gray-100 transition-all h-fit md:hover:scale-105 cursor-pointer shadow-lg">
                <div className="flex justify-center items-end rounded-lg overflow-hidden">
                    <img className='object-cover' src={`https://res.cloudinary.com/divmuffya/image/upload/v${produto.imagem.version}/${produto.imagem.publicId}.${produto.imagem.format}`} alt={produto.nome} />
                </div>
              
                <div className="mt-4 flex flex-col">
                    <p className='black font-semibold text-sm text-center'>{produto.nome}</p>
                    <p className='text-gray-600 font-medium text-sm text-center'>{produto.subCategoria.tipo} - {produto.sabor.sabor}</p>
                    <p className='text-gray-600 font-medium text-xs text-center -mt-1'>{produto.unidadeMedida.tipo}</p>
                    <p className='text-pink-400 font-sans font-semibold text-xl text-center'>{formatarValorMonetario(produto.precoUnitario)}</p>
                </div>
              </div>
            ))}
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

  const Produtos = await prisma.produto.findMany({
    take: 6,
    orderBy: {
      detalhesPedidos: {
        _count: "desc"
      }
    },
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
      Produtos: produtosComPrecoString
    },
  };
    
}

Perfil.getLayout = function getLayout(page) {
    return (
      <Layout>
        {page}
      </Layout>
    )
  }