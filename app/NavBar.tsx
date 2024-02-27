'use client';

import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'
import { FaGlobe } from "react-icons/fa"; // placeholder
import classnames from 'classnames';

const NavBar = () => {

  const currentPath = usePathname();
  console.log(currentPath);

  const links = [
        { label: 'Dashboard', href: '/' },
        { label: 'Vote', href: '/submissions/music' },
        { label: 'Settings', href: '/settings' },
  ]
  return (
    <nav className='flex space-x-6 border-b mb-5 px-5 h-14 items-center'>
        <Link href="/"> <FaGlobe/> </Link>
        <ul className='flex space-x-6'>
            {links.map((link) => 
                <Link 
                key={link.href} 
                className={classnames({
                  'text-zinc-100': link.href === currentPath,
                  'text-zinc-500': link.href !== currentPath,
                  'hover:text-zinc-500 transition-colors': true
                })} 
                href={link.href}>{link.label}</Link>)}
        </ul>
    </nav>
  )
}

export default NavBar