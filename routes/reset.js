var express = require('express');
var router = express.Router();
const User = require("../models").User;
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
let smtpTransport = require('nodemailer-smtp-transport')
let bcrypt = require('bcryptjs');
const { is } = require('express/lib/request');

router.post('/email', async function(req, res, next) {
    console.log("email: ",req.body.email)

    try {
        const exsitUser = await User.findOne({where: { email: req.body.email }})

        if(exsitUser == null){
            res.send({error: "No existe el email"})
            return
        }

        const token = jwt.sign({ email: exsitUser.email }, "elsecretoesmapiok", {
            expiresIn: "1h",
        });

        const oktoken = await exsitUser.update({
            tokenresetpassword: token
        })
        

        const transporter = nodemailer.createTransport(smtpTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        }))

        transporter.verify(function (error, success) {
            if (error) {
              console.log(error);
            } else {
              console.log("Server is ready to take our messages");
            }
        });

        const emailPort = 3000

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: req.body.email,
            subject: 'Enlace para recuperar su cuenta en MaPi.',
            text: `http://localhost:${emailPort}/resetpassword?id=${exsitUser.id}&token=${token}`
        }

        transporter.sendMail(mailOptions, (err, response) => {
            if(err){
                res.send({error: "No se a podido enviar el email"})
            }else{
                res.send({error: "Revise el email, se le ha enviado un enlace para cambiar la contraseña."})
            }
        })

      } catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
    }    
});


router.put('/password', async function(req, res, next) {

    const hashedPassword = await bcrypt.hash(req.body.password, 12)

    try{
        const passUpdate = await User.update({
            password: hashedPassword
        },{
            where: {
                id: req.query.id,
                tokenresetpassword: req.query.token
            }
        })

        res.send({
            error: "Contraseña cambiada con éxito"
        })
    }catch(err){
        res.send({
            error: "No se ha podido cambiar la contraseña"
        })
    }
    
})

module.exports = router;