'use client';

import React from 'react';
import Link from 'next/link';
import { Icon } from '@iconify/react';

interface BuildingViewProps {
    id: string;
}

function BuildingView({ id }: BuildingViewProps) {
    return (
        <main className="w-full h-full">
            <Link
                href="/map"
                className="absolute rounded-full bg-green-accent text-white m-4 p-2 opacity-50 hover:opacity-100 transition-opacity duration-300"
            >
                <Icon icon="mdi:arrow-back" width="24" height="24" />
            </Link>
            <div className="flex flex-col items-center justify-center">
                <h1>Building {id}</h1>
            </div>
        </main>
    );
}

export default BuildingView;
