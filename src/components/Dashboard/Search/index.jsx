import { stringify } from 'postcss';
import React, { useEffect, useState } from 'react'

export default function Search({list, setFilteredList, fieldName }) {

    const [searchValue, setSearchValue] = useState("");

    const handleSearch = async (e) => { // Função que busca filtra os dados de uma lista pela informação da barra de pesquisa

        if (searchValue == ""){
            setFilteredList(list);
        }
        else if(!isNaN(searchValue)){
            setFilteredList(list.filter(item => item.id == searchValue))
        }
        else{
            setFilteredList(list.filter(item => item[fieldName].toUpperCase().includes(searchValue.trim().toUpperCase())))
        }

    };

    useEffect(() => {
        handleSearch()
    },[list, handleSearch])

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
