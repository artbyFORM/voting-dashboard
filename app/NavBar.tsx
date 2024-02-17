import Link from 'next/link'
import React from 'react'
import { FaGlobe } from "react-icons/fa"; // placeholder


const NavBar = () => {
  const links = [
        { label: 'Dashboard', href: '/' },
        { label: 'Overview', href: '/' },
        { label: 'Settings', href: '/' },
  ]
  return (
    <nav className='flex space-x-6 border-b mb-5 px-5 h-14 items-center'>
        <Link href="/"> <FaGlobe/> </Link>
        <ul className='flex space-x-6'>
            {links.map((link) => 
                <Link 
                key={link.href} 
                className="text-zinc-100 hover:text-zinc-400 transition-colors" 
                href={link.href}>{link.label}</Link>)}
        </ul>
    </nav>
  )
}

export default NavBar