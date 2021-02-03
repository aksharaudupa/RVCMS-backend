var mysql = require('mysql');
var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');

var con = require('./connection');

router.post("/patient",(req, res, next) => {
    console.log("Patient Login Credentals Received", req.body);

  try {
    con.query("SELECT * FROM rvpatient", async (err, results, fields) => {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      var user = results.find((result) =>
        result.patientId === req.body.patientId
      );

      if (!user) {
        console.log("User doesn't exist");
        return res.send("User doesn't exist");
      }

      try {
        if (await bcrypt.compare(req.body.password, user.password)) {
          console.log("Successful login");
          return res.send({ok: true,message:"Successful login", userData: user});
        } else {
          console.log("Incorrect password");
          return res.send("Incorrect password");
        }
      } catch (err) {
        console.log(err);
        return res.send(err);
      }
    });
  } catch (err) {
    console.log(err);
    return res.send(err);
  }
});

router.post("/employee",(req, res, next) => {
  console.log("Employee Login Credentals Received", req.body);

try {
  con.query("SELECT * FROM employee", async (err, results, fields) => {
    if (err) {
      console.log(err);
      return res.send(err);
    }
    var user = results.find((result) =>
      result.employeeID === req.body.employeeId
    );

    if (!user) {
      console.log("User doesn't exist");
      return res.send({ok: false,message:"User doesn't exist", userData: null});
    }

    try {
      if (await bcrypt.compare(req.body.password, user.password)) {
        console.log("Successful login");
        return res.send({ok: true,message:"Successful login", userData: user});
      } else {
        console.log("Incorrect password");
        return res.send("Incorrect password");
      }
    } catch (err) {
      console.log(err);
      return res.send(err);
    }
  });
} catch (err) {
  console.log(err);
  return res.send(err);
}
});

module.exports=router;