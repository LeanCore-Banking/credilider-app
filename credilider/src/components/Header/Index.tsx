'use client'

import { CreditCardIcon, MailIcon, PhoneIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import "./style.css";
import { useRouter } from "next/navigation";


const Header: React.FC = () => {

  const router = useRouter()

  const navigateToProductPage = () => {
    //router.push(`/products/?shopId=${param}`)
  }

  return (
    <div>
      <header className="header-home">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <Image src="/placeholder.svg?height=40&width=120" alt="Credilider Logo" width={120} height={40} />
            </div>
            <div className="header-options">
              <div className="option">
                <CreditCardIcon className="icon" />
                <span>Paga tu cuota aquí</span>
              </div>
              <div className="divider hidden-md">|</div>
              <div className="option">
                <PhoneIcon className="icon" />
                <span>Contacto celular</span>
              </div>
              <div className="divider hidden-md">|</div>
              <div className="option">
                <MailIcon className="icon" />
                <span>Contáctanos vía E-mail</span>
              </div>
              <div className="divider hidden-md">|</div>
              <Link href={`/products`}>
                <button className="quote-button">
                  Cotizar
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

export default Header;




