import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerUiOptions } from "swagger-ui-express";

const options : swaggerJSDoc.Options = {
    swaggerDefinition: {
        openapi: '3.0.2', //esto es un estándar (para documentar apis) que lo eliges tú. 2.0 es viejo, 3.1 aún no lo soporta todo el mundo
        tags: [
            {
                name: 'Products', //si tuviéramos de usuarios, u otras...  más objetos en el array
                description: 'API operations related to products'
            }
        ],
        info: {
            title: 'Rest API Node.js / Express / Typescript',
            version: "1.0.0", //es nuestra primera versión de nuestra api
            description: "API Docs for Products"
        }
    },
    apis: ['./src/router.ts'] //dónde están los endpoints a documentar.. Si hay diferentes rutas, en el array
    //la ruta... relativa desde el inicio del proyecto (la carpeta donde está package.json)
    //en esta o estas ubicaciones buscará los comentarios de swaggers y preparará el documento json. Puede ser router, o un archivo especifico para los comentarios de swagger

}

export const swaggerSpec = swaggerJSDoc(options);

// export const swaggerUiOption : SwaggerUiOptions = {
//     customCss: `
//         .topbar-wrapper .link {
//             content: url('https://codigoconjuan.com/wp-content/themes/cursosjuan/img/logo.svg');
//             height: 120px;
//             width:auto;
//         }
//     `
// }
export const swaggerUiOption : SwaggerUiOptions = {
    customCss: `
      /* 1. Ocultamos el logo original de Swagger (la imagen verde) */
        .topbar-wrapper .link *{
            visibility: hidden;
            width: 0;
        }

        /* 2. Insertamos el rombo en el contenedor del enlace */
        .topbar-wrapper .link::before {
            content: "\\25C6  Rombo Co."; /* Ahora con doble barra y punto y coma */
            color: #49cc90;    /* El verde original de Swagger o el que quieras */
            font-size: 40px;   /* Tamaño del rombo */
            font-weight: bold;
            visibillity: visible;    /* Para que respete márgenes y tamaños */
        }

        /* 3. Ajustamos el contenedor para que no limite el tamaño */
        .topbar-wrapper .link {
            height: auto;
            width: auto;
            text-decoration: none;
            display: flex;
            align-items: center;
        }
    `,
    customSiteTitle: 'Documentación REST API Express / Typescript'
}

