/*********************************************************************************
*  WEB700 – Assignment 05
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.
*  No part of this assignment has been copied manually or electronically from any other source 
*  (including 3rd party websites) or distributed to other students.
*
*  Name: [Your Name] Student ID: [Your Student ID] Date: [Date]
*
*  Online (Vercel) Link: [Your Vercel Link]
********************************************************************************/

const HTTP_PORT = process.env.PORT || 8080;
const express = require("express");
const app = express();
const path = require("path");
const ejs = require("ejs");
const expressLayouts = require("express-ejs-layouts");
const collegeData = require("./modules/collegeData.js");

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Set layout config for express-ejs-layouts
app.use(expressLayouts);
app.set("layout", "layouts/main");

// Middleware to parse form data from POST requests
app.use(express.urlencoded({ extended: true }));

// Serve static files (CSS, images, etc.)
app.use(express.static(path.join(__dirname, "public")));

// Default Route - Home Page
app.get("/", (req, res) => {
    res.render("home");
});

// About Page
app.get("/about", (req, res) => {
    res.render("about");
});

// HTML Demo Page
app.get("/htmlDemo", (req, res) => {
    res.render("htmlDemo");
});

// Add Student Form
app.get("/students/add", (req, res) => {
    res.render("addStudent");
});

// Handle Add Student Form Submission
app.post("/students/add", (req, res) => {
    collegeData.addStudent(req.body)
        .then(() => res.redirect("/students"))
        .catch(() => res.json({ message: "Unable to add student" }));
});

// Students Route
app.get("/students", (req, res) => {
    if (req.query.course) {
        collegeData.getStudentsByCourse(req.query.course)
            .then((students) => res.json(students))
            .catch(() => res.render("students", { message: "no results" }));
    } else {
        collegeData.getAllStudents()
            .then((students) => res.json(students))
            .catch(() => res.render("students", { message: "no results" }));
    }
});

// Get Student by Student Number
app.get("/student/:studentNum", (req, res) => {
    collegeData.getStudentByNum(req.params.studentNum)
        .then((student) => res.json(student))
        .catch(() => res.json({ message: "no results" }));
});

// Get TAs
app.get("/tas", (req, res) => {
    collegeData.getTAs()
        .then((tas) => res.json(tas))
        .catch(() => res.json({ message: "no results" }));
});

// Get Courses
app.get("/courses", (req, res) => {
    collegeData.getCourses()
        .then((courses) => res.json(courses))
        .catch(() => res.render("courses", { message: "no results" }));
});

// Catch-All (404) Route
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

// Start the Server
app.listen(HTTP_PORT, () => {
    console.log("server listening on port: " + HTTP_PORT);
    collegeData.initialize();
});
