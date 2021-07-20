const { ESRCH } = require("constants");
const express = require("express");
const router = express.Router()
const db = require('../db')

router.get('/', async (req, res, next) =>{
    try{
    const result = await db.query(
        `SELECT * FROM companies AS c
        LEFT JOIN invoices ON companies.code = invoices.comp_code
        `)
    return res.json({companies: result.rows})
    }catch(e){
        next(e)
    }
})
router.get('/:name', async (req, res, next) =>{
    try{
        const company1 = req.params.name
        const result = await db.query(`SELECT * FROM companies AS c
        LEFT JOIN industry_company AS ic ON c.code = ic.comp_code
        LEFT JOIN industries AS i ON ic.industry_code = i.industry_code
        WHERE code = $1`, [company1])
        return res.json({company:result.rows})
    }catch(e){
        next(e)
    }
})
router.post('/', async (req, res, next)=>{
    try{
        const {code, name, description}=req.body
        const result = await db.query(`INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, descirption`, [code, name, description])
        return res.json({company:result.rows})
    }
    catch(e){
        next(e)
    }
})
router.put('/:name', async (req, res, next)=>{
    try{
        const {name, description} = req.body
        const result = await db.query(`UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description`, [name, description, req.params.name])
        return res.json({company:result.rows})
    }catch(e){
        next(e)
    }
})
router.delete('/:name', async (req, res, next)=>{
    try{
        const comp = req.params.name
        const result = await db.query(`DELETE FROM companies WHERE code =$1`, [comp])
        return res.json({message:"DELETED"})
    }catch(e){
        next(e)
    }
})


module.exports = router