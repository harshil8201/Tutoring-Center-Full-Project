const express = require("express");
const courseController = require("../controllers/courseController");
const router = express.Router();

// GET all courses (used for frontend rendering or API)
router.get("/", courseController.getCourses);

// POST a new course
router.post("/", courseController.createCourse);

// GET a new getCoursesAPI
router.get("/getCourse", courseController.getCoursesAPI);

// DELETE a course by ID
router.delete("/:id", courseController.deleteCourse);

// Update a course by ID
router.put("/:id", courseController.updateCourse);

// POST to add courses to a user's profile
router.post("/add-to-cart", courseController.addCoursesToUserProfile);

// GET a course for Logged-in user
router.get("/get-user-courses", courseController.getUserCourses);

module.exports = router;
