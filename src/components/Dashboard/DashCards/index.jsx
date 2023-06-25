import React from 'react'
import {FaCalendarAlt} from "react-icons/fa";

export function Card({sx, bg, titulo, ganho, data, openModal}) {

    const formatarValorMonetario = (valor) => {
      const valorFormatado = parseFloat(valor).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return valorFormatado;
    }

    return (
        <div className={`relative col-span-1 shadow-md bg-opacity-0 backdrop-filter backdrop-blur-sm h-36 rounded-2xl transition-all md:hover:scale-105 overflow-hidden ${sx}`}> 
            <div className={`absolute top-0 left-0 w-full h-full -z-10 opacity-75 ${bg}`}></div>

            <div className="relative flex flex-col justify-center py-5 px-3 gap-8">

                <div className="flex justify-between items-center">
                    <p className='text-lg font-bold text-white'>{titulo}</p>
                    {data && <button onClick={() => openModal(true)} className='max-lg:block hidden absolute right-2 top-2 p-3'><FaCalendarAlt className='text-2xl text-gray-300'/></button>}
                </div>

                <span className='text-3xl font-bold text-white tabular-nums font-sans' >{formatarValorMonetario(ganho)}</span>
            </div>
        </div>
    )
}

export function ExtendedCard({bg, vendaMes, vendaDia}) {

    return (
        <div className={`md:col-span-2 sm:col-span-1  shadow-md opacity-90 h-36 rounded-2xl z-10 transition-all md:hover:scale-105 ${bg}`}>
            <div className="flex justify-around items-center h-full">

              <div className="flex flex-col items-center w-1/2 h-24 pt-3 border-r">
                <p className='text-white font-bold text-xl text-center'>Vendas no Mês</p>
                <span className='text-white font-bold font-sans text-2xl'>{vendaMes}</span>
              </div>

              <div className="flex flex-col items-center w-1/2 h-24 pt-3">
                <p className='text-white font-bold text-xl text-center'>Vendas do Dia</p>
                <span className='text-white font-bold font-sans text-2xl'>{vendaDia}</span>
              </div>

            </div>
          </div>
    )
}