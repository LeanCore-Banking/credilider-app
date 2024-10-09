import Image from "next/image"
import "./styles.css"
import Link from "next/link"

export const Head = () => {
    return (
        <div>
            <header className='header-row'>
                <Link href="/"> 
                <div className="img-container">
                    <Image
                        src="/logo-head-credilider.png"
                        alt="logo-credilider"
                        width={120}
                        height={80}
                    />
                </div>
                </Link>
                <div className="row1"></div>
                <div className="row2"></div>
            </header>
        </div>
    )
}
