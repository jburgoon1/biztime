const express = require("express");
const router = express.Router()
const db = require('../db')

router.get('/', async (req, res, next) =>{
    try{
    const result = await db.query(
        `SELECT * FROM industries AS i 
        LEFT JOIN industry_company AS ic ON i.industry_code = ic.industry_code
        LEFT JOIN companies AS c ON ic.comp_code = c.code
        `)
    return res.json({industries: result.rows})
    }catch(e){
        next(e)
    }
})

router.post('/', async (req, res, next)=>{
    try{
        const {industry_code, industry}=req.body
        const result = await db.query(`INSERT INTO industries (industry_code, industry) VALUES ($1, $2) RETURNING industry_code, industry`, [industry_code, industry])
        return res.json({industry:result.rows})
    }
    catch(e){
        next(e)
    }
})

module.exports = router