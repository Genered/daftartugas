var express     = require("express")
var bodyParser  = require("body-parser")
var sql 		= require("mssql")
var methodOverride 	= require("method-override")
var app         = express()

// For hosting
var port = process.env.PORT

// Use below if run locally
// var port = process.env.PORT | 1000

// Create a configuration object for our Azure SQL connection parameters
var dbConfig = {
    server: "daftartugaswebapp.database.windows.net", 
    database: "daftartugas", 
    user: "genered", 
    password: "Burliku1", 
    port: 1433,    
    options: {
		encrypt: true
    }
}

app.set("view engine", "ejs")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(methodOverride("_method"))

app.get('/', function (req, res) {
	
	sql.connect(dbConfig, (err) => {		
		if(err)
			console.log(err);
		else {
			var request = new sql.Request();
			request.query("select * from candidates", (err, record) => {
				if(err)
					console.log(err);
				else {
					res.render("index", {candidates: record.recordset});
					sql.close();
					console.log(record.recordset);	
				}	
			});		
		}
    });		 
    
	// res.render("index");
});

app.put('/:id/:earned_vote', function (req, res) {		
	var vote = parseInt(req.params.earned_vote) + 1

	sql.connect(dbConfig, (err) => {		
		if(err)
			console.log(err);
		else {			
			var request = new sql.Request();
			var query = "update candidates set earned_vote= " + vote + " where id = " + req.params.id 						

			// console.log(query);
			request.query(query, (err, record) => {
				if(err)
					console.log(err);
				else{					
					res.redirect("/");	
					sql.close();		
					// console.log(record.recordset);
				}
			});			
		}					
	});				
});

app.listen(port)
console.log("Server is running on port %d", port);