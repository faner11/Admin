const express = require('express');
const users = require('../models/users');
const router = express.Router();


router.get('/',(req,res,next)=>{
    res.redirect('/index')
});

/**
 * 用户登陆页面
 */
router.get('/login', (req, res, next)=> {
    if(req.query.tc && req.session){
        req.session.cookie.maxAge = 0;
    }
    res.render('login');
});
/**
 * 用户登陆验证
 */
router.post('/login', (req, res, next)=> {
    let inof =req.body;
    users
        .findOne({username:inof.username,password:inof.password})
        .then(result=>{
            req.session.cookie.maxAge = 300000000;
            req.session.username = inof.username;
            if(result){
                res.json({
                    status:0,
                    username:inof.username,
                    msg:'登陆成功'
                })
            }else {
                res.json({
                    status:1,
                    msg:'登陆失败'
                })
            }
        })
});
module.exports = router;