import React, {useContext } from 'react'
import Head from 'next/head'

import Layout from '../layout'

import Link from 'next/link'
import { AuthContext } from '@/contexts/AuthContext'



export default function Sobre() {

  const { user } = useContext(AuthContext)

  return (
    <>
      <Head>
        <title>Sobre nós</title>
      </Head>
      <div className='my-10 px-20'>
        <h1 className='my-4 font-bold text-2xl'>Sobre a Doceria Bibica</h1>
        <div className="flex flex-col gap-y-5">
            <p>Olá{user && ` ${user.nickname}`}! Bem vindo a nossa doceria, irei contar um pouco sobre ela para você!</p>

          <p>A Doceria Bibica é uma confeitaria artesanal que produz os melhores doces, salgados e bolos da cidade. Desde a nossa fundação em 1995, nossa missão tem sido proporcionar aos nossos clientes produtos deliciosos e de alta qualidade. Acreditamos que um sabor incrível pode trazer alegria e tornar o dia de alguém um pouco mais doce.</p>
          
          <div className="">
            <h2 className='font-semibold text-xl'>História da empresa:</h2>
            <p>Em 1995, a nossa fundadora, Ana, começou a fazer bolos para amigos e familiares em casa. Seu talento natural para confeitaria e amor pela cozinha rapidamente se espalhou pela cidade, e em pouco tempo ela abriu sua própria doceria. Desde então, a Doceria Delícias Doce cresceu em tamanho e reputação, mas ainda mantém as raízes de sua fundadora - oferecer produtos deliciosos e de alta qualidade com um toque pessoal.</p>
          </div>
        
          <div className="">
            <h2 className='font-semibold text-xl'>Compromisso com a qualidade:</h2>
            <p>Aqui na Doceria Delícias Doce, acreditamos que a qualidade é fundamental em tudo o que fazemos. Usamos apenas os melhores ingredientes em nossos produtos, e tudo é feito à mão em nossa cozinha. Nós não cortamos cantos quando se trata de sabor ou qualidade - queremos que nossos clientes sintam o amor e a dedicação que colocamos em cada produto.</p>
          </div>
         
          <div className="">
            <h2 className='font-semibold text-xl'>Equipe:</h2>
            <p>Nossa equipe é composta por uma mistura de confeiteiros experientes e jovens talentos. Cada um deles tem um amor pela cozinha e um desejo de criar produtos incríveis. Trabalhamos juntos para criar uma experiência de sabor única para nossos clientes.</p>
          </div>
          
          <div className="">
            <h2 className='font-semibold text-xl'>Agradecimento:</h2>
            <p>Gostaríamos de agradecer a todos os nossos clientes por escolherem a Doceria Delícias Doce. Estamos ansiosos para continuar a fornecer produtos deliciosos e de alta qualidade para todos vocês nos próximos anos.</p>
          </div>

        </div>
        <Link className='inline-block my-5 bg-pink-400 rounded-md text-white px-3 py-2  ' href='/Produtos'>Conheça nossos deliciosos produtos</Link>
      </div>

    </>
  )
}

Sobre.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}