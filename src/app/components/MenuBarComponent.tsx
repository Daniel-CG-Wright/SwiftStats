// src/app/components/MenuBarComponent.tsx
"use client"
import Link from 'next/link';
import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const MenuBarComponent: React.FC = () => {
    const pathName = usePathname(); // Get the current route
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }
    , [pathName]);

    return (
        <nav className="menu-bar">
            <ul className="flex justify-left">
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
            </ul>
        </nav>
    );
};

export default MenuBarComponent;