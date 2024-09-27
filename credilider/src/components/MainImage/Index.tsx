'use client'

import { useState } from 'react'
import Image from 'next/image'
import * as Dialog from '@radix-ui/react-dialog'
import { Maximize2, X } from 'lucide-react'
import './index.css'

const images: string[] = [
  '/placeholder.svg?height=400&width=600',
  '/placeholder.svg?height=400&width=600',
  '/placeholder.svg?height=400&width=600',
  '/placeholder.svg?height=400&width=600',
]

export default function MainImage(): JSX.Element {
  const [currentImage, setCurrentImage] = useState<number>(0)

  const handleImageClick = (index: number) => {
    setCurrentImage(index)
  }

  return (
    <div className="moto-container">
      <div className="image-wrapper">
        <Image
          src={images[currentImage]}
          alt={`Moto imagen ${currentImage + 1}`}
          width={600}
          height={400}
          className="main-image"
        />
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button className="maximize-button">
              <Maximize2 className="icon" />
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="overlay" />
            <Dialog.Content className="dialog-content">
              <Image
                src={images[currentImage]}
                alt={`Moto imagen ampliada ${currentImage + 1}`}
                width={800}
                height={600}
                className="full-image"
              />

              <div>
              <div className="thumbnail-grid">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => handleImageClick(index)}
            className={`thumbnail-button ${currentImage === index ? 'active' : ''}`}
          >
            <Image
              src={image}
              alt={`Moto miniatura ${index + 1}`}
              width={100}
              height={100}
              className="thumbnail-image"
            />
          </button>
        ))}
      </div>
              </div>
              <Dialog.Close asChild>
                <button className="close-button">
                  <X className="icon" />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <div className="thumbnail-grid">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => handleImageClick(index)}
            className={`thumbnail-button ${currentImage === index ? 'active' : ''}`}
          >
            <Image
              src={image}
              alt={`Moto miniatura ${index + 1}`}
              width={100}
              height={100}
              className="thumbnail-image"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
