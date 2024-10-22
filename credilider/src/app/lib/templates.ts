
export const cotizacionPdfTemplate = (data: any) => {
    return (
    `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cotización PDF</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            },
            
            };
            .container {
                width: 80%;
                margin: auto;
                overflow: hidden;
            }
            header {
                background: #333;
                color: #fff;
                padding-top: 30px;
                min-height: 70px;
                border-bottom: #77aaff 3px solid;
            }
            header a {
                color: #fff;
                text-decoration: none;
                text-transform: uppercase;
                font-size: 16px;
            }
            #main {
                padding: 20px;
                background: #fff;
                margin-top: 20px;
            }
            footer {
                background: #333;
                color: #fff;
                text-align: center;
                padding: 10px;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <header>
            <div class="container">
                <h1>Cotización</h1>
            </div>
        </header>
        <div id="main" class="container">
            <h2>Detalles de la Cotización</h2>
            <p>${data.price}</p>
        </div>
        <footer>
            <p>Cotización PDF &copy; 2023</p>
        </footer>
    </body>
    </html>
    `
    )
}
