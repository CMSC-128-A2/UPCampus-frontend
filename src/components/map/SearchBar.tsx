import React from 'react';
import Image from 'next/image';
import { Search, Building, Map } from 'lucide-react';

const SearchBar = () => {
    return (
        <div className="flex flex-row w-full max-w-[518px] h-[69.2px] rounded-[10px] p-[10px] gap-[10px] bg-[#7F1532] m-[10px] z-10 absolute top-0 left-0">
            <Image
                src="/assets/images/upseelogo.png"
                alt="Upsee Logo"
                width={80}
                height={40}
            />

            <div className="flex items-center flex-1 bg-white text-black rounded-[8px] px-4 py-2 border-2 border-transparent focus-within:border-[#FFAE1D]">
                <Search size={20} className="mr-2 text-[#7F1532]" />
                <input
                    type="text"
                    placeholder="Search"
                    className="flex-1 bg-transparent outline-none text-[#7F1532]"
                />
            </div>

            <div className="w-[49px] h-[49.2px] rounded-[5px] p-[10px] gap-[10px] bg-[#FFFFFF] cursor-pointer flex items-center justify-center">
                <Building size={24} className="text-[#7F1532]" />
            </div>

            <div className="w-[49px] h-[49.2px] rounded-[5px] p-[10px] gap-[10px] bg-[#FFFFFF] cursor-pointer flex items-center justify-center">
                <Map size={24} className="text-[#7F1532]" />
            </div>
        </div>
    );
};

export default SearchBar;
