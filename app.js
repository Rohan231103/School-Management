var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
const storage = require('node-persist');
storage.init( /* options ... */ );

var app = express();

app.use('/public',express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }))
app.set('view engine','ejs')

var con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'school'
})

con.connect();


// Admin Login Start

app.get('/',async function(req,res){
    var admin_id = await storage.getItem('ad_id');

    if(admin_id == undefined){
        res.render('admin_login');
    }
    else{
        var userData = "select* from staff";

        con.query(userData,function(error,result,field){
            if(error) throw error;
            res.render('dashboard',{result})
        })
    }
});

app.post('/', function(req,res){
    var email = req.body.email;
    var password = req.body.password;

    var adminLogin = "select id,email,password from admin_login where email='"+email+"' && password='"+password+"'";

    con.query(adminLogin, async function(error,result,field){
        if (error) throw error;

        if(result.length==1){
            await storage.setItem('ad_id',result[0].id);
            res.redirect('/dashboard');
        }
        else{
            res.redirect('/');
        }
    })
})

app.get('/login',function(req,res){
    res.render('admin_login');
})

// app.get('/dashboard',function(req,res){
//     res.render('dashboard');
// })

// Admin Dashboard
app.get('/dashboard',async function(req,res){
    var admin_id = await storage.getItem('ad_id');
    if(admin_id==undefined){
        res.send('Admin First Need To Login After Show Admin Dashboard!!')
    }
    else {
        var userData = "Select * from staff"

        con.query(userData, function (error, result, field) {
            if (error) throw error;

            res.render('dashboard', { result });  
        })
    }
})

// Admin login End 

// Admin logout
app.get('/logout',async function(req,res){
    var admin_id = await storage.getItem('ad_id');

    if(admin_id==undefined){
        res.send("Admin already logout")
    }
    else{
        // await storage.clear();
        await storage.removeItem('ad_id');

        res.send('Admin logout successfull !!');
        // res.redirect('login');
    }
});
// ....


// Add Staff

app.get('/add_staff',async function(req,res){
    var admin_id = await storage.getItem('ad_id');
    if(admin_id==undefined){
        res.send('Admin First Need To Login After Show Staff Dashboard!!')
    }
    else {
        var userData = "Select * from staff"

        con.query(userData, function (error, result, field) {
            if (error) throw error;

            res.render('staff', { result });  
        })
    }
})

app.post('/add_staff',function(req,res){
    var name = req.body.name;
    var address = req.body.address;
    var email = req.body.email;
    var password = req.body.password;

    var add = "insert into staff(name,address,email,password) values('"+name+"','"+address+"','"+email+"','"+password+"')";

    con.query(add,function(error,result,field){
        if(error) throw error;

        res.redirect('/dashboard');
    })
})

// ...

// Add Division

app.get('/adddiv',async function(req,res){
    var admin_id = await storage.getItem('ad_id');
    if(admin_id==undefined){
        res.send('Admin First Need To Login After Show Staff Dashboard!!')
    }
    else {
        var userData = "Select * from division"

        con.query(userData, function (error, result, field) {
            if (error) throw error;

            res.render('add_div', { result });  
        })
    }
})

app.post('/adddiv',function(req,res){
    var division = req.body.division;

    var add = "insert into division(division) values('"+division+"')";

    con.query(add,function(error,result,field){
        if(error) throw error;

        res.redirect('/adddiv');
    })
})

// ...

// Add Standard

app.get('/addstd',async function(req,res){
    var admin_id = await storage.getItem('ad_id');
    if(admin_id==undefined){
        res.send('Admin First Need To Login After Show Staff Dashboard!!')
    }
    else {
        var userData = "Select * from standard"

        con.query(userData, function (error, result, field) {
            if (error) throw error;

            res.render('add_std', { result });  
        })
    }
})

app.post('/addstd',function(req,res){
    var std = req.body.std;

    var add = "insert into standard(std) values('"+std+"')";

    con.query(add,function(error,result,field){
        if(error) throw error;

        res.redirect('/addstd');
    })
})

// ...

// Add Student

app.get('/addstud',async function(req,res){
    var admin_id = await storage.getItem('ad_id');
    if(admin_id==undefined){
        res.send('Admin First Need To Login After Show Staff Dashboard!!')
    }
    else {
        var userData = "SELECT standard.std AS std, division.division FROM standard LEFT JOIN division ON standard.id = division.id;"

        con.query(userData, function (error, result, field) {
            if (error) throw error;

            res.render('add_stud', { result });  
        })
    }
})

app.post('/addstud',function(req,res){
    var rno = req.body.rno;
    var name = req.body.name;
    var std = req.body.std;
    var division = req.body.division;

    var add = "insert into stud(rno,name,std,division) values('"+rno+"','"+name+"','"+std+"','"+division+"')";

    con.query(add,function(error,result,field){
        if(error) throw error;

        res.redirect('/addstud');
    })
})

// ...

//View student
app.get('/viewstud',async function(req,res){
    var admin_id = await storage.getItem('ad_id');
    if(admin_id==undefined){
        res.send('Admin First Need To Login After Show Staff Dashboard!!')
    }
    else {
        var stud = "select* from stud"

        con.query(stud, function (error, result, field) {
            if (error) throw error;

            res.render('viewstud', { result });  
        })
    }
})
//...

//Add Result
app.get('/addresult/:id',async function(req,res){
    var id = req.params.id;
    var admin_id = await storage.getItem('ad_id');
    if(admin_id==undefined){
        res.send('Admin First Need To Login After Show Staff Dashboard!!')
    }
    else {
        var stud = "select * from stud where id = '"+id+"'";

        con.query(stud, function (error, result, field) {
            if (error) throw error;

            res.render('result', { result });  
        })
    }
})

app.post('/addresult/:id',function(req,res){
    var rno = req.body.rno;
    var name = req.body.name;
    var std = req.body.std;
    var division = req.body.division;
    var guj = parseInt(req.body.guj);
    var hindi = parseInt(req.body.hindi);
    var eng = parseInt(req.body.eng);
    var maths = parseInt(req.body.maths);
    var sci = parseInt(req.body.sci);
    var total = parseInt(guj+hindi+eng+maths+sci);
    var avg = total/5;

    var query = "insert into result(rno,name,std,division,gujarati,hindi,english,maths,science,total,avg) values('"+rno+"','"+name+"','"+std+"','"+division+"','"+guj+"','"+hindi+"','"+eng+"','"+maths+"','"+sci+"','"+total+"','"+avg+"')";

    con.query(query,function(error,result,field){
        if(error) throw error;

        res.redirect('/view_result');
    })
})
//...
// View Result
app.get('/view_result',async function(req,res){
    var admin_id = await storage.getItem('ad_id');
    if(admin_id==undefined){
        res.send('Staff First Need To Login After Show  Dashboard!!')
    }
    else {
        var stud = "select * from result";

        con.query(stud, function (error, result, field) {
            if (error) throw error;

            res.render('view_result', { result });  
        })
    }
})
// ...

// Staff Login
app.get('/staff_login',async function(req,res){
    var staff_id = await storage.getItem('stf_id');

    if(staff_id == undefined){
        res.render('staff_login');
    }
    else{
        var userData = "select* from stud";

        con.query(userData,function(error,result,field){
            if(error) throw error;
            res.render('staff_dashboard',{result})
        })
    }
});

app.post('/staff_login', function(req,res){
    var email = req.body.email;
    var password = req.body.password;

    var staffLogin = "select * from staff where email='"+email+"' and password='"+password+"'";

    con.query(staffLogin, async function(error,result,field){
        if (error) throw error;

        if(result.length==1){
            await storage.setItem('stf_id',result[0].id);
            res.redirect('/staff_dashboard');
        }
        else{
            res.redirect('/staff_login');
        }
    })
})

app.get('/staff_login',function(req,res){
    res.render('staff_login');
})

app.get('/staff_dashboard',async function(req,res){
    var staff_id = await storage.getItem('stf_id');
    if(staff_id==undefined){
        res.send('Staff First Need To Login After Show Dashboard!!')
    }
    else {
        var userData = "Select * from stud"

        con.query(userData, function (error, result, field) {
            if (error) throw error;

            res.render('staff_dashboard', { result });  
        })
    }
})
// ...

// Staff Add Result

app.get('/staff_result',async function(req,res){
    // var id = req.params.id;
    var staff_id = await storage.getItem('stf_id');

    if(staff_id==undefined){
        res.send('Staff First Need To Login After Show Staff Dashboard!!')
    }
    else {
        var stud = "select * from stud";

        con.query(stud, function (error, result, field) {
            if (error) throw error;

            res.render('staff_result', { result });  
        })
    }
});

// Staff view result
app.get('/Staffview_result/:rno',async function(req,res){
    var rno = req.params.rno;
    var staff_id = await storage.getItem('stf_id');
    if(staff_id==undefined){
        res.send('Staff First Need To Login After Show  Dashboard!!')
    }
    else {
        var stud = "select * from result where rno='"+rno+"'";
        // console.log(stud);

        con.query(stud, function (error, result, field) {
            if (error) throw error;

            res.render('staffview_result', { result });
            // console.log(result)  
        })
    }
})
// ...

// staff add result
app.get('/staffAddResult/:id',async function(req,res){
    var id = req.params.id;
    var staff_id = await storage.getItem('stf_id');
    if(staff_id==undefined){
        res.send('Staff First Need To Login After Show Student Dashboard!!')
    }
    else {
        var stud = "select * from stud where id="+id;

        con.query(stud, function (error, result, field) {
            if (error) throw error;

            res.render('staffAddResult', { result });  
        })
    }
})

app.post('/staffAddResult/:id',function(req,res){
    var rno = req.body.rno;
    var name = req.body.name;
    var std = req.body.std;
    var division = req.body.division;
    var guj = parseInt(req.body.guj);
    var hindi = parseInt(req.body.hindi);
    var eng = parseInt(req.body.eng);
    var maths = parseInt(req.body.maths);
    var sci = parseInt(req.body.sci);
    var total = parseInt(guj+hindi+eng+maths+sci);
    var avg = total/5;

    var query = "insert into result(rno,name,std,division,gujarati,hindi,english,maths,science,total,avg) values('"+rno+"','"+name+"','"+std+"','"+division+"','"+guj+"','"+hindi+"','"+eng+"','"+maths+"','"+sci+"','"+total+"','"+avg+"')";

    con.query(query,function(error,result,field){
        if(error) throw error;

        res.redirect('/staff_result');
    })
})

// ...

// Staff Update result
app.get('/update_result/:rno',async function(req,res){
    var rno = req.params.rno;
    var staff_id = await storage.getItem('stf_id');
    if(staff_id==undefined){
        res.send('Staff First Need To Login After Show  Dashboard!!')
    }
    else {
        var stud = "select * from result where rno='"+rno+"'";

        con.query(stud, function (error, result, field) {
            if (error) throw error;

            res.render('Update_result', { result });  
        })
    }
})

app.post('/update_result/:rno',function(req,res){
    var rno=parseInt(req.params.rno)
    var name=req.body.name
    var std=parseInt(req.body.std)
    var division=req.body.division
    var guj = parseInt(req.body.guj);
    var hindi = parseInt(req.body.hindi);
    var eng = parseInt(req.body.eng);
    var maths = parseInt(req.body.maths);
    var sci = parseInt(req.body.sci);
    var total = parseInt(guj+hindi+eng+maths+sci);
    var avg = total/5;

    var query = "update result set rno='"+rno+"', name='"+name+"',std='"+std+"',division='"+division+"', gujarati='"+guj+"',hindi='"+hindi+"',english='"+eng+"',maths='"+maths+"',science='"+sci+"',total='"+total+"',avg='"+avg+"' where rno='"+rno+"'";

    con.query(query,function(error,result,field){
        if(error) throw error;

        res.redirect('/staff_result');
    })
})
// ...

// Staff logout
app.get('/staff_logout',async function(req,res){
    var staff_id = await storage.getItem('stf_id');

    if(staff_id==undefined){
        res.send("Staff already logout")
    }
    else{
        // await storage.clear();
        await storage.removeItem('stf_id');

        res.send('Staff logout successfull !!');
        // res.redirect('login');
    }
});
// ....

// Stud Find Result
app.get('/student',function(req,res){
    var query="SELECT standard.std AS std, division.division FROM standard LEFT JOIN division ON standard.id = division.id;"
    con.query(query,function(error,result,index){
    
        if(error) throw error
        res.render('findresult',{result})
    })
})
app.post('/student',function(req,res){
    var std=req.body.std
    var division=req.body.division
    var rno=req.body.rno

    var qr="SELECT * FROM result WHERE std = '"+std+"' AND division = '"+division+"' AND rno = '"+rno+"';"
    con.query(qr,function(error,result,index){
        if(error) throw error
        res.render('studfind_result',{result})
    })
})
// ...
app.listen(3000)