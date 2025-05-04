'use client';
import React, { ReactNode } from 'react';

interface IndexButtonProps {
    index: string;
    icon: ReactNode;
}

const IndexButton = ({ index, icon }: IndexButtonProps) => {
    return (
        <div className="border-[#7F1532] w-[50px] h-[28px] min-w-[50px] gap-[2px] px-[6px] py-0 rounded-full border-[1.5px] flex items-center justify-center bg-white">
            {/* Set icon size explicitly */}
            <div className="text-[#7F1532] w-[16px] h-[16px] flex items-center justify-center">
                {icon}
            </div>
            <span className="text-[#7F1532] text-sm">{index}</span>
        </div>
    );
};

export default IndexButton;
