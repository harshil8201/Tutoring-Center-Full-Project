const Course = require("../models/courseModel");
const User = require("../models/userModel");

// Fetch all courses in JSON format (API) excluding user's order history
exports.getCoursesAPI = async (req, res) => {
  const { email } = req.query; // Get user's email from query parameters

  try {
    let excludedCourseIds = [];

    // If email is provided, fetch user's order history to exclude those courses
    if (email) {
      const user = await User.findOne({ email });
      if (user && user.cart.length > 0) {
        excludedCourseIds = user.cart.map((courseId) => courseId.toString()); // Extract course IDs from user's cart
      }
    }

    // Fetch all courses excluding the ones in user's cart
    const courses = await Course.find({
      _id: { $nin: excludedCourseIds }, // Exclude courses from user's cart
    }).sort({ _id: -1 }); // Sort by _id in descending order

    res.status(200).json(courses); // Respond with the filtered courses in JSON format
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch all courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ _id: -1 }); // Sort by _id in ascending order
    res.render("courses", { courses }); // Render 'courses.ejs' view
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add a new course (for API)
exports.createCourse = async (req, res) => {
  const { name, price, img } = req.body;

  // Log the incoming data
  console.log("Course Data Received:", { name, price, img });

  const course = new Course({
    name,
    price,
    img,
  });

  try {
    await course.save(); // Ensure course is saved
    res.redirect("/api/courses"); // Redirect to the courses page to reload and show updated list
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a course by ID
exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params; // Extract the course ID from the route params
    const deletedCourse = await Course.findByIdAndDelete(id); // Find and delete the course by ID
    if (!deletedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }
    res
      .status(200)
      .json({ message: "Course deleted successfully", course: deletedCourse });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a course by ID
exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const { name, price, img } = req.body;

  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      { name, price, img },
      { new: true } // Return the updated document
    );

    if (!updatedCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add courses to the user's profile (cart)
exports.addCoursesToUserProfile = async (req, res) => {
  const { email, courses } = req.body; // `email` and `courses` from the request

  // Validate input
  if (!email || !Array.isArray(courses) || courses.length === 0) {
    return res
      .status(400)
      .json({ message: "Please Login or Register to add course" });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate course IDs and add only unique ones
    const validCourses = [];
    for (let courseId of courses) {
      const course = await Course.findById(courseId); // Validate course existence
      if (course && !user.cart.includes(courseId)) {
        validCourses.push(courseId); // Push valid and unique courses
      }
    }

    // If no valid courses are found
    if (validCourses.length === 0) {
      return res.status(400).json({ message: "No new valid courses to add" });
    }

    // Update user's cart by adding new courses
    user.cart.push(...validCourses);
    await user.save(); // Save the updated user document

    res.status(200).json({
      message: "Courses added to cart successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        cart: user.cart,
      },
    });
  } catch (err) {
    console.error("Error updating cart:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch user's courses (order history)
exports.getUserCourses = async (req, res) => {
  const { email } = req.query; // Get email from query params

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    // Find the user by email and populate the cart with course details
    const user = await User.findOne({ email }).populate("cart"); // Assumes 'cart' stores Course ObjectIDs

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User courses retrieved successfully",
      courses: user.cart, // Send the populated courses array
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
