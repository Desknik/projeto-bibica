import { Fragment, useRef, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { BiX } from 'react-icons/bi'

export default function Modal({ isOpen, onClose, tittle, children, sx }) {
  const cancelButtonRef = useRef(null)

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" initialFocus={cancelButtonRef} onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center max-md:p-0">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enterTo="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 translate-y-0 sm:scale-100" leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            
              <Dialog.Panel className={`${!sx? 'relative z-50 transform rounded-lg bg-white text-left shadow-xl transition-all max-md:w-full max-md:mx-3 sm:my-8 sm:w-full sm:max-w-lg px-4 pb-4 pt-5' : sx} `}>
                                                                                                                          
               
                <button
                    type="button"
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-6 lg:top-6 !border-none !outline-none !ring-0"
                    onClick={() => onClose()}
                >
                    <BiX className="h-6 w-6 !border-none !outline-none !inset-0 !stroke-none !ring-0"/>
                </button>

                <Dialog.Title className="flex justify-between items-center flex-wrap text-lg font-bold mb-4">
                    {tittle}
                </Dialog.Title>

                {children}

              </Dialog.Panel>
             
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}