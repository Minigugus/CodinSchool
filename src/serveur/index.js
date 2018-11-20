/////////////////////////////////////////
// Crée et gère le serveur CodinSchool //
/////////////////////////////////////////

'use strict';

const express = require('express');
const graphqlHTTP = require('express-graphql');
const auth = require('./authentification.js');

const schema = require('./shema.js');

const app = express();

const PORT = process.env.PORT || (MODE_DEVELOPPEMENT ? 3000 : 80);

app.use('/graphql', auth, graphqlHTTP({
  schema,
  graphiql: MODE_DEVELOPPEMENT
}));

app.listen(PORT, () => console.info(`En écoute sur le port ${PORT}. http://localhost:${PORT}/graphql`));
