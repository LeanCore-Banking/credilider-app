'use client'

import { useEffect } from 'react';

declare global {
    interface Window {
        zE?: any;
        zESettings?: any;
    }
}

const ZendeskWidget = () => {
    useEffect(() => {
        // Verificar si el widget ya está cargado
        if (document.getElementById('ze-snippet')) {
            return;
        }

        // Limpiar cualquier instancia previa del widget
        if (window.zE) {
            window.zE('webWidget', 'hide');
            window.zE('webWidget', 'clear');
        }

        // Configuración actualizada del widget
        window.zESettings = {
            webWidget: {
                color: { theme: '#11ace8' }, // Color principal de tu app
                offset: {
                    horizontal: '20px',
                    vertical: '20px'
                },
                position: { horizontal: 'right', vertical: 'bottom' },
                locale: 'es', // El idioma se configura aquí directamente
                launcher: {
                    label: { '*': 'Ayuda' } // Texto del botón en español
                }
            }
        };

        // Cargar el script de Zendesk
        const script = document.createElement('script');
        script.id = 'ze-snippet';
        script.src = 'https://static.zdassets.com/ekr/snippet.js?key=0e961e39-bf9d-48be-ae7b-bfa9a4bbf1a6';
        script.async = true;
        
        document.head.appendChild(script);

        return () => {
            // Limpiar completamente el widget al desmontar
            if (window.zE) {
                window.zE('webWidget', 'hide');
                window.zE('webWidget', 'clear');
            }
            const existingScript = document.getElementById('ze-snippet');
            if (existingScript) {
                existingScript.remove();
            }
            // Limpiar cualquier iframe o elemento residual del widget
            const iframes = document.querySelectorAll('iframe[id^="webWidget"]');
            iframes.forEach(iframe => iframe.remove());
        };
    }, []); // Solo se ejecuta una vez al montar el componente

    return null;
};

export default ZendeskWidget; 