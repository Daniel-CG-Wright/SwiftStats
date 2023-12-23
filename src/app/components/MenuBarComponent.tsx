// src/app/components/MenuBarComponent.tsx
"use client"
import Link from 'next/link';
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const MenuBarComponent: React.FC = () => {
    const pathName = usePathname(); // Get the current route
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }
    , [pathName]);

    return (
        <nav className="menu-bar">
            <ul className="flex justify-between items-center w-full">
                <div className="flex items-center space-x-4">
                    <li>
                    <Link href="/" className={`${pathName === '/' ? 'active-menubar-link' : 'inactive-menubar-link'} link px-4 font-bold text-lg`}>
                        Home
                    </Link>
                    </li>
                    <li>
                    <Link href="/about" className={`${pathName === '/about' ? 'active-menubar-link' : 'inactive-menubar-link'} link px-4 font-bold text-lg`}>
                        About
                    </Link>
                    </li>
                    <li>
                    <Link href="/how-to-use" className={`link px-4 font-bold text-lg ${pathName === '/how-to-use' ? 'active-menubar-link' : 'inactive-menubar-link'}`}>
                        How To Use
                    </Link>
                    </li>
                </div>
                <li className="hidden md:flex items-center">
                    <span className="font-bold text-4xl">SwiftStats</span>
                    <Image src="/logo.png" alt="SwiftStats Logo" className="mr-2" width={80} height={80} />
                </li>
            </ul>
        </nav>
    );
};

export default MenuBarComponent;