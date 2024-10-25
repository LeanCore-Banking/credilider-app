export function cotizacionHTML(quotes: any[], data: any): string {
  
  const imgsFormated = data.imagen.map((img: string) => {
    return `https://lh3.googleusercontent.com/d/${img.split('id=')[1]}=s600`;
  });

  const crediliderLogo = "https://lh3.googleusercontent.com/d/1rY3dYlDD0wsIAPHAn_69wf7wUqy-zXOW=s200";
  const formatedImage = imgsFormated[0];
  
  return `
  <!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Cotización</title>
    <style>
       body{
        -webkit-print-color-adjust:exact !important;
        print-color-adjust:exact !important;
      }   
      .pdf-container {
        margin: 0 auto;
      }
      .pdf-data-row {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-bottom: 20px;
      }

      #pdf-data-row-img-container {
        height: auto;
        border-radius: 10px;
        flex-direction: row;
        justify-content: center;
      }

      .pdf-quote-number {
        font-weight: 600;
        font-size: 80px;
        color: #666;
      }

      .-pdf-logo-header img {
        width: 100%;
        height: auto;
      }

      .-pdf-logo-header {
        height: fit-content;
        padding-top: 1em;
        width: 15%;
        background: #fdfdfd;
        box-shadow: #3b3b3b 0px 0px 5px 0px;
      }

      .pdf-main-img {
        width: 65%;
        height: 100%;
      }

      .pdf-main-img img {
        width: 100%;
        height: auto;
        background: #ffc401;
      }

      .pdf-quote-data-row {
        min-width: 65%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }

      .pdf-quote_data-head {
        display: flex;
        align-items: center;
      }

      .pdf-head-content {
        display: flex;
        position: absolute;
        gap: 4em;
        width: 100%;
        padding-left: 1em;
      }

      .pdf-conten-head-text {
        padding-top: 2em;
        color: #EBEBEB;
      }

      .pdf-quote_data-head h3 {
        color: #333;
        font-weight: 300;
        margin: 0 0 10px 0;
      }

      .pdf-quote_data-head:nth-child(1) {
        font-size: 14px;
      }

      #pdf-quote-value {
        font-size: 24px;
        font-weight: bold;
        color: #3b3b3b;
        display: block;
        margin: 0 0 10px 0;
      }

      #pdf-quote-month {
        font-size: 16px;
        font-weight: bold;
        color: #3b3b3b;
      }

      .pdf-data-row-container {
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      #pdf-quotes-row-container {
        background: #EBEBEB;
        padding-top: 4em;
        border-radius: 10px;
      }

      .pdf-quote-body {
        font-size: 14px;
      }

      .pdf-quote-body div {
        width: 18em;
        display: flex;
        justify-content: space-between;
        padding: 5px 0;
      }

      .pdf-value-to-pay {
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="pdf-container">
      <div class="pdf-data-row" id="pdf-data-row-img-container" style="background: #C7A766">
        <div class="pdf-head-content">
          <div class="-pdf-logo-header">
            <img src="${crediliderLogo}" alt="pdf-logo-header">
          </div>
          <div class="pdf-conten-head-text">
            <span>Cotizacion</span>
            <h1>${data.modelo}</h1>
          </div>
        </div>

        <div class="pdf-main-img">
          <img src="${formatedImage}" alt="pdf-main-img">
        </div>
      </div>

      <div class="pdf-data-row" id="pdf-quotes-row-container" style="background: #EBEBEB">
        <div class="pdf-data-row-container">
          ${quotes
            .map(
              (item, index) => `
                <div key="${index}" class="pdf-quote-data-row">
                  <div class="pdf-quote_data-head">
                    <div class="pdf-quote-number">
                      <span>0${index + 1}</span>
                    </div>
                    <div>
                      <h3>Cuota mensual</h3>
                      <span id="pdf-quote-value">$${item.monthlyFee.toLocaleString(
                        undefined,
                        { minimumFractionDigits: 0, maximumFractionDigits: 0 }
                      )}</span>
                      <span id="pdf-quote-month">${item.monthlyRate} Meses</span>
                    </div>
                  </div>
                  <div class="pdf-quote-body">
                    <div>
                      <span>Tasa efectiva anual</span>
                      <span>${item.annualEffectiveRate}%</span>
                    </div>
                    <div>
                      <span>Tasa mensual vencida</span>
                      <span>${item.monthlyCupDue}%</span>
                    </div>
                    <div>
                      <span>Seguro vida (mes)</span>
                      <span>$${item.monthLifeInsurance.toLocaleString()}</span>
                    </div>
                    <div class="pdf-value-to-pay">
                      <span>Valor a pagar</span>
                      <span>$${(
                        item.monthlyFee * item.monthlyRate
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}</span>
                    </div>
                  </div>
                </div>
              `
            )
            .join("")}
        </div>
      </div>
    </div>
  </body>
  </html>
  `;
}
