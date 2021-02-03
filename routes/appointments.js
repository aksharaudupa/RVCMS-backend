var mysql = require('mysql');
var express = require('express');
var router = express.Router();

var con = require('./connection');
const app = require('../app');

router.post("/patient", (req, res, next) => {
    console.log("Patient Credentals Received", req.body);
    var isSent = false;
    var modifiedAppointments=[]
    try {
        con.query("select * from appointments where patientID=?", [[req.body.patientID]],
            (err, results, fields) => {
                if (err) {
                    console.log(err);
                    if (!isSent) {
                        res.send(err);
                        isSent = true;
                        return;
                    }
                }
                
                var appointments = results;
                results.forEach((result) => {
                    let timings = result.timings;
                    result.timings = new Date(timings).toLocaleDateString() + " " + new Date(timings).toLocaleTimeString();
                    con.query("select employeeName from employee where employeeID=?",[[result.employeeID]],
                    (err1,results1,fields1) => {
                        if(err1)
                        {
                            res.send(err1);
                            isSent=true;
                            return;
                        }
                        //console.log(results1[0].employeeName)
                        var empName = results1[0].employeeName;
                        var obj={...result, employeeName: empName }
                        //console.log(obj);
                        modifiedAppointments.push(obj);
                        result=obj;
                       // console.log("new:",result);
                    })
                }
                );
                console.log(results);
                //var appointments = results;
                //console.log("new:",appointments)
                if (!appointments) {
                    console.log("No appoinments found!");
                    if (!isSent) {
                        console.log(res);
                        res.send({ok: false,message:"No appoinments found!"});
                        isSent = true;
                        return;
                    }
                }

                try {
                    return res.send({ ok: true, message: "Appoinments Found", appointments: appointments });
                } catch (err) {
                    console.log(err);
                    if (!isSent) {
                        res.send(err);
                        isSent = true;
                        return;
                    }
                }
            })
    }
    catch (err) {
        if (!isSent) {
            res.send(err);
            isSent = true;
            return;
        }
    }
})

router.post("/employee", (req, res, next) => {
    console.log("Employee Credentals Received", req.body);
    try {
        con.query("select * from appointments where employeeID=?", [[req.body.employeeID]],
            (err, results, fields) => {
                if (err) {
                    console.log(err);
                    return res.send(err);
                }
                var appointments = results.forEach((result) => {
                    let timings = result.timings;
                    result.timings = new Date(timings).toLocaleDateString() + " " + new Date(timings).toLocaleTimeString();
                }
                );
                var appointments = results;
                if (!appointments) {
                    console.log("No appoinments found!");
                    return res.send("No appoinments found!");
                }

                try {
                    return res.send({ ok: true, message: "Appoinments Found", appointments: appointments });
                } catch (err) {
                    console.log(err);
                    return res.send(err);
                }
            })
    }
    catch (err) {
        console.log(err);
        return res.send(err);
    }
})

router.post("/cancel", (req, res, next) => {
    console.log("Appointment Credentals Received", req.body);
    try {
        con.query("delete from appointments where appointmentID=?", [[req.body.appointmentID]],
            (err, results, fields) => {
                if (err) {
                    console.log(err);
                    return res.send(err);
                }
                try {
                    return res.send({ ok: true, message: "Appoinment Cancelled"});
                } catch (err) {
                    console.log(err);
                    return res.send(err);
                }
            })
    }
    catch (err) {
        console.log(err);
        return res.send(err);
    }
})

router.get("/doctors", (req, res, next) => {
    console.log("Request Received");
    try {
        con.query("select employeeID,employeeName from employee where employee_type=\'Doctor\'",
            (err, results, fields) => {
                if (err) {
                    console.log(err);
                    return res.send(err);
                }
                var doctors = results;

                if (!doctors) {
                    console.log("Doctors not found!");
                    return res.send({ ok: false, message: "No appoinments found!" });
                }

                try {
                    return res.send({ ok: true, message: "Doctors Found", doctors: doctors });
                } catch (err) {
                    console.log(err);
                    return res.send(err);
                }
            })
    }
    catch (err) {
        console.log(err);
        return res.send(err);
    }
})

router.post("/get", (req, res, next) => {
    console.log("Patient Credentals Received", req.body);
    var isSent = false;
    try {
        con.query("select * from appointments where employeeID=?", [[req.body.employeeID]],
            (err, results, fields) => {
                if (err) {
                    console.log(err);
                    res.send(err);
                    isSent = true;
                    return;
                }
                var appointments = results.find((result) =>
                    result.timings === req.body.timings
                );
                console.log(appointments);
                if (appointments === undefined) {
                    console.log("No appoinments found!");
                    con.query("insert into appointments (timings, patientID, employeeID) values?", [[[req.body.timings, req.body.patientID, req.body.employeeID]]],
                        (err1, results1, fields1) => {
                            if (err1) {
                                console.log(err1);
                                if (!isSent) {
                                    res.send(err1);
                                    isSent = true;
                                    return;
                                }
                            }
                            try {
                                if (!isSent) {
                                    res.send({ ok: true, message: "Appoinment Found" });
                                    isSent = true;
                                    return;
                                }
                            }
                            catch (err2) {
                                if (!isSent) {
                                    console.log(err2);
                                    res.send(err2);
                                    isSent = true;
                                    return;
                                }
                            }
                        })
                }
                if (appointments) {
                    try {
                        if (!isSent) {
                            res.send({ ok: false, message: "Appoinment Not Found! Please try a different time slot!" });
                            isSent = true;
                            return;
                        }
                    } catch (err) {
                        if (!isSent) {
                            console.log(err);
                            res.send(err);
                            isSent = true;
                            return;
                        }
                    }
                }
            })
    }
    catch (err) {
        //console.log(err);
        if (!isSent) {
            console.log(err);
            res.send(err);
            isSent = true;
            return;
        }
    }
})

module.exports = router;