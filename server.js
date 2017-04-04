const express = require('express');
const app = express();
const cloudinary = require('cloudinary');
const multer  = require('multer');
const Datauri = require('datauri');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://mglcarmona:patito@ds149030.mlab.com:49030/heroku_ct64stzh');

const Photo = mongoose.model('Photo', {
  date: { type: Date, default: Date.now },
  url: String
});
const datauri = new Datauri();
cloudinary.config({
  cloud_name: 'mglcarmona',
  api_key: '974788693457241',
  api_secret: '2I7WkEOcAVXYhLuwEDYf-gb30SQ'
});
app.get('/get', function(req, res){
    Photo.find({}, 'url', {sort: {date: -1}}, (err, docs) => {
      res.json(docs)
    })
});
app.post('/upload', upload.single('avatar'), function(req, res){
  datauri.format('.jpg', req.file.buffer)
  cloudinary.v2.uploader.upload(datauri.content, function(err,image){
    if(err){
      console.log('ERROR: ' + err.message);      console.log('ERROR: ' + err.message);
    } else {
      const photo = new Photo({
        url: image.url
      });
      photo.save(err => {
        if (err) {
          console.log(err);
        } else {
          console.log('saved');
          res.send(image.url)
        }
      });
    }
  });
});
app.listen(process.env.PORT || 3000, () => console.log('Server started'));
