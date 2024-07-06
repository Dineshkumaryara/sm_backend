const express = require("express"); //for importing the express
const dotEnv= require("dotenv"); //fot importing the dotenv
const mongoose = require("mongoose"); //for importing the mongoose
const bodyParser = require("body-parser");
const cors = require("cors"); // Import cors

const app = express() //Asign the methods of express to the variable app

const PORT = 4040;

dotEnv.config(); // Load environment variables from a.env file


// Enable CORS for the server
// app.use(cors({
//     origin: 'http://localhost:5173', // Allow requests from this origin
//     methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
//     allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
//   }));

app.use(cors());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected..."))
.catch((error) => console.log(error)); //connect to the database

// Middleware
app.use(bodyParser.json());

// Routes
const authRoutes = require('./routes/auth');
const facultyRoutes = require('./routes/faculty');

app.use('/api/auth', authRoutes);
app.use('/api/faculty', facultyRoutes);



// Start the server on the specified port
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})



// Define a simple route
app.use('/', (req, res)=>{
    res.send("Hello, World!"); // Send a response to the client
})

