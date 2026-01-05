require("dotenv").config();
const connectDB = require("./src/config/db");
const User = require("./src/models/User");

/**
 * Quick test script to verify password hashing
 * Tests that passwords are properly hashed when saving to database
 */
const testPasswordHashing = async () => {
  try {
    // Connect to database
    console.log("🔌 Connecting to database...");
    await connectDB();

    // Test data
    const testName = "Test User";
    const testEmail = `test-${Date.now()}@example.com`;
    const plainPassword = "testpassword123";

    console.log("\n📝 Creating test user...");
    console.log(`   Name: ${testName}`);
    console.log(`   Email: ${testEmail}`);
    console.log(`   Password: ${plainPassword}`);

    // Create new user
    const user = new User({
      name: testName,
      email: testEmail,
      password: plainPassword,
    });

    // Save user (password should be hashed automatically)
    await user.save();
    console.log("✅ User saved successfully!");

    // Retrieve user from database with password included
    const savedUser = await User.findById(user._id).select("+password");

    console.log("\n🔍 Verifying password hashing...");
    console.log(`   Saved password (in DB): ${savedUser.password}`);

    // Verify password is hashed (should start with $2b$ and not match plain text)
    if (savedUser.password.startsWith("$2b$") || savedUser.password.startsWith("$2a$")) {
      console.log("✅ Password is properly hashed (starts with bcrypt identifier)");
    } else {
      console.log("❌ Password is NOT hashed - security issue!");
      throw new Error("Password not hashed correctly");
    }

    // Verify password does NOT match plain text
    if (savedUser.password !== plainPassword) {
      console.log("✅ Password does NOT match plain text (correctly hashed)");
    } else {
      console.log("❌ Password matches plain text - NOT hashed!");
      throw new Error("Password was not hashed");
    }

    // Test password comparison method
    console.log("\n🔐 Testing comparePassword method...");
    const isMatch = await savedUser.comparePassword(plainPassword);
    if (isMatch) {
      console.log("✅ Password comparison works correctly!");
    } else {
      console.log("❌ Password comparison failed!");
      throw new Error("Password comparison failed");
    }

    // Test wrong password
    const isWrongMatch = await savedUser.comparePassword("wrongpassword");
    if (!isWrongMatch) {
      console.log("✅ Wrong password correctly rejected!");
    } else {
      console.log("❌ Wrong password was accepted - security issue!");
      throw new Error("Wrong password was accepted");
    }

    // Clean up test user
    console.log("\n🧹 Cleaning up test user...");
    await User.findByIdAndDelete(user._id);
    console.log("✅ Test user deleted");

    console.log("\n🎉 All tests passed! Password hashing works correctly.\n");

    // Close database connection
    await require("mongoose").connection.close();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    process.exit(1);
  }
};

// Run the test
testPasswordHashing();

