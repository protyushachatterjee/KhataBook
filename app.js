const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const today = new Date();

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    fs.readdir(`./files`, "utf8", function (err, files) {
        if (err) res.send(err.message);
        else {
            // console.log(files) //it is an array
            res.render("index", { files });
        }
    })
})

app.get('/create', (req, res) => {
    res.render("create");
})

app.post('/create', (req, res) => {
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = today.getFullYear();

    const nd = `${day}-${month}-${year}.txt`;
    fs.writeFile(`./files/${nd}`, req.body.filedata, function (err) {
        if (err) res.send(err.message);
        res.redirect("/")
    })
})

app.get("/show/:filename", function(req, res){
    fs.readFile(`./files/${req.params.filename}`, "utf8", function(err, file){
        if(err) res.send(err.message);
        res.render("show", {file, filename: req.params.filename})
    })
})

app.get('/edit/:filename', (req, res)=>{
    fs.readFile(`./files/${req.params.filename}`, "utf8", function(err, file){
        if(err) res.send(err.message);
        res.render("edit", {file, filename: req.params.filename})
    })
})

app.post('/update/:filename', (req, res)=>{
    fs.writeFile(`./files/${req.params.filename}`, req.body.filedata ,function(err){
        if(err) res.send(err.message);
        res.redirect("/");

    })
})


app.get("/delete/:filename", function(req, res){
    fs.unlink(`./files/${req.params.filename}`, function(err){
        if(err) res.send(err.message);
        res.redirect("/");
    })
})

app.listen(3000);