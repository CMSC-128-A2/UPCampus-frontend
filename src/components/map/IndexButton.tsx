'use client';
import React, { ReactNode } from 'react';

interface IndexButtonProps {
    index: string;
    icon: ReactNode;
}

const IndexButton = ({ index, icon }: IndexButtonProps) => {
    return (
        <button
            className="border-[#7F1532] w-[65px] h-[34px] min-w-[65px] gap-[3px] px-[10px] py-0 rounded-full border-[2px]  flex items-center justify-center bg-white"
        >
            {/* Set icon size explicitly */}
            <div className="text-[#7F1532] w-[24px] h-[24px]">{icon}</div>
            <span className='text-[#7F1532]'>{index}</span>
        </button>
    );
};

export default IndexButton;
