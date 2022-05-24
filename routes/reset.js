var express = require('express');
var router = express.Router();
const User = require("../models").User;
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
// let smtpTransport = require('nodemailer-smtp-transport')
let bcrypt = require('bcryptjs');
const { is } = require('express/lib/request');
require('dotenv').config()
const { google } = require('googleapis')

router.post('/email', async function(req, res, next) {
    console.log("email: ",req.body.email)

    try {
        const oAuth2Client = new google.auth.OAuth2(
            process.env.CLIETN_ID,
            process.env.CLIENT_SECRET,
            process.env.REDIRECT_URI
        )

        oAuth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN})

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
        
        const accessToken = await oAuth2Client.getAccessToken()

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            port: 465,
            secure: true,
            auth: {
                type: "OAuth2",
                user: process.env.EMAIL_USER,
                clientId: process.env.CLIETN_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        transporter.verify(function (error, success) {
            if (error) {
              console.log(error);
            } else {
              console.log("Server is ready to take our messages");
            }
        });

        const urlBaseEmail = process.env.URL_BASE || 'http://localhost:3000'

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: req.body.email,
            subject: 'Enlace para recuperar su cuenta en MaPi.',
            text: `${urlBaseEmail}/resetpassword?id=${exsitUser.id}&token=${token}`
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