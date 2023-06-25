import React from 'react'
import Layout from './layout'

import Head from 'next/head';
import LogoImage from '../assets/img/logo/logo-m.svg';

import Image from 'next/image'

import localFont from 'next/font/local'
const bernadette = localFont({ src: '../assets/fonts/bernadette.ttf' })


import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import Doces from '../assets/img/escolha/Doces.png'
import Salgados from '../assets/img/escolha/Salgados.png'
import Bolos from '../assets/img/escolha/Bolos.png'

import { FaHeart } from "react-icons/fa";


// import required modules
import { Autoplay, EffectCoverflow, Pagination } from "swiper";
import { PrismaClient } from '@prisma/client';
//import { createInitialClassUsers, createInitialSituations } from '@/utils/db';
import Link from 'next/link';



export default function Home({decoracoes}) {

  return (
    <>
     <Head>
        <title>Home</title>
      </Head>
        
      <section className={`Hero relative bg-center sm:h-96`}>
        <div className="filter"></div>
        
        <div className="flex flex-col justify-center items-center gap-3 max-md:mt-10">
          <Image style={{minWidth:'10em'}} className='w-4/6' src={LogoImage} alt="Logo"/>
          <div className={`HeroPBox my-8 text-base lg:text-lg px-5`}>
            <p className='md:hidden md:font-medium font-semibold text-white text-center md:text-lg sm:text-base text-sm'>
              Não resista mais aos seus doces desejos, delicie-se com nossa vasta seleção de doces deliciosos e únicos que só a Doceria Bibica pode oferecer!
            </p>
            <p className="max-md:hidden font-medium text-white text-center md:text-lg text-base" >
              Delicie-se com nossa vasta seleção de doces deliciosos e únicos feitos com ingredientes de qualidade e amor! Não resista mais aos seus doces desejos, mergulhe de cabeça na verdadeira delícia que só a Doceria Bibica pode oferecer.
            </p>
          </div>
          <Link href='/Produtos' className={`${bernadette.className} z-30 text-white text-xl transition-all md:hover:opacity-80 md:text-2xl`}>Ver Cardápio</Link>
        </div>
      </section>

      <section>
        <div className='Desc sm:py-20 py-14'>
            <h2 className={`${bernadette.className} text-gray-800 text-xl`}>Satisfaça seus Sentidos</h2>
            <p className='font-medium text-gray-800 text-center md:text-lg sm:text-base text-sm'>Nossos doces são feitos com ingredientes de qualidade e amor, para que você possa desfrutar de cada mordida. Faça sua escolha agora e experimente a verdadeira delícia dos doces.</p>
        </div>
      </section>

      <section className='Escolha sm:px-20 px-10'> 
        <div className='content'>
          <div className="leftBox">
              <div className='text'>
                <h2 className={bernadette.className}>Escolha a Delicia perfeita</h2>
                <p className='lg:font-medium font-semibold text-white text-center md:text-lg sm:text-base text-sm'> Experimente nossa ampla seleção de opções e satisfaça seus desejos! Escolha a verdadeira delícia dos nossos salgados, doces e bolos, qual é o seu preferido?</p>
              </div>
              <div className="vote">
                  <div className="voteBox">
                      <p>Doces</p>
                      <input type="range" id="doces" name="docesInput" className='voteInput' defaultValue="5" min="0" max="10"/>
                  </div>
                  <div className="voteBox">
                      <p>Salgados</p>
                      <input type="range" id="salgados" name="salgadosInput" className='voteInput' defaultValue="3" min="0" max="10"/>
                  </div>
                  <div className="voteBox">
                      <p>Bolos</p>
                      <input type="range" id="bolos" name="bolosInput" className='voteInput' defaultValue="6" min="0" max="10"/>
                  </div>
              </div>
          </div>

          <div className="rightBox">
            <Swiper
              effect={'coverflow'}
              centeredSlides={true}  
              loop={true}
              slidesPerView={'auto'}
              coverflowEffect={
                {
                  rotate: 0,
                  stretch: 0,
                  depth: 100,
                  modifier: 2.5,
                }
              }
              rewind={true}
              grabCursor={true}
              autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
              
              initialSlide={1}
              modules={[Autoplay, EffectCoverflow]}
              className="mySwiper"
            >
              <SwiperSlide className='SwiperSlide'>
                <div className='swiperContent'>
                  <div className="votar"><FaHeart/></div>
                  <div className="text">
                    <h4 className={bernadette.className}>Doces</h4>
                    <Link href='/Produtos?categoria=Doces' className={`${bernadette.className} text-lg px-2 btn-p heroButton`}>Ver Todos</Link>
                  </div>
                  <Image className='swiperImg' src={Doces} alt="Doces"/>
                </div>
              </SwiperSlide>

              <div className="w-full h-full bg-red-400"></div>

              <SwiperSlide className='SwiperSlide'>
                <div className='swiperContent'>
                  <div className="votar"><FaHeart/></div>
                  <div className="text">
                    <h4 className={bernadette.className}>Salgados</h4>
                    <Link href='/Produtos?categoria=Salgados' className={`${bernadette.className} text-lg px-2 btn-p heroButton`}>Ver Todos</Link>
                  </div>
                  <Image className='swiperImg' src={Salgados} alt="Salgados"/>
                </div>
              </SwiperSlide>

              <SwiperSlide className='SwiperSlide'>
                <div className='swiperContent'>
                  <div className="votar"><FaHeart/></div>
                  <div className="text">
                    <h4 className={bernadette.className}>Bolos</h4>
                    <Link href='/Produtos?categoria=Bolos' className={`${bernadette.className} text-lg px-2 btn-p heroButton`}>Ver Todos</Link>
                  </div>
                  <Image className='swiperImg' src={Bolos} alt="Bolos"/>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </section>

      <section id="Mostruario">
        <div className='Mostruario'>
          <h2 className={`${bernadette.className} text-gray-800 !text-3xl`}>Transforme seus eventos em ocasiões inesquecíveis</h2>
          <p className='font-medium text-gray-800 text-center md:text-lg sm:text-base text-sm'>Nós temos a solução perfeita para transformar sua  festa infantil, um aniversário de 15 anos ou até mesmo seu casamento em uma ocasião inesquecível. Com nossas incríveis decorações, você pode criar um ambiente único e mágico que irá surpreender e encantar seus convidados!</p>
      
          {!!decoracoes && decoracoes.length > 0 && 
            <div className="swipper">
              <Swiper
                effect={'coverflow'}
                coverflowEffect={
                  {
                    rotate: 0,
                    stretch: 0,
                    depth: 100,
                    modifier: 2.5,
                  }
                }
                slidesPerView={'auto'}
                spaceBetween={80}
                centeredSlides={true}
                grabCursor={true}
                loop={true}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                }}
              
                modules={[Autoplay, Pagination, EffectCoverflow]}
                className="mySwiper"
                rewind={true}
              >

                {decoracoes.map(decoracao => (
                  <SwiperSlide className='SwiperSlide' key={decoracao.id}>
                    <img className='swiperImg' src={`https://res.cloudinary.com/divmuffya/image/upload/v${decoracao.imagem.version}/${decoracao.imagem.publicId}.${decoracao.imagem.format}`} alt={decoracao.nome} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          }
          <Link href='/Decoracoes' className={`${bernadette.className} z-30 text-gray-800 text-2xl transition-all md:hover:opacity-80`}>Agendar</Link>
        </div>
      </section>

      <section className='Pedido'>
        <div className="absolute w-full h-full bg-gray-800/20"></div>
        <div className='box z-30'>
            <h2 className={`${bernadette.className} text-white text-3xl`}>Faça seu pedido!</h2>
            <p className='font-normal  text-white text-center md:text-lg sm:text-base text-sm'>Não importa onde você esteja, você pode desfrutar da nossa deliciosa seleção de doces! Faça seu pedido através do nosso site, pelo WhatsApp ou pelo iFood e experimente a verdadeira delícia dos nossos doces. Nós nos preocupamos em tornar a sua experiência de compra o mais fácil e conveniente possível, para que você possa desfrutar de nossos doces onde e quando quiser!</p>
            <Link href='https://www.ifood.com.br/' className={`${bernadette.className} z-30 text-white text-2xl transition-all md:hover:opacity-80`}>Pedir Pelo Ifood</Link>
        </div>
      </section>

      <section className='Conhecer flex justify-between w-full py-10 max-md:py-5'>
          <div className="leftBox relative flex justify-center rounded-md max-md:rounded-none items-center max-md:w-full md:w-1/2 lg:w-2/5">
            <div className="absolute w-full h-full bg-gray-800/30 md:hidden"></div>

            <div className="flex flex-col justify-center items-center z-10 p-10 absolute w-full md:hidden">
              <h2 className={`${bernadette.className} text-white text-3xl`}>Conheça nossa Doceria</h2>
              <p className='font-semi text-white text-center md:text-lg sm:text-base text-sm'>Venha conhecer a história da Doceria Bibica e descobrir como oferecemos a melhor experiência em doces e decorações para eventos especiais. Clique abaixo para saber mais.</p>
              <Link href="/Sobre" className={`${bernadette.className} z-30 text-white text-2xl transition-all md:hover:opacity-80`}>Saiba Mais</Link>
            </div>
          </div>

          <div className="flex flex-col justify-center items-center max-md:hidden md:w-1/2 lg:w-3/5 z-10 p-10">
            <h2 className={`${bernadette.className} text-gray-800 text-3xl`}>Conheça nossa Doceria</h2>
            <p>Venha conhecer a história da Doceria Bibica e descobrir como oferecemos a melhor experiência em doces e decorações para eventos especiais. Clique abaixo para saber mais.</p>
            <Link href="/Sobre" className={`${bernadette.className} z-30 text-gray-800 text-2xl transition-all md:hover:opacity-80`}>Saiba Mais</Link>
          </div>
        </section>
    </>
  )
}

Home.getLayout = function getLayout(page) {
  return (
    <Layout>
      {page}
    </Layout>
  )
}


export async function getServerSideProps() {
  const prisma = new PrismaClient();
  const decoracoes = await prisma.decoracoes.findMany({
    where: { disponivel: true },
    include: { imagem: true},
    take: 5
  });
  await prisma.$disconnect();

  return {
    props: {decoracoes},
  };
  
}