import express from 'express';
import { sequelize } from './sequelize';

import { IndexRouter } from './controllers/v0/index.router';

import bodyParser from 'body-parser';

import { V0_FEED_MODELS } from './controllers/v0/model.index';


import { config } from './config/config';

(async () => {

  console.log ('**process.env.POSTGRESS_USERNAME '+ process.env.POSTGRESS_USERNAME);
  console.log('**config -> ' + config.dev.database);

  await sequelize.addModels(V0_FEED_MODELS);  
  await sequelize.sync();

  const app = express();
  const port = process.env.PORT || 8080; // default port to listen
  
  app.use(bodyParser.json());

  //CORS Should be restricted
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8100");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });

  app.use('/api/v0/', IndexRouter)

  // Root URI call
  app.get( "/", async ( req, res ) => {
    res.send( "/api/v0/" );
  } );

  // Start the Server
  app.listen( port, () => {
      console.log( `FEEDS SERVICE: server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();