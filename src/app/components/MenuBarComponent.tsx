// src/app/components/MenuBarComponent.tsx
import Link from 'next/link';
import React from 'react';

const MenuBarComponent: React.FC = () => {
    return (
        <nav className="menu-bar">
            <ul className="flex justify-left">
                <li>
                    <Link href="/" className="link px-4 font-bold text-lg">
                        Home
                    </Link>
                </li>
                <li>
                    <Link href="/about" className="link px-4 font-bold text-lg">
                        About
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default MenuBarComponent;