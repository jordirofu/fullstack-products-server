import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerUiOptions } from "swagger-ui-express";

const options : swaggerJSDoc.Options = {
    swaggerDefinition: {
        openapi: '3.0.2', 
                tags: [
            {
                name: 'Products',
                description: 'API operations related to products'
            }
        ],
        info: {
            title: 'Rest API Node.js / Express / Typescript',
            version: "1.0.0", 
            description: "API Docs for Products"
        }
    },
    apis: ['./src/router.ts'] 
}

export const swaggerSpec = swaggerJSDoc(options);

export const swaggerUiOption : SwaggerUiOptions = {
    customCss: `
            .topbar-wrapper .link *{
            visibility: hidden;
            width: 0;
        }

        .topbar-wrapper .link::before {
            content: "\\25C6  Rombo Co."; /* Ahora con doble barra y punto y coma */
            color: #49cc90;    /* El verde original de Swagger o el que quieras */
            font-size: 40px;   /* Tamaño del rombo */
            font-weight: bold;
            visibillity: visible;    /* Para que respete márgenes y tamaños */
        }

        .topbar-wrapper .link {
            height: auto;
            width: auto;
            text-decoration: none;
            display: flex;
            align-items: center;
        }
    `,
    customSiteTitle: 'Documentation REST API'
}

