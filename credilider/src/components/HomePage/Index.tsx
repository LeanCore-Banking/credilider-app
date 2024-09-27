'use client'
import { CreditCardIcon, MailIcon, PhoneIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import "./styles.css"
import Header from "../Header/Index"
import useMotoStore from "@/store/UseMotoStore"


const HomePage: React.FC= () => { 



    return ( 
        <div className="layout">
         <Header/>
        <nav className="navigation">
          <div className="container">
            <div className="navigation-content">
              <div className="menu">
                <div className="menu-items">
                  {["Inicio", "Solicita tu crédito", "Viabilidad de crédito online", "Medios de pago"].map((item, index) => (
                    <button key={index} className="menu-button">
                      {item}
                    </button>
                  ))}
                </div>
              </div>
              <div className="contact-info">
                <div className="option">
                  <PhoneIcon className="icon-small" />
                  <span>123-456-7890</span>
                </div>
                <div className="option">
                  <MailIcon className="icon-small" />
                  <span>info@credilider.com</span>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className="main-content">
          <div className="container">
            <div className="content">
              <div className="text-content">
                <h1 className="main-title">¿Moto Nueva?</h1>
                <h1 className="main-title"> Credilider te la </h1>
                <h1 className="main-title"> financia </h1>
                <p className="highlight-text">Te financiamos hasta el 100% de tu moto</p>
                <p className="disclaimer">*Sujeto a aprobación y estudio de crédito de la entidad que financia</p>
              </div>
              <div className="image-content">
                <Image
                  src="/placeholder.svg"
                  alt="Moto nueva"
                  width={400}
                  height={300}
                  className="image-rounded"
                />
              </div>
            </div>
          </div>
        </main>
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="logo">
                <Image src="/placeholder.svg?height=40&width=120" alt="Credilider Logo" width={120} height={40} />
              </div>
              <div className="footer-links">
                {["Términos y condiciones", "Política de privacidad", "Contacto"].map((item, index) => (
                  <Link key={index} href="#" className="footer-link">
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>


     )
}

export default HomePage
