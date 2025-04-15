import React, { useState } from 'react';
import Image from 'next/image';
import { Search, Building, Map, X } from 'lucide-react';

const SearchBar = () => {
    const [showSearchInput, setShowSearchInput] = useState(false);

    return (
        <div className="flex flex-row max-w-[calc(100vw-20px)] w-[518px] h-[69.2px] m-[10px] rounded-[10px] p-[10px] gap-[10px] bg-[#7F1532] z-10 absolute top-0 left-0">
            {!showSearchInput && (
                <>
                    <Image
                        src="/assets/images/upseelogo.png"
                        alt="Upsee Logo"
                        width={80}
                        height={40}
                    />

                    <div className="hidden md:flex items-center flex-1 bg-white text-black rounded-[8px] px-4 py-2 border-2 border-transparent focus-within:border-[#FFAE1D]">
                        <Search size={20} className="mr-2 text-[#7F1532]" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="flex-1 bg-transparent outline-none text-[#7F1532]"
                        />
                    </div>

                    <div
                        className="md:hidden w-[49px] h-[49.2px] rounded-[5px] p-[10px] gap-[10px] bg-[#FFFFFF] cursor-pointer flex items-center justify-center ml-auto"
                        onClick={() => setShowSearchInput(true)}
                    >
                        <Search size={24} className="text-[#7F1532]" />
                    </div>

                    <div className="w-[49px] h-[49.2px] rounded-[5px] p-[10px] gap-[10px] bg-[#FFFFFF] cursor-pointer flex items-center justify-center">
                        <Building size={24} className="text-[#7F1532]" />
                    </div>

                    <div className="w-[49px] h-[49.2px] rounded-[5px] p-[10px] gap-[10px] bg-[#FFFFFF] cursor-pointer flex items-center justify-center">
                        <Map size={24} className="text-[#7F1532]" />
                    </div>
                </>
            )}

            {showSearchInput && (
                <div className="flex items-center w-full">
                    <div className="flex items-center flex-1 bg-white text-black rounded-[8px] px-4 py-2 border-2 border-transparent focus-within:border-[#FFAE1D]">
                        <Search size={20} className="mr-2 text-[#7F1532]" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="flex-1 bg-transparent outline-none text-[#7F1532]"
                            autoFocus
                        />
                    </div>
                    <div
                        className="w-[49px] h-[49.2px] rounded-[5px] ml-2 p-[10px] gap-[10px] bg-[#FFFFFF] cursor-pointer flex items-center justify-center"
                        onClick={() => setShowSearchInput(false)}
                    >
                        <X size={24} className="text-[#7F1532]" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchBar;
