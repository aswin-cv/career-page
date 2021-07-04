const multer = require('multer');                 //file
const GridFs = require("multer-gridfs-storage");
const Grid = require('gridfs-stream');
// const uuid = require('uuid').v4;                  //generate unique I'ds
const crypto = require("crypto");
const mongoose =  require('mongoose');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();
// const emailValidator = require('deep-email-validator-extended');

 



const express = require('express');
const route = express.Router();
const User = require('./models/User');
const mongoURI = "";



var filename;
const conn = mongoose.createConnection(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });
  
  let gfs;
  conn.once('open', ()=> {
    gfs = Grid(conn.db,mongoose.mongo);
    gfs.collection('user');
    
    });
    
    //create file storage
    const storage = new GridFs({
    url:mongoURI,
    file:(req,file) =>{
       return new Promise((resolve,reject) =>{
       crypto.randomBytes(4, (err, buf)=>{
      if(err) {
          return reject(err);
      }
      //const filename = buf.toString('hex') + path.extname(file.originalname);
      filename = `${buf.toString('hex')}_${file.originalname}`;
      // gfs = new mongoose.mongo.GridFSBucket(conn.db, {bucketName: 'user'});
      const fileinfo = {
          filename: `${filename}`,
          bucketName:'user'
           };
           resolve(fileinfo);
         });
       });
      }
    });
    const upload = multer({ storage} );
  
route.post('/',upload.single('file'), async (req, res) => {
  console.log(req.body);
  let messy ="";
  let Name = sentiment.analyze(req.body.name).score;
  // let Email = (req.body.email);
  let Location = sentiment.analyze(req.body.location).score;
  let College = sentiment.analyze(req.body.college).score;
  //let Skills = sentiment.analyze(req.body.skill).score;
  // async function isEmailValid(email) {
  //   return emailValidator.validate(email)
  //  }
  let sentCheck = []
  if(Name<0){
    sentCheck.push('Name');
  }
  if(Location<0){
    sentCheck.push('Location');
  }
  if(College<0){
    sentCheck.push('College/Company');
  }
  // //if(Skills<0){
  //   sentCheck.push('Skills');
  // }
      
  for (const senErr of sentCheck) {
    messy = messy +"Invalid field entry "+ senErr + ".        ";
  }
  console.log(messy)
      
  
  // const validMail = await isEmailValid(Email);
  // console.log(validMail.valid)
  // if (!validMail.valid){
  //   messy = messy + `Please provide a valid email address.        `;
  //   return res.status(400).render('invalid',{err: `${messy}`})

  // }else 
  if(sentCheck.length==0){

      // // console.log(storage);
      const users = new User({
        name: req.body.name,
        email: req.body.email,
        mobile: req.body.mobile,
        location: req.body.location,
        degree: req.body.degree,
        department: req.body.department,
        sslc: req.body.sslc,
        hsc: req.body.hsc,
        ug: req.body.ug,
        pg: req.body.pg,
        years: req.body.years,
        exp: req.body.exp,
        skills: req.body.skills,
        jobprofile: req.body.jobprofile,
        college: req.body.college,
        about: req.body.about,
        resume: `https://career-vms.herokuapp.com/file/${filename}`,
        portfolio: req.body.portfolio,
        });
      users.save()
        .then(result => {
          console.log("Data saved");
          res.redirect('/success');
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      return res.status(400).render('invalid',{err: `${messy}`})
    }
});

const { requireAuth} = require('./authMiddleware');

route.get('/file/:fileName',requireAuth, (req,res) =>{
  gfs.files.findOne({filename: req.params.fileName}, (err, file) =>{
      if(!file || file.length === 0) {
        // console.log(err);
        // console.log(file);
          return res.status(404).render('404',{ err: `file ${req.params.fileName} not found` });
          // json({
          // err: `file ${req.paramas.filename}`
          // }).sendFile(__dirname + '/404.ejs',, { root: __dirname });;
      }
      else{
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      }
    });
});
  
  
  module.exports = route;  


