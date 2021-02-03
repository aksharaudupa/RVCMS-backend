var mysql = require('mysql');
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

var con = require('./connection');

var rs;



router.post("/", (req, res, err) => {
  console.log(req.body);
  res.send(rs).status(200);
})

router.post("/patient", async (req, res, next) => {
  console.log(req.body);
  // if(err){
  //   console.log(err);
  //   res.send("Error").status(400);
  //   return;
  // }
  const { email, password, name, patientId, counselorId, date, age, phNo, address, deptNo } = req.body;

  try {
    var salt = await bcrypt.genSalt();
    var hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
  } catch (err) {
    res.send(err);
    return;
    //isResponseSent = true;
  }
  //if(counselorId === '') counselorId=patientId;
  try {
    con.query("insert into rvpatient values?", [[[patientId, name, age, email, phNo, date, address, counselorId, deptNo, hashedPassword]]],
    (err, results, fields) => {
      if(!err){
      console.log("Query success, added to rvpatient");
      res.send("Patient Added").status(200);
      return;
      }
      else{
        console.log(err);
        res.send(err.sqlMessage).status(err.errno);
        return;
      }
    })
  }
  catch(err)
  {
    console.log(err);
    res.send(err.message);
    return;
  }
})

router.post("/employee", async (req, res, next) => {
  console.log(req.body);
  // if(err){
  //   console.log(err);
  //   res.send("Error").status(400);
  //   return;
  // }
  const { email, password, name, employeeId, age, phNo, role, qualification } = req.body;

  try {
    var salt = await bcrypt.genSalt();
    var hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
  } catch (err) {
    res.send(err);
    return;
    //isResponseSent = true;
  }
  //if(counselorId === '') counselorId=patientId;
  try {
    con.query("insert into employee values?", [[[employeeId, name, age, email, phNo, qualification, role, hashedPassword]]],
    (err, results, fields) => {
      if(!err){
      console.log("Query success, added to employee");
      res.send("Employee Added").status(200);
      return;
      }
      else{
        console.log(err);
        res.send(err.sqlMessage).status(err.errno);
        return;
      }
    })
  }
  catch(err)
  {
    console.log(err);
    res.send(err.message);
    return;
  }
})

module.exports = router;
  // con.query("CREATE database rvcms",(err,res)=>
  // {
  //   if(err) throw(err);
  //   con.query("use rvcms",(err,res)=>
  //   {
  //     if(err) throw(err);
  //     console.log(res);
  //   })
  // })