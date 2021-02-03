var mysql = require('mysql');
var express = require('express');
var router = express.Router();

var con = require('./connection');

router.post("/patient",(req,res,next) => {
  console.log("Patient Login Credentals Received", req.body);
  try {
    const {patientId, Address, Age, contact, deptNo} = req.body;
    con.query("UPDATE rvpatient SET Address=? ,Age=? ,contact=? ,deptNo=? where patientId=?",[Address,Age,contact,deptNo,patientId],
     async (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.send(err);
      }

      try {
          console.log("Successful update");
          return res.send({ok: true,message:"Successfully updated!"});
      } catch (err) {
        console.log(err);
        return res.send(err);
      }
    });
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
})

router.post("/employee",(req,res,next) => {
  console.log("Employee Credentals Received", req.body);
  try {
    const {employeeId, Age, contact, qualification} = req.body;
    con.query("UPDATE employee SET qualification=? ,age=? ,contact=? where employeeID=?",[qualification, Age, contact,employeeId],
     async (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.send(err);
      }

      try {
          console.log("Successful update");
          return res.send({ok: true,message:"Successfully updated!"});
      } catch (err) {
        console.log(err);
        return res.send(err);
      }
    });
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
})

module.exports = router;