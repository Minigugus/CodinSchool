/////////////////////////////////////////
// Crée et gère le serveur CodinSchool //
/////////////////////////////////////////

'use strict';

const cors = require('cors');
const express = require('express');
const graphqlHTTP = require('express-graphql');
const { MODE_DEVELOPPEMENT, PORT } = require('./config.js');

const schema = require('./shema.js');

const app = express();

app.use(cors());

app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: MODE_DEVELOPPEMENT
}));

app.listen(PORT, () => console.info(`En écoute sur le port ${PORT}. http://localhost:${PORT}/graphql`));
