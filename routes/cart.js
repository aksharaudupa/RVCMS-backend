var mysql = require('mysql');
var express = require('express');
var router = express.Router();

var con = require('./connection');

router.post("/add", (req, res, next) => {
  console.log("Medicine name Received", req.body);
  let isSent = false;
  var total = 0;
  try {
    let date = new Date();
    //date=date.toDateString();
    //date.replace(" ","T");
    //date=date+"Z";
    console.log("Date:", date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
    con.query("insert into bills (patientID, timeDate) values ?", [[[req.body.patientID, date]]],
       (err, results, fields) => {    //Nachiket
        if (err) {
          console.log(err);
          if(!isSent){

            res.send(err);
            isSent=true;
            return;
          }
        }

        let datestr = date.getFullYear() + "-" + ((date.getMonth() + 1)<10?"0"+(date.getMonth()+1):(date.getMonth()+1)) + "-" + ((date.getDate())<10?"0"+(date.getDate()):(date.getDate())) + " " + date.getHours() + ":" + ((date.getMinutes())<10?"0"+(date.getMinutes()):(date.getMinutes())) + ":" + ((date.getSeconds() + 1)<10?"0"+(date.getSeconds()+1):(date.getSeconds()));
        console.log("datestr:"+datestr);
        try {
          con.query("select cartNo from bills where patientID=? order by cartNo desc limit 1", [[req.body.patientID]],
            (err1, results1, fields1) => {
              if (err1) {
                console.log(err1);
                res.send(err1);
                isSent = true;
                return;
              }
              console.log("results 1:", results1);
              if (results1.length === 0 && !isSent) {
                console.log("Cart not found!");
                res.send({ ok: false, message: "cart not found" })
                isSent = true;
                return;
              }
              console.log("Cart no:", results1[0].cartNo)
              try {
                for (let i = 0; i < req.body.medicines.length; i++) {
                  console.log("line 45");
                  con.query("select itemID,itemName,price,quantity from supplies where itemName=?", [[[req.body.medicines[i]]]],
                    (err2, results2, fields2) => {
                      if (err2) {
                        console.log(err2);
                        //res.send({ok: false, message: "cart not found"})
                        return;
                      }
                      if (results1.length === 0 && !isSent) {
                        console.log("Sorry we don't have ", req.body.medicines[i]);
                        res.send({ ok: false, message: "Sorry we don't have " + req.body.medicines[i] })
                        isSent = true;
                        return;
                      }
                      if (results2[0].quantity < req.body.quantity[i] && !isSent) {
                        console.log("Sorry we don't have enough ", req.body.medicines[i], ";Out of stock!");
                        res.send({ ok: false, message: "Sorry we don't have enough" + req.body.medicines[i] + ";Out of stock!" })
                        isSent = true;
                        return;
                      }
                      try {
                        con.query("insert into cart_items values?", [[[results1[0].cartNo, results2[0].itemID, req.body.quantity[i]]]],
                          (err3, results3, fields3) => {
                            if (err3) {
                              console.log(err3);
                              //res.send({ok: false, message: "cart not found"})
                              return;
                            }
                            total = total + (results2[0].price * req.body.quantity[i]);
                            console.log("total:", total);
                          })
                      }
                      catch (e) {
                        console.log(e);
                        if (!isSent) {
                          res.send(e);
                          isSent = true;
                          return;
                        }
                      }
                    })
                }
                console.log("87");
                setTimeout(() => {
                  try {
                    console.log("89")
                    console.log("final total:", total)
                    con.query("update bills set billNo=?, amount=? where cartNo=?", [results1[0].cartNo + 1000, total, results1[0].cartNo],
                      (err3, results3, fields3) => {
                        if (err3) {
                          console.log(err3);
                          res.send({ ok: false, message: "error occured" })
                          isSent = true;
                          return;
                        }
                        try {
                          if (!isSent) {
                            console.log("Bill generated!\nBillNo:" + results1[0].cartNo + 1000 + "\nAmount:" + total + "\nCartNo:" + results1[0].cartNo)
                            res.send({ ok: true, message: "Bill generated!\nBillNo:" + (results1[0].cartNo + 1000) + "\nAmount:" + total + "\nCartNo:" + results1[0].cartNo, cartNo: results1[0].cartNo, amount: total, billNo: results1[0].cartNo + 1000 })
                            isSent = true;
                            return;
                          }
                        }
                        catch (e2) {
                          console.log(e2);
                          if (!isSent) {
                            res.send(e2);
                            isSent = true;
                            return;
                          }
                        }
                      })
                  } catch (e) {
                    console.log(e);
                    if (!isSent) {
                      res.send(e);
                      isSent = true;
                      return;
                    }
                  }
                }, 1000)
              } catch (err) {
                console.log(err);
                return res.send(err);
              }
            })
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

router.post("/bills",(req,res,next) =>{
  console.log("body Received", req.body);
  try{
    con.query("select * from bills where patientID=?",[[req.body.patientID]],
    (err,results,fields) => {
      if(err){
        console.log(err);
        return res.send(err);
      }
      var bills = results
      console.log("bills:",bills)
      console.log("results:",results)
      if(results.length>0)
      {
        return res.send({ok:true, message:"bills found", bills:bills})
      }
    })
  }
  catch(err){
    console.log(err);
    return res.send(err);
  }
})

router.post("/items",(req,res,next) =>{
  console.log("body Received", req.body);
  try{
    con.query("select itemName from supplies where itemID in (select itemID from cart_items where cartNo=?)",[[req.body.cartNo]],
    (err,results,fields) => {
      if(err){
        console.log(err);
        return res.send(err);
      }
      var items = results
      console.log("items:",items)
      console.log("results:",results)
      if(results.length>0)
      {
        return res.send({ok:true, message:"bills found", items:items})
      }
    })
  }
  catch(err){
    console.log(err);
    return res.send(err);
  }
})

router.post("/composition", (req, res, next) => {
  console.log("Medicine name Received", req.body);

  try {
    con.query("SELECT composition FROM supplies where itemName=?", [[req.body.medicine]],
      async (err, results, fields) => {
        if (err) {
          console.log(err);
          return res.send(err);
        }
        if (results.length === 0) {
          console.log("Medicine not found!");
          res.send({ ok: false, message: "medicine composition not found" })
          return;
        }
        console.log("comp:", results[0].composition)
        var comp = results[0].composition.split(",");
        var details = []
        //   comp.forEach(element => {
        //       fetch("https://api.nhs.uk/medicines/${element}",{
        //         method: 'GET',
        //         headers: {
        //             "subscription-key": "b84091930d8047b9b9b6abc190ce1c50"
        //           },
        //     }).then(async (res) => res.json())
        //     .then(res=>{
        //         res.mainEntityOfPage.forEach(element => {
        //             details.push(element)
        //         })
        //     }).catch(err => {
        //         console.log(err);
        //         res.send(err);
        //         return;
        //     })
        //   });
        try {
          res.send({ ok: true, composition: comp, details: details })
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

module.exports = router;
