const express = require('express');
const markdown = require('markdown').markdown;
const users = require('../models/users');
const category = require('../models/category');
const article = require('../models/article');
const router = express.Router();




/* GET home page. */
router.use('/', (req, res, next)=> {
    if(!req.session.username){
        return res.redirect('/login');
    }
    next();
});

router.get('/', (req, res, next)=> {
    res.render('index');
});


/**
 * 文章列表页面
 */
router.get('/article', (req, res, next)=> {
    let start = req.query.start-0;
    article.find().count().then(n=>{
        article
            .find().populate({path:'category',select:'alias'}).skip(start).limit(4)
            .then(result=>{
                res.render('article',{article:result,n:n})
            })
    });



});
/**
 * 文章添加页面
 */
router.get('/add-article', (req, res, next)=> {
    category.find().then(result=>{
        res.render('add-article',{category:result})
    });
});
router.post('/add-article', (req, res, next)=> {
    let inOf = req.body;
    let describe = markdown.toHTML(inOf.describe);
    let obj = {
        title: inOf.title,
        describe:describe,
        category:inOf.category,
        tags:inOf.tags,
        titlepic:inOf.titlepic,
        visibility:inOf.visibility,
    };
    article
        .create(obj)
        .then(result=>{
            if(result){
                res.json({
                    status:0,
                    msg:"创建成功"
                })
            }else {
                res.json({
                    status:2,
                    msg:"创建失败，请稍后"
                })
            }
        })
});
/**
 * 文章修改页面
 */
router.get('/update-article', (req, res, next)=> {
    article.find({_id:req.query.tid}).then(result=>{
        console.log(result);
        category.find().then(resultLM=>{
            res.render('update-article',{category:resultLM,article:result})
        });
    });
});
/**
 * 文章修改功能
 */
router.post('/update-article', (req, res, next)=> {
    let inOf = req.body;
    let describe = markdown.toHTML(inOf.describe);
    let obj = {
        title: inOf.title,
        describe:describe,
        category:inOf.category,
        tags:inOf.tags,
        titlepic:inOf.titlepic,
        visibility:inOf.visibility,
    };
    article
        .update({_id:inOf.tid},obj)
        .then(result=>{
            if(result){
                res.json({
                    status:0,
                    msg:"修改成功"
                })
            }else {
                res.json({
                    status:2,
                    msg:"修改失败，请稍后"
                })
            }
        })
});
/**
 * 文章删除
 */
router.get('/remove-article',(req,res)=>{
    if(req.query.tid){
        let tid = req.query.tid;
        article.remove({_id:tid}).then(result=> {
            if(!result){
                throw err;
            }else {
                res.redirect('/index/article');
                return;
            }

        })
    }
    if(req.query.checkbox){
        let checkbox = req.query.checkbox;
        ;(function sc(i) {
            if(i===checkbox.length){
                res.json({
                    status :0
                });
                return
            }
            article.remove({_id:checkbox[i]}).then(result=>{
                sc(i+1);
            })
        })(0)
    }
});





/**
 * 栏目列表与添加
 */
router.get('/category', (req, res, next)=> {
        category.find().then(result=> {
            var promise = new Promise(function(resolve, reject) {
                let arr = [];
                ;(function iterate(i) {
                    if(i === result.length){
                        resolve(arr);
                        return
                    }
                    article
                        .find({category: result[i]._id})
                        .count()
                        .then(resultArr => {
                            if(resultArr) {
                                arr.push(resultArr);
                            }
                            iterate(i+1)
                        })

                })(0)
            });
            promise.then(value=>{
                res.render('category',{category:result,geShu:value})
            });
        })
    });

router.post('/category', (req, res, next)=> {
    let inOf = req.body;
    category
        .findOne({name:inOf.name})
        .then(result=>{
            if(result) {
                res.json({
                    status: 1,
                    msg: "分类已经存在"
                })
            }else {
                category.create({
                    name:inOf.name,
                    alias:inOf.alias,
                    keywords:inOf.keywords,
                    describe:inOf.describe
                }).then(result1=>{
                    if(result1){
                        res.json({
                            status: 0,
                            msg: "分类创建成功"
                        })
                    }else {
                        res.json({
                            status: 2,
                            msg: "请稍后重试"
                        })
                    }
                })
            }
        })

});
/**
 * 栏目修改页面
 */
router.get('/update-category', (req, res, next)=> {
    let name = req.query.name;
    let tid = req.query.tid;
    res.render('update-category',{
        name:name,
        tid:tid
    })
});
/**
 * 栏目修改功能
 */
router.post('/update-category', (req, res, next)=> {
    let inOf = req.body;
    let tid = inOf.tid;
    console.log(tid);
    category
        .update({_id:tid},{
            name:inOf.name,
            alias:inOf.alias,
            keywords:inOf.keywords,
            describe:inOf.describe
        })
        .then(result=>{

            if(result){
                res.json({
                    status:0,
                    msg:"修改成功"
                })
            }else {
                res.json({
                    status:1,
                    msg:"修改失败"
                })
            }
        });
});
/**
 * 栏目删除功能
 */
router.get('/remove',(req,res)=>{
    let tid = req.query.tid;
    category
        .remove({_id:tid})
        .then(result=>{
            if(!result){
                throw err;
            }else {
                res.redirect('/index/category')
            }
        })
});





module.exports = router;
