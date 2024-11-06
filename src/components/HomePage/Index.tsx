'use server'

import Image from "next/image"
import "./styles.css"
import Header from "../Header/Index"
import Banner from "../../../public/banner-home.png"
import { robotoCondensed } from "@/app/fonts/fonts"


const HomePage: React.FC = () => {

  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        <div className={`${robotoCondensed.className} container`}>
          <div className="content">
            <div className="text-container">

              <div className="text-content">
                <h1 className="main-title">¿MOTO NUEVA?</h1>
                <h1 className="main-title"> CREDILIDER TE LA FINANCIA </h1>
                <h3 className="highlight-text" id="text-contet-sub-title">Te financiamos hasta el 100% de tu moto</h3>
                <p className="disclaimer">*Sujeto a aprobación y estudio de crédito de la entidad que financia.
                  Entidad que financia Socolfi S.A.S
                </p>
              </div>

            </div>
            
            <div className="image-content">
              <Image
                src={Banner}
                alt="Moto banner"
                width={500}
                height={400}
                className="image-rounded"
              />
            </div>
          </div>
        </div>
      </main>
      {/*         <footer className="footer">
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
        </footer> */}
    </div>


  )
}

export default HomePage
