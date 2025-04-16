import React from 'react'
import Image from 'next/image'
import {Building, Goal, Search} from 'lucide-react'

const SearchBar = () => {
  return (
    <div className="flex flex-row w-[518px] h-[69.2px] rounded-[10px] p-[10px] gap-[10px] bg-[#7F1532] m-[10px] cursor-pointer">
      <Image 
        src="/assets/images/upseelogo.png" 
        alt="Upsee Logo"
        width={80} 
        height={40} 
      />

        <div className="flex items-center flex-1 bg-white text-black rounded-[8px] px-4 py-2 border-2 border-transparent focus-within:border-[#FFAE1D]">
            <Search width={20} height={20} className='mr-2' color='#C8C8C8'/>
            <input 
                type="text" 
                placeholder="Search" 
                className="flex-1 bg-transparent outline-none text-[#7F1532]"
            />
        </div>

        <div className='group w-[49px] h-[49.2px] rounded-[5px] p-[10px] gap-[10px] bg-[#FFFFFF] cursor-pointer transform transition-transform duration-200 hover:scale-110'>
          <Building className="w-[29px] h-[29px] text-[#7F1532] group-hover:text-[#FFAE1D]" />
        </div>

        <div className='group w-[49px] h-[49.2px] rounded-[5px] p-[10px] gap-[10px] bg-[#FFFFFF] cursor-pointer transform transition-transform duration-200 hover:scale-110'>
          <Goal className="w-[29px] h-[29px] text-[#7F1532] group-hover:text-[#FFAE1D]" />
        </div>

    </div>
  )
}

export default SearchBar