var mysql = require('mysql');
var express = require('express');
var router = express.Router();

var con = require('./connection');

router.post("/newpat", async (req, res, next) => {
    console.log(req.body);
    // if(err){
    //   console.log(err);
    //   res.send("Error").status(400);
    //   return;
    // }
    const { bedno, patientID, employeeID, medication, fromTime } = req.body;
    try {
      con.query("update beds set fromtime=?, medication=?, patientID=?, employeeID=? where bedno=?", [ fromTime, medication,patientID,employeeID,bedno],
      (err, results, fields) => {
        if(!err){
        console.log("Query success, added to beds");
        res.send({ok:true,message:"Patient Admitted"}).status(200);
        return;
        }
        else{
          console.log(err);
          res.send({ok:true,message:err.sqlMessage}).status(err.errno);
          return;
        }
      })
    }
    catch(err)
    {
      console.log(err);
      res.send({ok:true,message:err.message});
      return;
    }
  })

  router.post("/discharge", async (req, res, next) => {
    console.log(req.body);
    // if(err){
    //   console.log(err);
    //   res.send("Error").status(400);
    //   return;
    // }
    const { bedno, toTime } = req.body;
    try {
      con.query("update beds set totime=? where bedno=?", [toTime, bedno],
      (err, results, fields) => {
        if(!err){
        console.log("Query success, totime updated in beds");
        res.send({ok:true,message:"Patient Discharged"}).status(200);
        return;
        }
        else{
          console.log(err);
          res.send({ok:true,message:err.sqlMessage}).status(err.errno);
          return;
        }
      })
    }
    catch(err)
    {
      console.log(err);
      res.send({ok:true,message:err.message});
      return;
    }
  })  

  router.get("/emptyget", async (req, res, next) => {
    console.log(req.body);
    // if(err){
    //   console.log(err);
    //   res.send("Error").status(400);
    //   return;
    // }
    //const { bedno, patientId, employeeId, toTime } = req.body;
    try {
      con.query("select bedno from beds where patientID is null or totime is not null",
      (err, results, fields) => {
        if(!err){
        console.log("Query success, got empty beds");
        res.send({ok:true,message:"Empty beds", beds:results}).status(200);
        return;
        }
        else{
          console.log(err);
          res.send({ok:true,message:err.sqlMessage}).status(err.errno);
          return;
        }
      })
    }
    catch(err)
    {
      console.log(err);
      res.send({ok:true,message:err.message});
      return;
    }
  })

  router.get("/occget", async (req, res, next) => {
    console.log(req.body);
    // if(err){
    //   console.log(err);
    //   res.send("Error").status(400);
    //   return;
    // }
    //const { bedno, patientId, employeeId, toTime } = req.body;
    try {
      con.query("select * from beds where patientID is not null",
      (err, results, fields) => {
        if(!err){
        console.log("Query success, got occupied beds");
        res.send({ok:true,message:"Occupied beds", beds:results}).status(200);
        return;
        }
        else{
          console.log(err);
          res.send({ok:true,message:err.sqlMessage}).status(err.errno);
          return;
        }
      })
    }
    catch(err)
    {
      console.log(err);
      res.send({ok:true,message:err.message});
      return;
    }
  })

  router.get("/getpat", async (req, res, next) => {
    console.log(req.body);
    // if(err){
    //   console.log(err);
    //   res.send("Error").status(400);
    //   return;
    // }
    //const { bedno, patientId, employeeId, toTime } = req.body;
    try {
      con.query("select patientId,name from rvpatient",
      (err, results, fields) => {
        if(!err){
        console.log("Query success, got patients");
        res.send({ok:true,message:"Occupied beds", patients:results}).status(200);
        return;
        }
        else{
          console.log(err);
          res.send({ok:true,message:err.sqlMessage}).status(err.errno);
          return;
        }
      })
    }
    catch(err)
    {
      console.log(err);
      res.send({ok:true,message:err.message});
      return;
    }
  })

  module.exports = router;