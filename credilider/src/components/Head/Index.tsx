import Image from "next/image"
import "./styles.css"

export const Head = () => {
    return (
        <div>
            <header className='header-row'>
                <div className="img-container">
                    <Image
                        src="/logo-head-credilider.png"
                        alt="logo-credilider"
                        width={120}
                        height={80}
                    />
                </div>
                <div className="row1"></div>
                <div className="row2"></div>
            </header>
        </div>
    )
}
