'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Building, Map, X, Goal, ShieldUser } from 'lucide-react';
import { useMapStore, MapDrawerType } from '@/store/mapStore';

const SearchBar: React.FC = () => {
    const [showSearchInput, setShowSearchInput] = useState(false);
    const { activeDrawer, toggleDrawer } = useMapStore();

    return (
        <div className="flex items-center max-w-[calc(100vw-20px)] w-[518px] h-[69.2px] m-[10px] rounded-[10px] p-[10px] gap-[10px] bg-[#7F1532] z-10 absolute top-0 left-0">
            {!showSearchInput && (
                <>
                    <Link href="/">
                        <Image
                            src="/assets/images/upseelogo.png"
                            alt="Upsee Logo"
                            width={60}
                            height={30}
                        />
                    </Link>

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

                    <div
                        onClick={() => toggleDrawer('buildings')}
                        className={`group w-[49px] h-[49.2px] rounded-[5px] p-[10px] gap-[10px] cursor-pointer flex items-center justify-center 
                        hover:bg-[#FFAE1D] transition-colors duration-300 ease-in-out ${
                            activeDrawer === 'buildings'
                                ? 'bg-[#FFAE1D]'
                                : 'bg-white'
                        }`}
                    >
                        <Building
                            size={24}
                            className="text-[#7F1532] group-hover:text-[#004D37] transition-colors duration-300 ease-in-out"
                        />
                    </div>

                    <div
                        onClick={() => toggleDrawer('activity')}
                        className={`group w-[49px] h-[49.2px] rounded-[5px] p-[10px] gap-[10px] bg-[#FFFFFF] cursor-pointer flex items-center justify-center 
                        hover:bg-[#FFAE1D] transition-colors duration-300 ease-in-out ${
                            activeDrawer === 'activity' ? 'bg-[#FFAE1D]' : ''
                        }`}
                    >
                        <Goal
                            size={24}
                            className="text-[#7F1532] group-hover:text-[#004D37] transition-colors duration-300 ease-in-out"
                        />
                    </div>
                    <div
                        onClick={() => toggleDrawer('security')}
                        className={`group w-[49px] h-[49.2px] rounded-[5px] p-[10px] gap-[10px] bg-[#FFFFFF] cursor-pointer flex items-center justify-center 
                        hover:bg-[#FFAE1D] transition-colors duration-300 ease-in-out ${
                            activeDrawer === 'security' ? 'bg-[#FFAE1D]' : ''
                        }`}
                    >
                        <ShieldUser
                            size={24}
                            className="text-[#7F1532] group-hover:text-[#004D37] transition-colors duration-300 ease-in-out"
                        />
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
