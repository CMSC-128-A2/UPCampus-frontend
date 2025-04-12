import React from 'react'
import Image from 'next/image'

const SearchBar = () => {
  return (
    <div className="flex flex-row w-[518px] h-[69.2px] rounded-[10px] p-[10px] gap-[10px] bg-[#7F1532] m-[10px]">
      <Image 
        src="/assets/images/upseelogo.png" 
        alt="Upsee Logo" 
        width={80} 
        height={40} 
      />


        <div className="flex items-center flex-1 bg-white text-black rounded-[8px] px-4 py-2">
                <Image 
                src="/assets/icons/lucide_search.svg" 
                alt="Search Icon" 
                width={20} 
                height={20} 
                className="mr-2"
                />
                <input 
                type="text" 
                placeholder="Search" 
                className="flex-1 bg-transparent outline-none"
                />
        </div>

        <div className='w-[49px] h-[49.2px] rounded-[5px] p-[10px] gap-[10px] bg-[#FFFFFF]'>
            <Image 
                src="/assets/icons/buildings.svg" 
                alt="Search Icon" 
                width={40} 
                height={40} 
                className="mr-2"
            />
        </div>

        <div className='w-[49px] h-[49.2px] rounded-[5px] p-[10px] gap-[10px] bg-[#FFFFFF]'>
            <Image 
                src="/assets/icons/activityarea.svg" 
                alt="Activity Area Icon" 
                width={40} 
                height={40} 
                className="mr-2"
            />
        </div>
    
    </div>
  )
}

export default SearchBar