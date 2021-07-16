const express = require("express");
const router = express.Router();
const db = require('../db')

router.get('/', async (req, res, next) =>{
    try{
    const result = await db.query(`SELECT * FROM invoices INNER JOIN companies ON invoices.comp_code = companies.code`)
    return res.json({invoices: result.rows})
    }catch(e){
        next(e)
    }
})
router.get('/:id', async (req, res, next) =>{
    try{
        const invoice1 = req.params.id
        const result = await db.query(`SELECT * FROM invoices WHERE id = $1`, [invoice1])
        return res.json({invoice:result.rows})
    }catch(e){
        next(e)
    }
})
router.post('/', async (req, res, next)=>{
    try{
        const {comp_code, amt, add_date}=req.body
        const result = await db.query(`INSERT INTO invoices (comp_code, amt, add_date) VALUES ($1, $2, $3) RETURNING comp_code, amt, add_date`, [comp_code, amt, add_date])
        return res.json({invoice:result.rows})
    }
    catch(e){
        next(e)
    }
})
router.put('/:id', async (req, res, next)=>{
    try{
        const {paid, paid_date} = req.body
        const result = await db.query(`UPDATE invoices SET paid=$1, paid_date=$2 WHERE id=$3 RETURNING comp_code, amt, paid, paid_date`, [paid, paid_date, req.params.id])
        return res.json({invoice:result.rows})
    }catch(e){
        next(e)
    }
})
router.delete('/:id', async (req, res, next)=>{
    try{
        const invoice = req.params.id
        const result = await db.query(`DELETE FROM invoices WHERE id =$1`, [invoice])
        return res.json({message:"DELETED"})
    }catch(e){
        next(e)
    }
})

module.exports = router