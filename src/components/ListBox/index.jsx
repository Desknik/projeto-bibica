import React, { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { BiChevronDown, BiCheck } from 'react-icons/bi'


export default function ListBox({selectedValue, setSelectedValue, List, inputStyle, dropdownStyle,  }) {

  return (
    <Listbox value={selectedValue} onChange={setSelectedValue} defaultValue={List[0]}>
        <div className="relative">
            <Listbox.Button className={`relative w-full cursor-pointer bg-zinc-800 text-zinc-600 rounded-lg h-10 px-3 text-start hover:opacity-95 shadow-md focus:outline-none sm:text-sm ${inputStyle}`}>
                <span className="block truncate">{selectedValue.name}</span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <BiChevronDown
                    className="h-5 w-5 text-gray-500"
                    aria-hidden="true"
                />
                </span>
            </Listbox.Button>
            <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <Listbox.Options className={`absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-zinc-800 py-1 z-40 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm ${dropdownStyle}`}>
                {List.map((listItem, listIdx) => (
                    <Listbox.Option
                    key={listIdx}
                    className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-pink-300 text-zinc-100' : 'text-zinc-500'
                        }`
                    }
                    value={listItem}
                    >
                    {({ selected }) => (
                        <>
                        <span
                            className={`block truncate ${
                            selected ? 'font-semibold' : 'font-normal'
                            }`}
                        >
                            {listItem.name}
                        </span>
                        {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-pink-300">
                            <BiCheck className="h-5 w-5" aria-hidden="true" />
                            </span>
                        ) : null}
                        </>
                    )}
                    </Listbox.Option>
                ))}
                </Listbox.Options>
            </Transition>
        </div>
    </Listbox>
  )
}
