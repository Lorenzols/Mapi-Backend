const Products = require("../models").Products;
const Configuration = require("../models").configuration;

exports.productsStatus = async (req, res) => {
    const phList = [6.6, 6.7, 6.8, 6.9, 7, 7.2, 7.3, 7.4, 7.5, 7.6]
    const ppmList = [0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5]

    function phRandom(list) {
        let a = Math.floor(Math.random() * list.length)
        return list[a]
    }

    //Simulamos los datos
    let phValue = phRandom(phList)
    let ppmValue = phRandom(ppmList)

    //Calcula el estado del ph
    let phStatus

    if(phValue > 7.6){
        phStatus = "Alto"
    }if (phValue < 7.4) {
        phStatus = "Bajo"
    } else {
        phStatus = "Normal"
    }

    //Estado del ppm
    let ppmStatus
    
    if(ppmValue > 1.5){
        ppmStatus = "Alto"
    }if (ppmValue < 1) {
        ppmStatus = "Bajo"
    } else {
        ppmStatus = "Normal"
    }

    //Para redondear numeros
    let roundMapi = (num) => {
        var m = Number((Math.abs(num) * 100).toPrecision(15));
        return Math.round(m) / 100 * Math.sign(num);
    }

    const r = await Products.findAll({where: {fk_iduser: req.userId}})

    let phAppropriateValue = r[0].dataValues.appropriate_value
    let ppmAppropriateValue = r[1].dataValues.appropriate_value


    //Valor de diferencia ph
    let phDiference = roundMapi((phAppropriateValue - phValue))

    //valor de diferencia ppm
    let ppmDiference = roundMapi((ppmAppropriateValue - ppmValue))

    const mc = await Configuration.findAll({where: {fk_iduser: req.userId}})
    
    let metersCubicsPool =  mc[0].dataValues.meters_cubics_pool

    let phDosageRecommendMl = r[0].dataValues.dosage_recommend_ml
    let phDosageRecommendMc = r[0].dataValues.dosage_recommend_mc

    //Se calcula la proporción de ml para subir 1 de ph
    let phDosageRatio = metersCubicsPool * phDosageRecommendMl / phDosageRecommendMc
    let phDosageValue = roundMapi(phDosageRatio * phDiference)

    if(phDosageValue < 0){
        phDosageValue = 0
    }


    let ppmDosageRecommendMl = r[1].dataValues.dosage_recommend_ml
    let ppmDosageRecommendMc = r[1].dataValues.dosage_recommend_mc

    //se calcula la proporción de ml para subir 1 de ppm
    let ppmDosageRatio = metersCubicsPool * ppmDosageRecommendMl / ppmDosageRecommendMc
    let ppmDosageValue = roundMapi(ppmDosageRatio * ppmDiference)

    if(ppmDosageValue < 0){
        ppmDosageValue = 0
    }
    
    let data = [
        {name: "ph+", value: phValue, status: phStatus, diference: phDiference, dosage: phDosageValue},
        {name: "ppm", value: ppmValue, status: ppmStatus, diference: ppmDiference, dosage: ppmDosageValue}
    ]

    return(data)
}