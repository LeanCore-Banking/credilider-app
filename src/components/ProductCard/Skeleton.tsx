import Link from "next/link"
import { MoveRight } from "lucide-react"
import "./skeleton.css"
export default function ProductCardSkeleton() {
  return (
    <div className="product-card skeleton">
      <div className="product-card__image skeleton-image"></div>
      <div className="product-card__info">
        <div className="color-list-skeleton">
          <span className="color-dot skeleton-color"></span>
          <span className="color-dot skeleton-color"></span>
          <span className="color-dot skeleton-color"></span>
        </div>
        <div className="info-card">
          <span className="skeleton-text"></span>
          <span className="skeleton-text"></span>
        </div>
        <div className="info-price">
          <h3 className="skeleton-text"></h3>
          <span className="skeleton-text"></span>
        </div>
      </div>
      <div className="btn-r-arrow">
        <Link href="#" className="skeleton-link">
          <span className="skeleton-text"></span>
          <MoveRight />
        </Link>
      </div>
    </div>
  )
}