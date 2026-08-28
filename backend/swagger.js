require('dotenv').config();

const swaggerAutogen = require('swagger-autogen')();

const outputFile = './swagger-output.json';
const endpointsFiles = ['./index.js', './src/routes/admin/index.js', './src/routes/client/index.js'];

const doc = {
  info: {
    title: 'Mahreen Indonesia API',
    description:
      'Dokumentasi API backend Mahreen Indonesia (Express 5 + MySQL). ' +
      'Endpoint admin memerlukan JWT Bearer token; refresh token memakai HttpOnly cookie.',
    version: '1.0.0',
  },
  host: process.env.PORT ? `localhost:${process.env.PORT}` : 'localhost:3000',
  basePath: '/api/',
  schemes: ['http'],
  securityDefinitions: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Ketik token akses JWT Anda (Bearer <token>).',
    },
  },
  definitions: {
    SuccessEnvelope: {
      success: true,
      data: {},
    },
    ErrorEnvelope: {
      success: false,
      message: 'Deskripsi kesalahan.',
    },
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('swagger-output.json berhasil di-generate.');
});