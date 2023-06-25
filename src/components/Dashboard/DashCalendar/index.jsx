import { DateRange  } from "react-date-range";
import { pt } from 'date-fns/locale'
import { useEffect, useState } from "react";
import { addDays, subDays } from "date-fns";

export default function Calendar({ onChange, onClick,  }) {


  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection"
    }
  ]);

  const handleOnChange = (ranges) => {
    const { selection } = ranges;
    onChange(selection);
    setState([selection]);
  };
  
  return (
    <div style={{minWidth: '20rem'}}  className="">
      <div className="flex relative justify-center items-center z-10  bg-opacity-0 backdrop-filter backdrop-blur-sm shadow-md rounded-2xl transition-all md:hover:scale-105 overflow-hidden">
        <div className=" absolute top-0 left-0 w-full h-full -z-10 opacity-75 bg-gradient-to-tr from-pink-600 via-purple-700 to-indigo-500 border-fuchsia-600"></div>
        <DateRange 
            locale={pt}
            onChange={handleOnChange}
            ranges={state}
            moveRangeOnFirstSelection={false}
            showDateDisplay={false}
            showMonthAndYearPickers={false}
            rangeColors={['rgba(58, 5, 110, 0.3)', '#ffffff', '#00ff04']}
            className='font-sans'
          />
      </div>

      <div className="flex justify-end mt-2">
        <button onClick={onClick} className={`bg-gradient-to-r from-pink-600 to-purple-700 text-white rounded-md shadow-md px-2 py-1 transition-all md:hover:opacity-90`}>Buscar</button>
      </div>
    </div>
  )
}
