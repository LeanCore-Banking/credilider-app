import "./styles.css";
const shimmer =
  'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

  export function CardQuoteSkeleton() {
    return (
      <div className="card-quote-skeleton">
        <div className="skeleton-header">
          <div className="skeleton-circle" />
          <div className="skeleton-line" />
        </div>
        <div className="skeleton-body">
          <div className="skeleton-large-line" />
        </div>
      </div>
    );
  }
  

  export function MainImageSkeleton() {
    return (
      <div
        className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-2 shadow-sm`}
      >
        <div className="flex p-4">
          <div className="h-5 w-5 rounded-md bg-gray-200" />
          <div className="ml-2 h-6 w-16 rounded-md bg-gray-200 text-sm font-medium" />
        </div>
        <div className="flex items-center justify-center truncate rounded-xl bg-white px-4 py-8">
          <div className="h-7 w-20 rounded-md bg-gray-200" />
        </div>
      </div>
    );
  }

  export function DescriptionBlockSkeleton() {
    return (
      <div
        className={`${shimmer} relative overflow-hidden rounded-xl bg-gray-100 p-2 shadow-sm`}
      >
        <div className="flex p-4">
          <div className="h-5 w-5 rounded-md bg-gray-200" />
          <div className="ml-2 h-6 w-16 rounded-md bg-gray-200 text-sm font-medium" />
        </div>
        <div className="flex items-center justify-center truncate rounded-xl bg-white px-4 py-8">
          <div className="h-7 w-20 rounded-md bg-gray-200" />
        </div>
      </div>
    );
  }

  export function QuotesCardSkeleton () {
    return(
      <div className="data-container-quotes-card-skeleton">
      <div className="quote-data-row-quotes-card-skeleton">
          <div className="quote_data-head-quotes-card-skeleton">
              <h3 className="skeleton-quotes-card-skeleton"></h3>
              <span id="quote-value" className="skeleton-quotes-card-skeleton"></span>
              <span id="quote-month" className="skeleton-quotes-card-skeleton"></span>
          </div>
          <div className="quote-body-quotes-card-skeleton">
              <div>
                  <span className="skeleton-quotes-card-skeleton"></span>
                  <span className="skeleton-quotes-card-skeleton"></span>
              </div>
              <div>
                  <span className="skeleton-quotes-card-skeleton"></span>
                  <span className="skeleton-quotes-card-skeleton"></span>
              </div>
              <div>
                  <span className="skeleton-quotes-card-skeleton"></span>
                  <span className="skeleton-quotes-card-skeleton"></span>
              </div>
              <div className="value-to-pay-quotes-card-skeleton">
                  <span className="skeleton-quotes-card-skeleton"></span>
                  <span className="skeleton-quotes-card-skeleton"></span>
              </div>
          </div>
      </div>
      <div className="quote-data-row-quotes-card-skeleton">
          <div className="quote_data-head-quotes-card-skeleton">
              <h3 className="skeleton-quotes-card-skeleton"></h3>
              <span id="quote-value" className="skeleton-quotes-card-skeleton"></span>
              <span id="quote-month" className="skeleton-quotes-card-skeleton"></span>
          </div>
          <div className="quote-body-quotes-card-skeleton">
              <div>
                  <span className="skeleton-quotes-card-skeleton"></span>
                  <span className="skeleton-quotes-card-skeleton"></span>
              </div>
              <div>
                  <span className="skeleton-quotes-card-skeleton"></span>
                  <span className="skeleton-quotes-card-skeleton"></span>
              </div>
              <div>
                  <span className="skeleton-quotes-card-skeleton"></span>
                  <span className="skeleton-quotes-card-skeleton"></span>
              </div>
              <div className="value-to-pay-quotes-card-skeleton">
                  <span className="skeleton-quotes-card-skeleton"></span>
                  <span className="skeleton-quotes-card-skeleton"></span>
              </div>
          </div>
      </div>
      <div className="quote-data-row-quotes-card-skeleton">
          <div className="quote_data-head-quotes-card-skeleton">
              <h3 className="skeleton-quotes-card-skeleton"></h3>
              <span id="quote-value" className="skeleton-quotes-card-skeleton"></span>
              <span id="quote-month" className="skeleton-quotes-card-skeleton"></span>
          </div>
          <div className="quote-body-quotes-card-skeleton">
              <div>
                  <span className="skeleton-quotes-card-skeleton"></span>
                  <span className="skeleton-quotes-card-skeleton"></span>
              </div>
              <div>
                  <span className="skeleton-quotes-card-skeleton"></span>
                  <span className="skeleton-quotes-card-skeleton"></span>
              </div>
              <div>
                  <span className="skeleton-quotes-card-skeleton"></span>
                  <span className="skeleton-quotes-card-skeleton"></span>
              </div>
              <div className="value-to-pay-quotes-card-skeleton">
                  <span className="skeleton-quotes-card-skeleton"></span>
                  <span className="skeleton-quotes-card-skeleton"></span>
              </div>
          </div>
      </div>
      
  </div>
  

    )
  } 