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
  const images = data?.imagen || ['/placeholder.svg?height=400&width=600'] // Usa el array de imágenes del objeto `data`

  const imgsFormated = data.imagen.map((img: string) => {
    return `https://lh3.googleusercontent.com/d/${img.split('id=')[1]}=s200`
  })

  console.log('imgsFormated:', imgsFormated);

  const thumbnails = [
    "/iloveimg-resized/suzuki-dl650-vstrom-2021.jpg",
    "/iloveimg-resized/suzuki-dl650-vstrom-2021.jpg",
    "/iloveimg-resized/suzuki-dl650-vstrom-2021.jpg",
  ]

  const mainImages = [
    "/suzuki-dl650-vstrom-2021.jpg",
    "/suzuki-dl1050-vstrom-xt-2020.jpg",
    "/suzuki-katana-2022.jpg",
    "/suzuki-sv650xa-2018.jpg"
  ]


  const handleImageClick = (index: number) => {
    setCurrentImage(index)
  }

  const handlePrevImage = () => {
    setCurrentImage((prevImage) =>
      prevImage === 0 ? mainImages.length - 1 : prevImage - 1
    )
  }

  const handleNextImage = () => {
    setCurrentImage((prevImage) =>
      prevImage === mainImages.length - 1 ? 0 : prevImage + 1
    )
  }

  return (
    <div className="moto-container">
      <div className="image-wrapper">
        <img
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

              <div className="image-navigation">
                <button className="nav-left-button" onClick={handlePrevImage}>
                  <ChevronLeft size={32} />
                </button>

                <Image
                  src={mainImages[currentImage]}
                  alt={`Moto imagen ampliada ${currentImage + 1}`}
                  width={600}
                  height={400}
                  className="full-image"
                />

                <button className="nav-right-button" onClick={handleNextImage}>
                  <ChevronRight size={32} />
                </button>
              </div>

              <div>
                <div className="thumbnail-grid" id="thumbnail-popup">

                  <div className='thumbnail-popup-container'>
                    {thumbnails.map((image, index) => {
                      console.log('image:', image);
                      return (
                        <div
                          key={index}
                          onClick={() => handleImageClick(index)}
                          className={`thumbnail-button-popup ${currentImage === index ? 'active' : ''}`}
                        >
                          <img
                            src={image}
                            alt={`Moto miniatura ${index + 1}`}
                            width={100}
                            height={100}
                            className="thumbnail-image"
                          />
                        </div>
                      );
                    })}
                  </div>

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
        {thumbnails.map((image, index) => (
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