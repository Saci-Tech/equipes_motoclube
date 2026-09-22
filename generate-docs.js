const swaggerJSDoc = require('swagger-jsdoc');
const fs = require('fs');
const YAML = require('yamljs');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Clube',
      version: '1.0.0',
      description: 'Automatically generated API documentation',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  // Path to the API docs (where you write your route comments)
  apis: ['./src/routes/*.js'], 
};

console.log("Searching for docs in:", options.apis);


// Generate JSON spec
const swaggerSpec = swaggerJSDoc(options);

// Convert JSON to YAML string
const yamlString = YAML.stringify(swaggerSpec, 10);

// Save to root directory
fs.writeFileSync('./openapi/openapi.yaml', yamlString);
console.log('✅ openapi.yaml successfully generated!');
