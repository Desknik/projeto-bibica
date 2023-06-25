import React, { useContext, useEffect, useState } from 'react'
import styles from '../../../styles/dashboard/dashboard.module.css'

import { useRouter } from 'next/router'
import { AuthContext } from '@/contexts/AuthContext'

export default function Navbar() {

  const router = useRouter()
  const currentRoute = router.pathname
  const { user } = useContext(AuthContext)
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const formatDate = () => {
      const dateOptions = { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' };
      const today = new Date();
      const formattedDate = today.toLocaleDateString('pt-BR', dateOptions);
      setCurrentDate(formattedDate);
    };

    formatDate();
  }, []);

  return (
    <div className={`relative w-full rounded-b-3xl overflow-hidden ${styles.navbar} transition-all ${currentRoute === '/dashboard' ? ' h-36' : ' h-20'}`}>
      <div className="absolute w-full h-full z-10 bg-black opacity-10"></div>
      <div className="flex justify-between px-5 pt-4 z-50">
        <div className="z-10">
          <p className='sm:text-lg text-sm text-start font-medium text-white'>{currentDate}</p>
        </div>

        <div className="flex z-10 justify-center items-center gap-3">
          <p className='sm:text-lg text-sm font-medium text-end text-white'>Olá{!!user && ` ${user.nickname}`}!</p>
        </div>
      </div>
    </div>
  )
}
