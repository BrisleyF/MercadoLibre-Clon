const swaggerJsdocs = require('swagger-jsdoc');

// api consfig info
const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Documentacion API de Mercado Libre",
        version: "1.0.0",
    },
    servers: [
        {
            url: "http://localhost:3000"
        }
    ],
    components: {
        securitySchemes:{
            bearerAuth:{
                type:"http",
                scheme:"bearer"
            }
        },
        schemas: {
            User: {
                type: "object",
                required: ["nombre", "email", "clave"],
                properties: {
                    nombre: {
                        type: "string",
                        example: "Alfonzo"
                    },
                    email: {
                        type: "string",
                        example: "alfonzo@gmail.com"
                    },
                    clave: {
                        type: "string",
                        example: "12alfonzo34"
                    }
                }
            },
            inicioSession: {
                type: "object",
                required: ["email", "clave"],
                properties: {
                    email: {
                        type: "string",
                        example: "alfonzo@gmail.com"
                    },
                    clave: {
                        type: "string",
                        example: "12alfonzo34"
                    }
                }
            },
            Producto: {
                type: "object",
                required: [],
                properties: {
                    _id: {
                        type: "string",
                        example: "114tr674ds84"
                    },
                    name: {
                        type: "string",
                        example: "Bicicleta"
                    },
                    img: {
                        type: "string",
                        example: "https://mlstatic.com/D_NQ_NP_948546-O.webp"
                    },
                    price: {
                        type: "number",
                        example: "200"
                    },
                    marca: {
                        type: "string",
                        example: "fuji"
                    },
                    modelo: {
                        type: "string",
                        example: "ROOKIE 20 GIRL"
                    },
                    tamaño: {
                        type: "string",
                        example: "20 pulgadas"
                    },
                    genero: {
                        type: "string",
                        example: "mujer"
                    },
                    condicion: {
                        type: "string",
                        example: "nuevo"
                    },
                    tipoDePublicacion: {
                        type: "string",
                        example: "gratuita"
                    },
                    garantia: {
                        type: "string",
                        example: "sin garantia"
                    },
                    idUsuario: {
                        type: "string",
                        example: "134dc56gd67"
                    }
                }
            },
            Productos: {
                type: "object",
                properties: {
                    productos: {
                        type: "array",
                        items: {
                            type: "object",
                            "$ref": '#/components/schemas/Producto' 
                        }
                    }   
                }
                
            },
            Orden: {
                type: "object",
                required: ["idProducto", "cantidad", "total", "direccion", "paquete", "metodoDePago", "idUsuario"],
                properties: {
                    idProducto: {
                        type: "string",
                        example: "34fs567ca23ha"
                    },
                    cantidad: {
                        type: "number",
                        example: "2"
                    },
                    total: {
                        type: "number",
                        example: "400"
                    },
                    direccion: {
                        type: "string",
                        example: "venezuela"
                    },
                    paquete: {
                        type: "string",
                        example: "domicilio"
                    },
                    metodoDePago: {
                        type: "string",
                        example: "visa"
                    },
                    idUsuario: {
                        type: "string",
                        example: "145sa47bf87v"
                    }
                }
        }
        }
    }
};


// opciones
const option = {
    swaggerDefinition,
    apis: [
        "./routes/*js"
    ]
};

const openApiConfigration = swaggerJsdocs(option);

module.exports = openApiConfigration;