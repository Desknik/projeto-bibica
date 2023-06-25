import React, { useState } from 'react'
import { PrismaClient } from "@prisma/client";

import Layout from '../layout'
import Modal from '@/components/Modal'
import Head from 'next/head';

export default function Decoracoes({Decoracoes}) {

    /* Modais */
    const [openViewModal, setOpenViewModal] = useState(false) //Modal da edição
    const [viewImageUrl, setViewImageUrl] = useState("")


    const handleDecoracaoSelect = (decoracao) => { // Função que pega os dados do decoracao que foi selecionado
        
        setViewImageUrl(`https://res.cloudinary.com/divmuffya/image/upload/v${decoracao.imagem.version}/${decoracao.imagem.publicId}.${decoracao.imagem.format}`)
    
    }


    return (
        <div style={{maxWidth:'100rem', minHeight: '80vh'}} className='w-full mx-auto pb-10 my-10 lg:px-20 md:px-14 px-8'>

            <Head>
                <title>Decorações</title>
            </Head>
            {/* Modal de Visualização da Imagem*/}
            <Modal isOpen={openViewModal} onClose={() => setOpenViewModal(false)}>
                <div className='w-full'>
                    <div className="md:h-72 max-md:h-72 relative overflow-hidden flex justify-center rounded-lg border border-dashed border-gray-600/25 px-6 py-10 mt-8">
                        <div className="absolute top-0 right-0 w-full h-full cursor-pointer z-20">
                            {viewImageUrl && 
                                <img className='w-full h-full object-cover' src={viewImageUrl} alt="Decoração" />
                            }
                        </div>
                    </div>
                </div>
            </Modal>
            
            <h2 className='my-4 text-2xl'>Nossas Decorações</h2>
            <p>Veja nosso lindo album dos eventos organizados por nós! Entre em contato conosco você também para transformar seu evento em momentos mágicos e únicos com nossa decoração!</p>

            {/* Tabela */}
            {Decoracoes == null || Decoracoes == '' && <p className='font-medium text-white text-xl text-center mt-10'>Decorações não encontradas</p>}


            {Decoracoes != null && Decoracoes != '' && 
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mt-5">
                    {Decoracoes.map(decoracao => (
                        <div key={decoracao.id} className='relative transition-all lg:hover:scale-105 group mb-3' >
                            <img onClick={() => {setOpenViewModal(true); handleDecoracaoSelect(decoracao)}} className='w-full rounded-xl cursor-pointer' src={`https://res.cloudinary.com/divmuffya/image/upload/v${decoracao.imagem.version}/${decoracao.imagem.publicId}.${decoracao.imagem.format}`} alt={decoracao.nome} />
                        </div>
                    ))}
                </div>
            }

        </div>
    )
}

Decoracoes.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    )
}


export async function getStaticProps(ctx) {
    const prisma = new PrismaClient();

    const Decoracoes = await prisma.decoracoes.findMany({
        include: {
            imagem: true,
        },
        where: {
            disponivel: true,
        }
    })

    await prisma.$disconnect();
    
    return {
        props: {
            Decoracoes
        }
    }
}