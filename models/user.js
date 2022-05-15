"use strict";

module.exports = function(sequelize, DataTypes) {
 
    var User = sequelize.define('user', {
 
        id: {
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
 
        name: {
            type: DataTypes.STRING,
            notEmpty: true
        },
 
        email: {
            type: DataTypes.STRING,
            validate: {
                isEmail: {
                    args: false,
                    msg: 'email incorrecto'
                }
            }
        },
 
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
 
    }, {timestamps: false,});
 
    return User;
 
}