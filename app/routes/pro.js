var express = require('express');
var router = express.Router();
var fs = require('fs');


var agentModel = require('../models/agentModel.js')
var adModel = require('../models/adModel.js')



// var request = require('sync-request');
var uid2 = require("uid2");

// var userModel = require('../models/users');

// var bcrypt = require('bcrypt');
// const saltRounds = 10;

let status;
let response;

/* PRO sign-in */
router.post('/sign-in', async function(req, res, next) {

  if(req.body.email == '' || req.body.password == '') {

    res.json({
      state: false, 
      message: 'Vérifiez les informations saisies'
    });

  } else {

    let findAgent = await agentModel.findOne({ email:req.body.email });

    if(findAgent == null) {

      res.json({
        state: false, 
        message: 'Erreur d\'authentification'
      }); 

    } else {

      if (req.body.password === findAgent.password) {
        console.log(findAgent.email + ' : Mot de passe correct')
        res.json({
          state: true, 
          message: 'Authentification réussie',
          token: findAgent.token
        }); 
      } else {
        console.log(findAgent.email + ' : Mauvais mot de passe')
        res.json({
          state: false, 
          message: 'Erreur d\'authentification'
        }); 
      }
      
    }

  }
  
});

/* PRO sign-up */
router.post('/sign-up', async function(req, res, next) {

  let newAgent = new agentModel ({
    token: uid2(32),
    creationDate: req.body.creationDate,
    admin: req.body.admin,
    lastname: req.body.lastname,
    firstname: req.body.firstname,
    email: req.body.email,
    password: req.body.password,
    ads: req.body.ads
  });

  let agent = await newAgent.save();

  console.log(agent);

  res.json(agent);
});


/* POST ad */
router.post('/ad', async function(req, res, next) {

  try {
    
    let parseTimeslots = JSON.parse(req.body.timeSlots);
    let findAgent = await agentModel.findOne({ token:req.body.token });

    let tempAd = new adModel ({
      creationDate: new Date,
      color: req.body.color,
      onlineStatus: false,
      offerStatus: false,
      visitStatus: false,
      price: req.body.price,
      fees: req.body.fees,
      type: req.body.type,
      title: req.body.title,
      description: req.body.description,
      typeAddress: req.body.typeAddress,
      address: req.body.address,
      postcode: req.body.postcode,
      city: req.body.city,
      photos: req.body.photos,
      video: req.body.video,
      area: req.body.area,
      rooms: req.body.rooms,
      bedrooms: req.body.bedrooms,
      elevator: req.body.elevator,
      terrace: req.body.terrace,
      balcony: req.body.balcony,
      options: req.body.options,
      dpe: req.body.dpe,
      ges: req.body.ges,
      files: req.body.files,
      timeSlots: parseTimeslots
    });

    let newAd = await tempAd.save();

    let adToAgent = await agentModel.updateOne(
      { _id: findAgent._id }, 
      { $push: { ads : newAd._id } }
    )

    status = 200;
    response = {
      message: 'OK',
      data: newAd
    }

  } catch(e) {
    status = 500;
    response = {
      message: 'Internal error',
      details: 'Le serveur a rencontré une erreur.'
    };
  }

  res.status(status).json(response);

});

/* UPDATE ad */
router.put('/ad/:id', async function(req, res, next) {

  try {
    let parseTimeslots = JSON.parse(req.body.timeSlots);

    let updateAd = await adModel.updateOne(
      { _id: req.params.id }, 
      { 
        color: req.body.color,
        price: req.body.price,
        fees: req.body.fees,
        type: req.body.type,
        title: req.body.title,
        description: req.body.description,
        address: req.body.address,
        postcode: req.body.postcode,
        city: req.body.city,
        photos: req.body.photos,
        video: req.body.video,
        area: req.body.area,
        rooms: req.body.rooms,
        bedrooms: req.body.bedrooms,
        elevator: req.body.elevator,
        terrace: req.body.terrace,
        balcony: req.body.balcony,
        options: req.body.options,
        dpe: req.body.dpe,
        ges: req.body.ges,
        files: req.body.files,
        timeSlots: parseTimeslots
      }
    );
    
    status = 200;
    response = {
      message: 'OK',
      data: updateAd
    }

  } catch(e) {
    status = 500;
    response = {
      message: 'Internal error',
      details: 'Le serveur a rencontré une erreur.'
    };
  }

  res.status(status).json(response);

});

/* DELETE ad onlineStatus */
router.delete('/ad/:id', async function(req, res, next) {

  try {
    let findAgent = await agentModel.findOne({ token:req.body.token });

    if(findAgent.length === 0) { 
      status = 401;
      response = {
        message: 'Bad token',
        details: 'Erreur d\'authentification. Redirection vers la page de connexion...'
      };
    } else {
      let deleteAd = await adModel.deleteOne({ _id: req.params.id });

      status = 200;
      response = {
        message: 'OK',
        data: deleteAd
      }
    };

  } catch(e) {
    status = 500;
    response = {
      message: 'Internal error',
      details: 'Le serveur a rencontré une erreur.'
    };
  }

  res.status(status).json(response);

});


/* UPDATE ad onlineStatus */
router.put('/ad/online/:id', async function(req, res, next) {

  try {
    let updateAd = await adModel.updateOne(
      { _id: req.params.id }, 
      { 
        onlineStatus: req.body.onlineStatus,
        onlineDate: new Date
      }
    );
    
    status = 200;
    response = {
      message: 'OK',
      data: updateAd
    }

  } catch(e) {
    status = 500;
    response = {
      message: 'Internal error',
      details: 'Le serveur a rencontré une erreur.'
    };
  }

  res.status(status).json(response);

});

/* POST timeslot */
router.put('/timeslot', async function(req, res, next) {

  try {

    let findAgent = await agentModel.findOne({ token:req.body.token });
    let timeslot = {
      booked: false,
      agent: findAgent._id,
      start: req.body.start,
      end: req.body.end
    }
    let newTimeslot = await adModel.updateOne(
        { _id: req.body.id }, 
        { $push: { timeSlots: timeslot }, visitStatus: true }
    );

    console.log(newTimeslot)

    if(!newTimeslot) { 
      status = 401;
      response = {
        message: 'Bad token',
        details: 'Erreur d\'authentification. Redirection vers la page de connexion...'
      };
    } else {
      status = 200;
      response = {
        message: 'OK',
        data: newTimeslot
      }
    };

  } catch(e) {
    status = 500;
    response = {
      message: 'Internal error',
      details: 'Le serveur a rencontré une erreur.'
    };
  }

  res.status(status).json(response);

});

/* GET timeslots */
router.get('/timeslots', async function(req, res, next) {

  try {

    let findAgent = await agentModel.findOne({ token:req.query.token });
    let timeslotsFromAgent = await adModel.aggregate([
      { $unwind: "$timeSlots" },
      { $match: { 'timeSlots.agent' : findAgent._id } }
    ]).exec();

    console.log(timeslotsFromAgent)

    if(!timeslotsFromAgent) { 
      status = 401;
      response = {
        message: 'Bad token',
        details: 'Erreur d\'authentification. Redirection vers la page de connexion...'
      };
    } else {
      status = 200;
      response = {
        message: 'OK',
        data: timeslotsFromAgent
      }
    };

  } catch(e) {
    status = 500;
    response = {
      message: 'Internal error',
      details: 'Le serveur a rencontré une erreur.'
    };
  }

  res.status(status).json(response);

});


/* GET PRO ads */
router.get('/ads', async function(req, res, next) {

  try {
    let adsFromAgent = await agentModel.findOne({ token:req.query.token }) // authenticate user and return his ads
      .populate('ads')
      .exec()
    ;
    if(!adsFromAgent) { 
      status = 401;
      response = {
        message: 'Bad token',
        details: 'Erreur d\'authentification. Redirection vers la page de connexion...'
      };
    } else {
      status = 200;
      response = {
        message: 'OK',
        data: adsFromAgent
      }
    };
  } catch(e) {
    status = 500;
    response = {
      message: 'Internal error',
      details: 'Le serveur a rencontré une erreur.'
    };
  }

  res.status(status).json(response);

});

// GET Ad offers
router.get('/ad/offers', async function(req, res, next) {

  try {
    let findAgent = await agentModel.find({token : req.query.token}); // authenticate user

    if(findAgent.length === 0) { 
      status = 401;
      response = {
        message: 'Bad token',
        details: 'Erreur d\'authentification. Redirection vers la page de connexion...'
      };
    } else {
      let offersFromAd = await adModel
        .findOne({_id : req.query.ad})
        .populate('offers.offer')
        .exec()
      ; // search ad and return its offers

      status = 200;
      response = {
        message: 'OK',
        data: offersFromAd.offers
      }
    };
  } catch(e) {
    status = 500;
    response = {
      message: 'Internal error',
      details: 'Le serveur a rencontré une erreur.'
    };
  }

  res.status(status).json(response);
  
});

/* PUT offer */
router.put('/offer/:id', async function(req, res, next) {

  try {
    let findAgent = await agentModel.findOne({ token:req.body.token });

    if(findAgent.length === 0) { 
      status = 401;
      response = {
        message: 'Bad token',
        details: 'Erreur d\'authentification. Redirection vers la page de connexion...'
      };
    } else {
      let updateOffer = await adModel.updateOne(
        { _id: req.body.ad, "offers._id": req.params.id  }, 
        { "offers.$.status": req.body.status }
      );

      status = 200;
      response = {
        message: 'OK',
        data: updateOffer
      }
    };

  } catch(e) {
    status = 500;
    response = {
      message: 'Internal error',
      details: 'Le serveur a rencontré une erreur.'
    };
  }

  res.status(status).json(response);

});

// GET Ad details
router.get('/ad/:id', async function(req, res, next) {

  try {
    let findAgent = await agentModel.find({token : req.query.token}); // authenticate user

    if(findAgent.length === 0) { 
      status = 401;
      response = {
        message: 'Bad token',
        details: 'Erreur d\'authentification. Redirection vers la page de connexion...'
      };
    } else {
      let adForDetails = await adModel.findById(req.params.id); // Trouver les détails de l'annonce
      status = 200;
      response = {
        message: 'OK',
        data: adForDetails
      }
    };
  } catch(e) {
    status = 500;
    response = {
      message: 'Internal error',
      details: 'Le serveur a rencontré une erreur.'
    };
  }

  res.status(status).json(response);

});

// POST Upload images in form 
router.post('/upload', async function(req, res, next) {

  console.log("token", req.body)
  console.log("fichier", req.files)
  
  var resultCopy = await req.files.file.mv(`./temp/${req.body.id}-${req.files.file.name}`);
  
  if(!resultCopy) {
    res.json({result: true, name: req.files.file.name, message: `${req.files.file.name} uploaded!`} );       
  } else {
    res.json({result: false, name: req.files.file.name, message: `couldn't upload ${req.files.file.name}`} );
  } 

});

router.delete('/upload', async function(req, res, next) {

  console.log(req.files)

  res.json("deleted")

});


module.exports = router;
