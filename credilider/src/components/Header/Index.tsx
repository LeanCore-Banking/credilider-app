'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CreditCardIcon, PhoneIcon, MailIcon, MenuIcon, XIcon, Newspaper } from 'lucide-react'
import styles from './ResponsiveHeader.module.css'
import { robotoCondensed } from '@/app/fonts/fonts'

export default function ResponsiveHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const headerOptions = [
    { icon: CreditCardIcon, text: 'Paga tu cuota aquí', ref: '/paga-tu-cuota' },
    { icon: PhoneIcon, text: 'Contacto celular', ref: '/contacto-celular' },
    { icon: MailIcon, text: 'Contáctanos vía E-mail', ref: '/contacto-email' },
    { icon: Newspaper, text: 'Cotizar', ref: '/products' },
  ]

  const navItems = [
    { text: "Inicio", ref: "/" },
    { text: "Solicita tu crédito", ref: "/solicita-tu-credito" },
    { text: "Viabilidad de crédito online", ref: "/viabilidad-credito-online" },
    { text: "Medios de pago", ref: "/medios-de-pago" },
  ]

  return (
    <div className={robotoCondensed.className}>

      <div className={styles.headerWrapper}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.logo}>
              <Image
                src="/logo-credilider-head.png"
                alt="credilider-logo"
                width={150}
                height={100}
              />
            </div>
            <div className={styles.headerOptions}>
              {headerOptions.map((option, index) => (
                <Link key={index} href={option.ref}>
                  <div className={`${styles.option} ${option.text === "Cotizar" ? styles.cotizarOption : ''}`}>
                    <option.icon className={styles.icon} />
                    <span>{option.text}</span>
                    {index < headerOptions.length - 1 && <span className={styles.divider}>|</span>}
                  </div>
                </Link>
              ))}
            </div>

            <button className={styles.menuButton} onClick={toggleMenu}>
              {isMenuOpen ? <XIcon className={styles.icon} /> : <MenuIcon className={styles.icon} />}
            </button>
          </div>
        </header>

        {/* Mobile menu */}
        <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}>
          <div className={styles.mobileNavItems}>
            {navItems.map((item, index) => (
              item.text !== "Inicio" &&
              <Link key={index} href={item.ref} >
                <div key={index} className={styles.mobileNavItem}>
                  {item.text}
                </div>
              </Link>
            ))}
          </div>
          <div className={styles.mobileHeaderOptions}>
            {headerOptions.map((option, index) => (
              <Link key={index} href={option.ref} >
                <div key={index} className={styles.mobileOption}>
                  <option.icon className={styles.icon} />
                  <span>{option.text}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop navigation */}
        <nav className={styles.desktopNav}>
          <div className={styles.navContent}>
            <div className={styles.navItems}>
              {navItems.map((item, index) => (
                <button key={index} className={styles.navItem}>
                  {item.text}
                </button>
              ))}
            </div>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <PhoneIcon className={styles.icon} />
                <span>123-456-7890</span>
              </div>
              <div className={styles.contactItem}>
                <MailIcon className={styles.icon} />
                <span>info@credilider.com</span>
              </div>
            </div>
          </div>
        </nav>
      </div>
      
    </div>
  )
}