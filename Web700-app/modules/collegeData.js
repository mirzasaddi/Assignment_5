const fs = require("fs");

let students = [];
let courses = [];

function initialize() {
  return new Promise((resolve, reject) => {
    fs.readFile("../data/students.json", "utf8", (err, studentData) => {
      if (err) {
        reject("Unable to read students.json");
        return;
      }

      fs.readFile("../data/courses.json", "utf8", (err, courseData) => {
        if (err) {
          reject("Unable to read courses.json");
          return;
        }

        students = JSON.parse(studentData);
        courses = JSON.parse(courseData);
        resolve();
      });
    });
  });
}

function getAllStudents() {
  return new Promise((resolve, reject) => {
    if (students.length > 0) {
      resolve(students);
    } else {
      reject("no results returned");
    }
  });
}

function getTAs() {
  return new Promise((resolve, reject) => {
    const TAs = students.filter(s => s.TA === true);
    if (TAs.length > 0) {
      resolve(TAs);
    } else {
      reject("no results returned");
    }
  });
}

function getCourses() {
  return new Promise((resolve, reject) => {
    if (courses.length > 0) {
      resolve(courses);
    } else {
      reject("no results returned");
    }
  });
}

function getStudentsByCourse(course) {
  return new Promise((resolve, reject) => {
    const filtered = students.filter(s => s.course == course);
    if (filtered.length > 0) {
      resolve(filtered);
    } else {
      reject("no results returned");
    }
  });
}

function getStudentByNum(num) {
  return new Promise((resolve, reject) => {
    const student = students.find(s => s.studentNum == num);
    if (student) {
      resolve(student);
    } else {
      reject("no results returned");
    }
  });
}

function addStudent(studentData) {
  return new Promise((resolve, reject) => {
    // Make sure TA is boolean
    studentData.TA = (studentData.TA === "true");

    // Auto-generate a new student number
    studentData.studentNum = students.length > 0
      ? students[students.length - 1].studentNum + 1
      : 1;

    students.push(studentData);
    resolve();
  });
}

function updateStudent(studentData) {
  return new Promise((resolve, reject) => {
    studentData.TA = (studentData.TA === "true");

    const index = students.findIndex(s => s.studentNum == studentData.studentNum);

    if (index !== -1) {
      students[index] = studentData;
      resolve();
    } else {
      reject("Student not found");
    }
  });
}

function getCourseById(id) {
  return new Promise((resolve, reject) => {
    const course = courses.find(c => c.courseId == id);
    if (course) {
      resolve(course);
    } else {
      reject("query returned 0 results");
    }
  });
}

module.exports = {
  initialize,
  getAllStudents,
  getTAs,
  getCourses,
  getStudentsByCourse,
  getStudentByNum,
  addStudent,
  updateStudent,
  getCourseById
};
