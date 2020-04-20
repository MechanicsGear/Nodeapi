/*
 * @Author: your name
 * @Date: 2020-04-19 22:11:52
 * @LastEditTime: 2020-04-20 19:07:48
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \vscodese:\Nodeapi\Mysqls.js
 */
 /*jshint esversion: 6 */
const express=require('express');
const app=express();
app.listen('5000',()=>{
    console.log('http://127.0.0.1:5000');
});

const mysql=require('mysql');
const conn=mysql.createConnection({
    host:'localhost',
    user:'root',
    port:'3306',
    password:'root',
    database:'goodshop'
});

const  bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//---------------------------用户--------------------------------
//注册账号
app.post('/api/adduser',(req,res)=>{
    const sqls='INSERT INTO user set ?';
    const datas=req.body;
   
    console.log(datas);
    console.log(sqls);
    conn.query(sqls,datas,(err,results)=>{
        if(err) return res.json({err_code:1,message:'添加失败',affectedRows:0});
        if(results.affectedRows !== 1) return res.json({err_code:1,message:'添加失败',affectedRows:0});
        res.json({err_code:0,message:'添加成功',affectedRows:results.affectedRows});
    });
});
//登录查询,
app.get('/api/getuser',(req,res)=>{
    const sqls='select * from user  where username=? and password =?';
    conn.query(sqls,[req.query.username,req.query.password],(err,results)=>{
        if(err) return res.json({err_code:1,message:'查询失败',affectedRows:0});
        res.json({
            err_code:0,
            message:results,
            affectedRows:1
        });
    });
});

//删除账号
app.get('/api/deluser',(req,res)=>{
    const sqls='delete from user where Id = ?';
    const ids=req.query.id;
    console.log(ids);
    conn.query(sqls,ids,(err,results)=>{
        if(err) return res.json({err_code:1,message:'删除失败',affectedRows:0});
        if(results.affectedRows!==1){
            res.json({err_code:1,message:'删除失败',affectedRows:0});
        }
        res.json({err_code:0,message:'删除成功',affectedRows:results.affectedRows});
    });
});


//---------------------------------------------类型
//添加分类
app.post('/api/addtype',(req,res)=>{
    const sqls='insert into type set ?';
    const datas=req.body;

    console.log(datas);

    conn.query(sqls,datas,(err,results)=>{
        if(err) return res.json({err_code:1,message:'添加类型失败',affectedRows:0});
        if(results.affectedRows!==1)return res.json({err_code:1,message:'添加失败',affectedRows:0});
        res.json({err_code:0,message:'添加分类成功',affectedRows:1});
    });
});
//读取全部分类
app.get('/api/gettype',(req,res)=>{
    const sqls='select * from type';
    conn.query(sqls,(err,results)=>{
        if(err) return res.json({err_code:1,message:"读取失败",affectedRows:0});
        res.json({err_code:0,message:results,affectedRows:1});
    });
});

//-----------------------------------------------------商品
//添加商品
app.post('/api/addshop',(req,res)=>{
    const sqls='insert into shop set ?';
    const datas=req.body;
    conn.query(sqls,datas,(err,results)=>{
        if(err) return res.json({err_code:1,message:"添加失败",affectedRows:0});
        if(results.affectedRows!==1) res.json({err_code:1,message:'添加商品失败',affectedRows:0});
        res.json({err_code:0,message:results,affectedRows:1});
    });
});
//读取商品
app.get('/api/getshop',(req,res)=>{
    if(req.query.cid){
        //根据ID输出数据
        const sqls="select * from shop where cid=?";
        const cid=req.query.cid;
        console.log(cid);
        conn.query(sqls,cid,(err,results)=>{
            if(err) return res.json({err_code:1,message:"获取失败",affectedRows:0});
            console.log(results);
            var json={err_code:0,message:results,affectedRows:1};
            if(json.message.length!=0)  res.json({err_code:1,message:'分类中不存在商品',affectedRows:0});
            res.json(json);
        });
    }else{
        //输出全部
        const sqls='select * from shop';
        conn.query(sqls,(err,results)=>{
        if(err) return res.json({err_code:1,message:"添加失败",affectedRows:0});
        res.json({err_code:0,message:results,affectedRows:1});
    });
    }
});

//删除商品
app.get('/api/delshop',(req,res)=>{
    const sqls='delete from shop where ID = ?';
    const ids=req.query.id;
    console.log(ids);
    conn.query(sqls,ids,(err,results)=>{
        if(err) return res.json({err_code:1,message:"删除失败",affectedRows:0});
        if(results.affectedRows!==1){
            res.json({err_code:1,message:"删除不存在",affectedRows:0});
        } 
        res.json({err_code:0,message:results,affectedRows:results.affectedRows});
    });
});

//通过名字来模糊查找
app.get('/api/likeshop',(req,res)=>{
    const sqls="select * from shop where name like '%"+req.query.name+"%'";
    conn.query(sqls,(err,results)=>{
        console.log(err);
        if(err) return res.json({err_code:1,message:"查询不到",affectedRows:0});
       
        return res.json({
            err_code:0,
            message:results,
            affectedRows:1
        });
    });
});

//添加商品到购物车
app.post('/api/addcode',(req,res)=>{
    const sqls='insert into code set ?';
    const data=req.body;
    console.log(data);
    conn.query(sqls,data,(err,results)=>{
        console.log(err);
        if(err) return res.json({err_code:1,message:"添加失败",affectedRows:0});
        if(results.affectedRows!==1){
            res.json({err_code:1,message:"添加失败",affectedRows:0});
        }
        return res.json({
            err_code:0,
            message:"添加成功",
            affectedRows:1
        });
    });
});
//根据ID获取购物车内容
app.get('/api/getcode',(req,res)=>{
    const sqls='select  name, subTitle, num, price from code inner join shop where code.pid=shop.ID  and  code.uid= ?';
    conn.query(sqls,req.query.uid,(err,results)=>{
        console.log(err);
        if(err) return res.json({err_code:1,message:"查询失败",affectedRows:0});
        res.json({
            err_code:0,
            message:results,
            affectedRows:1
        });
    });
});
//购物车删除商品
app.get('/api/delcode',(req,res)=>{
    const sqls="delete from code where ID=?";
    const ids=req.query.id;
    conn.query(sqls,ids,(err,results)=>{
        if(err) return res.json({err_code:1,message:"删除失败",affectedRows:0});
        res.json({err_code:0,message:results,affectedRows:1});
    });
});

//商品评价
app.post('/api/addappraise',(req,res)=>{
    const sqls='insert into appraise set ? ';
    const data=req.body;
    conn.query(sqls,data,(err,results)=>{
        if(err) return res.json({err_code:0,message:"删除失败",affectedRows:0});
        res.json({err_code:0,message:results,affectedRows:1});
    })
})