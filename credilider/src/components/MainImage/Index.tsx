'use client'

import { useState } from 'react'
import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'
import { ChevronLeft, ChevronRight, Maximize, Maximize2, X } from 'lucide-react'
import './index.css'
import { Moto } from '@/app/lib/definitions'





type dataDescriptionProps = {
  data: Moto;
}

const MainImage: React.FC<dataDescriptionProps> = ({ data }) => {

  const [currentImage, setCurrentImage] = useState<number>(0)

  const imgsFormated = data.imagen.map((img: string) => {
    return `https://lh3.googleusercontent.com/d/${img.split('id=')[1]}=s600`
  })

  console.log('imgsFormated:', imgsFormated);



  const handleImageClick = (index: number) => {
    setCurrentImage(index)
  }

  const handlePrevImage = () => {
    setCurrentImage((prevImage) =>
      prevImage === 0 ? imgsFormated.length - 1 : prevImage - 1
    )
  }

  const handleNextImage = () => {
    setCurrentImage((prevImage) =>
      prevImage === imgsFormated.length - 1 ? 0 : prevImage + 1
    )
  }

  return (
    <div className="moto-container">
      <div className="image-wrapper">
        <Image
          src={imgsFormated[currentImage]}
          alt={`Moto imagen ${currentImage + 1}`}
          width={600}
          height={400}
          className="main-image"
        />
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <div className="maximize-button">
              <Maximize className="maximize-icon" />
            </div>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="overlay" />
            <Dialog.Content className="dialog-content">
              {/* Título oculto visualmente para accesibilidad */}
              <div className="visually-hidden">
                <Dialog.Title></Dialog.Title>
                <Dialog.Description></Dialog.Description>
              </div>

              <div className="image-navigation">
                <button className="nav-left-button" onClick={handlePrevImage}>
                  <ChevronLeft size={32} />
                </button>

                <Image
                  src={imgsFormated[currentImage]}
                  alt={`Moto imagen ampliada ${currentImage + 1}`}
                  width={600}
                  height={400}
                  className="full-image"
                />

                <button className="nav-right-button" onClick={handleNextImage}>
                  <ChevronRight size={32} />
                </button>
              </div>

              <div className="thumbnail-grid" id="thumbnail-popup">
                <div className="thumbnail-popup-container">
                  {imgsFormated.map((image, index) => {
                    return (
                      <div
                        key={index}
                        onClick={() => handleImageClick(index)}
                        className={`thumbnail-button-popup ${currentImage === index ? 'active' : ''}`}
                      >
                        <Image
                          src={image.replace("s600", "s200")}
                          alt={`Moto miniatura ${index + 1}`}
                          width={100}
                          height={100}
                          className="thumbnail-image"
                        />
                      </div>
                    )
                  })}
                </div>
              </div>

              <Dialog.Close asChild>
                <div className="close-button">
                  <X className="icon" />
                </div>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <div className="thumbnail-grid">
        {imgsFormated.map((image, index) => (
          <div
            key={index}
            onClick={() => handleImageClick(index)}
            className={`thumbnail-button ${currentImage === index ? 'active' : ''}`}
          >
            <img
              src={image}
              alt={`Moto miniatura ${index + 1}`}
              width={100}
              height={100}
              className="thumbnail-image"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default MainImage