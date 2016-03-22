/**
 * Created by HuyTrinh on 3/18/2016.
 */
//server.js

//------ Setting up ------//

var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

//--------- Configuration ----//

mongoose.connect('mongodb://localhost/todoapp');

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(methodOverride());

//----- Defining model ------//
var Todo = mongoose.model('Todo', {
    text : String
});

//-------Generating Express routes to handle the API calls
//---------Get all todos item
app.get('/api/todos', function(req, res){

    Todo.find(function(err, todos){
        if(err) res.send(err);
        //if no error
        res.json(todos);
    });
});

//--------Creating todos item and send back info about created todos
app.post('/api/todos', function(req, res){
    Todo.create({
        text : req.body.text,
        done : false
    }, function(err, todo) {
        if(err) res.send(err);
        //if no errors

        Todo.find(function(err, todos){
            if(err) res.send(err);
            //if no error
            res.json(todos);
        });
    });
});

//----- Deleting a todos item

app.delete('/api/todos/:todo_id', function(req, res){
    Todo.remove({
        _id : req.params.todo_id
    }, function(err, todo){
        if(err) res.send(err);

        //if no errors

        Todo.find(function(err, todos){
            if(err) res.send(err);
            //if no error
            res.json(todos);
        });
    });
});

//-----application

app.get('', function(req, res){
    res.sendfile('./public/index.html');
});

//----- Start app and listen on port 3000

app.listen(3000);
console.log("Server is running on port 3000...");