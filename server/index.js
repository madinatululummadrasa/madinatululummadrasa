const cors = require('cors');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const multer = require('multer');
const upload = multer(); // uses memory storage (suitable for imgbb)
const express = require('express');
const bcrypt = require('bcrypt');
const uploadGoogleDriveRoute = require('./routes/UploadGoogleDrive');
const uploadPdfToDrive = require('./utils/GooglePdfUploader');
const studentRoutes = require('./routes/students');
const teachersRoutes = require('./routes/teachers');
dotenv.config();
const app = express();
const port = process.env.PORT || 8000;
const SECRET_KEY = 'your_secret_key';
const axios = require('axios');
const FormData = require('form-data'); // ✅ Add this at the top
const admin = require('firebase-admin');
const serviceAccount = require('./madinatul-ulum-madrasa-firebase-adminsdk-fbsvc-c1492ac861.json');
// ...
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

// NEW: Firebase ID Token verification middleware
const verifyFirebaseToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Unauthorized: No token provided or invalid format' });
  }

  const idToken = authHeader.split(' ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken; // Attach decoded Firebase user info
    next();
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error.message);
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).send({ message: 'Unauthorized: Session expired. Please log in again.' });
    }
    return res.status(403).send({ message: 'Unauthorized: Invalid token' });
  }
};


// Middleware
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// MongoDB setup
const uri = "mongodb+srv://maftun:siam1212@cluster0.cqz9g7e.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});


async function run() {
  try {
    await client.connect();

    const db = client.db('allNotice');
    const noticesCollection = db.collection('notices');
    const studentsCollection = db.collection('students');
    const teachersCollection = db.collection('teachers');
    const routinesCollection = db.collection('routines');
    const resultCollection = db.collection('results');
    const usersCollection = db.collection('users');


    app.get('/api/profile', verifyFirebaseToken, async (req, res) => {
      console.log('Accessing protected profile route for Firebase user:', req.user.email, 'UID:', req.user.uid);

      // Attempt to find the user in your MongoDB collection
      const userInDb = await usersCollection.findOne({ email: req.user.email });

      if (!userInDb) {
        // If the Firebase authenticated user doesn't exist in your DB, you might:
        // 1. Create a new user entry in your DB here.
        // 2. Return a specific message that the user is authenticated via Firebase
        //    but their profile data isn't in your local database yet.
        console.log('Firebase user found, but no matching entry in local DB.');
        return res.status(200).json({
          message: 'Firebase user authenticated, but no local profile data found.',
          firebaseUser: { uid: req.user.uid, email: req.user.email, name: req.user.name || req.user.displayName || 'N/A' },
        });
      }

      res.json({
        message: 'Protected data for Firebase authenticated user',
        firebaseUser: { uid: req.user.uid, email: req.user.email, name: req.user.name || req.user.displayName || 'N/A' },
        dbUser: { _id: userInDb._id, username: userInDb.username, email: userInDb.email } // Example data from your DB
      });
    });

    // imgBB image upload 
    app.post('/upload-img', upload.single('image'), async (req, res) => {
      try {
        if (!req.file) {
          console.error("⚠️ No file received in request");
          return res.status(400).send({ success: false, error: "No image file provided" });
        }

        console.log("📸 Received file:", req.file);

        // Convert the image buffer to base64 and upload to imgbb
        const imageBuffer = req.file.buffer;
        const formData = new FormData();
        formData.append('image', imageBuffer.toString('base64'));
        const imgbbKey = '7241ee19d145a9d8a44d7a27d6d0874a';
        const response = await axios.post(
          `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
          formData,
          { headers: formData.getHeaders(), }
        );
        res.send({ success: true, data: response.data.data });
      } catch (error) {
        console.error('❌ Backend upload to imgbb failed:', error.response?.data || error.message);
        res.status(500).send({ success: false, error: 'Image upload failed' });
      }
    });




    //  New user post
    app.post('/users', async (req, res) => {
      const user = req.body; // { name, email, role }
      const exists = await usersCollection.findOne({ email: user.email });
      if (exists) return res.send({ message: 'Already Exists' });

      const result = await usersCollection.insertOne(user);
      res.send(result);
    });

// Get a single user by email
app.get('/users/:email', async (req, res) => {
  const email = req.params.email;

  try {
    const user = await usersCollection.findOne({ email }); // ✅ findOne returns a single document, not a cursor

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.send(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send({ message: 'Server error' });
  }
});



    // Get all users
    app.get('/users', async (req, res) => {
      try {
        const users = await usersCollection.find().toArray(); // ✅ Use find() to get all users
        res.send(users);
      } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({ message: 'Server error' });
      }
    });


    app.patch('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  const updateFields = {};
  if (name) updateFields.name = name;
  if (email) updateFields.email = email;
  if (role) updateFields.role = role;

  const result = await usersCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateFields }
  );

  if (result.modifiedCount > 0) {
    res.send({ success: true });
  } else {
    res.status(400).send({ message: "No change made" });
  }
});


    // // JWT Route for Firebase Authenticated Users
    app.post('/jwt', async (req, res) => {
      const { email } = req.body;
      const user = await usersCollection.findOne({ email }); // ✅ Find user in DB

      const token = jwt.sign(
        { email: user.email, role: user.role }, // ✅ Payload
        'your_secret_key',                      // 🔒 Secret key
        { expiresIn: '1h' }                     // ⏰ Token expires in 1 hour
      );
      console.log('JWT generated for user:', email, ":", token);
      res.send({ token }); // 🎯 Send token back to frontend
    });

    // Signup Route
    app.post('/api/signup', async (req, res) => {
      const { username, password } = req.body;
      if (!username || !password) return res.status(400).json({ message: 'Username and password are required' });
      try {
        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
          return res.status(400).json({ message: 'Username already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await usersCollection.insertOne({ username, password: hashedPassword });
        const user = { id: result.insertedId, username };
        res.status(201).json({ message: 'Signup successful', user });
      } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });

    // Login Route - REMOVE/COMMENT OUT IF ONLY USING FIREBASE
    app.post('/api/login', async (req, res) => {
      const { username, password } = req.body;
      if (!username || !password) return res.status(400).json({ message: 'Username and password are required' });
      try {
        const user = await usersCollection.findOne({ username });
        if (!user) return res.status(401).json({ message: 'User not found' });
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ message: 'Invalid password' });
        // IMPORTANT: If you keep this, ensure SECRET_KEY is from process.env
        const token = jwt.sign({ id: user._id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' }); // Using process.env.ACCESS_TOKEN_SECRET here!
        res.json({ message: 'Login successful', token });
      } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
      }
    });

    // Middleware to verify token
    function verifyToken(req, res, next) {
      const authHeader = req.headers['authorization'];
      const token = authHeader?.split(' ')[1];

      if (!token) return res.status(403).json({ message: 'Token required' });

      jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
      });
    }

    // Protected route - NOW USE verifyFirebaseToken
    app.get('/api/profile', verifyFirebaseToken, async (req, res) => {
      // req.user will contain decoded Firebase ID token info (uid, email, displayName etc.)
      console.log('Accessing protected profile route for Firebase user:', req.user.email);
      const userInDb = await usersCollection.findOne({ email: req.user.email }); // Assuming 'usersCollection' stores email
      if (!userInDb) {
        // Optional: Create a user entry in your DB if it doesn't exist, linked by Firebase UID/email
        console.log('Firebase user not found in local DB, consider creating entry.');
        return res.status(404).json({ message: 'User data not found in DB for Firebase user.' });
      }
      res.json({
        message: 'Protected data for Firebase authenticated user',
        firebaseUser: { uid: req.user.uid, email: req.user.email, name: req.user.name || req.user.displayName },
        dbUser: { id: userInDb._id, username: userInDb.username, email: userInDb.email } // Assuming your DB user also has email
      });
    });

    app.get('/logout', async (req, res) => {
      res.clearCookie('token', {
        maxAge: 0,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      }).send({ success: true });
    });

    // Google Drive Upload
    app.use('/upload-google-drive', uploadGoogleDriveRoute);
    app.post('/upload-drive', async (req, res) => {
      const { localPath, fileName } = req.body;
      try {
        const uploaded = await uploadPdfToDrive(localPath, fileName);
        res.send(uploaded);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Google Drive upload failed' });
      }
    });

    // Notices API
    app.post('/notices', verifyFirebaseToken, async (req, res) => {
      try {
        const result = await noticesCollection.insertOne(req.body);
        res.send(result);
      } catch (error) {
        console.error('Notice insert error:', error);
        res.status(500).send({ message: 'Failed to save notice' });
      }
    });

    app.get('/notices', async (req, res) => {
      const cursor = noticesCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });



    // POST /routines - Save a new routine
    app.post("/routines", async (req, res) => {
      try {
        const routine = req.body; // should match the payload you sent
        const result = await routinesCollection.insertOne(routine);
        res.send(result);
      } catch (error) {
        console.error("Routine POST error:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    // Get all routine titles
    app.get("/routines", async (req, res) => {
      const routines = await routinesCollection.find({}, { projection: { title: 1 } }).toArray();
      res.send(routines);
    });

    // Get a specific routine by ID
    app.get("/routines/:id", async (req, res) => {
      const id = req.params.id;
      const routine = await routinesCollection.findOne({ _id: new ObjectId(id) });
      res.send(routine);
    });


    // Students API
    const studentRouter = studentRoutes(db); // passing db directly
    app.use('/students', verifyFirebaseToken, studentRouter);

    // Techers API
    const teachersRouter = teachersRoutes(db); // passing db directly
    app.use('/teachers', teachersRouter);


    app.get("/jonobal/techers-details/:teachersId", async (req, res) => {
      try {
        const { teachersId } = req.params;

        const teacher = await teachersCollection.findOne({ teachersId }); // ✅ use custom field

        if (!teacher) return res.status(404).json({ message: "Teacher not found" });

        res.json(teacher);
      } catch (err) {
        console.error("Error fetching student by teachersId:", err);
        res.status(500).json({ error: "Server error" });
      }
    });

    // TEMP route to debug student data
    app.get("/debug-students", async (req, res) => {
      const all = await studentsCollection.find().toArray();
      res.send(all);
    });
    // get next student id for adding new student form auto fillup
    app.get("/students/next-id", async (req, res) => {

      try {
        const students = await studentsCollection.find({}, { projection: { studentId: 1 } }).toArray();

        if (!students || students.length === 0) {
          // 🟢 No students in DB yet, start with M01
          return res.json({ nextId: 'M01' });
        }

        const numbers = students.map(s => {
          const match = s.studentId.match(/\d+/);
          return match ? parseInt(match[0], 10) : 0;
        });

        const max = numbers.length ? Math.max(...numbers) : 0;
        const nextNumber = max + 1;
        const nextId = 'M' + String(nextNumber).padStart(2, '0');

        res.json({ nextId });
      } catch (err) {
        console.error('Error generating next studentId:', err);
        res.status(500).json({ error: 'Something went wrong' });
      }
    });
    // get students
    app.get("/students/:studentId", verifyFirebaseToken, async (req, res) => {
      try {
        const { studentId } = req.params;
        const student = await studentsCollection.findOne({ studentId }); // ✅ use custom field

        if (!student) return res.status(404).json({ message: "Student not found" });

        res.json(student);
      } catch (err) {
        console.error("Error fetching student by studentId:", err);
        res.status(500).json({ error: "Server error" });
      }
    });

    // Update student roll
    app.put('/update-rolls', verifyFirebaseToken, async (req, res) => {
      const updates = req.body; // Array of { studentId, newRoll }
      console.log(updates);
      try {
        let modifiedCount = 0;

        for (let item of updates) {
          const result = await studentsCollection.updateOne(
            { studentId: item.studentId },
            { $set: { roll: item.newRoll } }
          );
          modifiedCount += result.modifiedCount;
        }

        res.status(200).json({
          success: true,
          message: `Updated ${modifiedCount} student roll(s)`
        });
      } catch (err) {
        res.status(500).json({
          success: false,
          message: 'Error updating rolls',
          error: err.message
        });
      }
    });

    console.log("📥 GET /students/next-id hit"); // Add this line for confirmation


    // Upload results
    app.post('/upload-results', verifyFirebaseToken, async (req, res) => {

      const { results, exam, year } = req.body;

      if (!results || !exam || !year) {
        return res.status(400).json({
          success: false,
          message: 'Missing results, exam, or year in request body'
        });
      }

      try {
        const bulkOps = results.map(result => {
          const { studentId, newRoll, oldRoll, result: subjects } = result;

          const updatePath = `detailedResults.${year}.${exam}`;

          return {
            updateOne: {
              filter: { studentId: studentId },
              update: {
                $set: {
                  // These fields will be set/updated if studentId exists or on creation

                  // You might also want to include class and session here if they are part of student schema
                  // For instance: class: result.class, session: result.session
                  [updatePath]: { // Dynamically set the nested path
                    newRoll: newRoll,
                    originalRoll: oldRoll,
                    subjects: subjects // This is the object containing subject-wise marks
                  }
                }
              },
              upsert: true // Create the document if it doesn't exist
            }
          };
        });

        const bulkResult = await studentsCollection.bulkWrite(bulkOps);

        res.status(200).json({
          success: true,
          message: 'Results uploaded successfully with nested structure',
          data: bulkResult
        });

      } catch (error) {
        console.error('Error uploading results:', error);
        res.status(500).json({
          success: false,
          message: 'Error uploading results',
          error: error.message
        });
      }
    });

    app.put('/students/:studentId', async (req, res) => {
      const { studentId } = req.params;
      const updateData = req.body;
      console.log("Update Data:", updateData); // Log the incoming update data for debugging

      const finalUpdateData = {};
      if (updateData.name !== undefined) {
        finalUpdateData.name = updateData.name;
      }
      if (updateData.roll !== undefined) {
        finalUpdateData.roll = updateData.roll;
      }
      if (updateData.class !== undefined) { // Make sure to include 'class' if it's meant to be updated
        finalUpdateData.class = updateData.class;
      }

      if (updateData.session !== undefined) {
        finalUpdateData.session = updateData.session;
      }
      if (updateData.group !== undefined) {

        finalUpdateData.group = updateData.group;
      }
      if (updateData.admissionDate !== undefined) {
        finalUpdateData.admissionDate = updateData.admissionDate;
      }
      if (updateData.phone !== undefined) {
        finalUpdateData.phone = updateData.phone;
      }
      if (updateData.guardianName !== undefined) {

        finalUpdateData.guardianName = updateData.guardianName;
      }
      if (updateData.address !== undefined) {
        finalUpdateData.address = updateData.address;
      }

      if (updateData.studentId !== undefined) {
        finalUpdateData.studentId = updateData.studentId;
      }


      try {
        const result = await studentsCollection.updateOne(
          { _id: new ObjectId(studentId) }, // <--- THIS IS THE KEY FIX: Filter by _id
          { $set: finalUpdateData },
          { upsert: false } // Change to false if you only want to update existing documents
          // If you want to insert if not found, keep it true but ensure your client
          // sends all necessary data for a new student if upsert is intended.
          // For an 'update' endpoint, typically upsert: false is desired.
        );

        if (result.matchedCount === 0) { // Check if a document was found to update
          return res.status(404).json({ message: 'Student not found' });
        }

        // Check if anything was actually modified
        if (result.modifiedCount === 0 && result.upsertedCount === 0) {
          return res.status(200).json({ message: 'No changes made to student data or student not found and not upserted', result });
        }


        res.status(200).json({ message: 'Student updated successfully', result });
      } catch (error) {
        console.error('Error updating student:', error);
        // More specific error handling could be added here, e.g., for invalid ObjectId
        res.status(500).json({ error: 'Failed to update student' });
      }
    });



    app.get('/results', async (req, res) => {
      try {
        const results = await resultCollection.find().toArray();
        res.status(200).json(results);
      } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).json({ error: 'Failed to fetch results' });
      }
    });



    // Update result
    app.patch("/students/result/:studentId", async (req, res) => {
      const { studentId } = req.params;
      const { year, exam, marks } = req.body;

      try {
        const student = await studentsCollection.findOne({ studentId });

        if (!student) return res.status(404).send({ message: "Student not found" });

        // Prepare the dynamic path to update
        const updatePath = `results.${year}.${exam}`;
        const result = await studentsCollection.updateOne(
          { studentId },
          { $set: { [updatePath]: marks } }
        );

        res.send(result);
      } catch (err) {
        console.error("Error updating result:", err);
        res.status(500).send({ message: "Failed to update result" });
      }
    });


    // addd attendnece

    app.patch("/students/attendance/:studentId", async (req, res) => {
      const { studentId } = req.params;
      const { year, attendanceData } = req.body;

      try {
        const student = await studentsCollection.findOne({ studentId });

        if (!student) return res.status(404).send({ message: "Student not found" });

        // Merge logic
        const existingData = student.attendence?.[year] || {};
        const mergedData = { ...existingData, ...attendanceData };

        const update = {
          [`attendence.${year}`]: mergedData,
        };

        const result = await studentsCollection.updateOne(
          { studentId },
          { $set: update }
        );

        res.send(result);
      } catch (err) {
        console.error("Error updating attendance:", err);
        res.status(500).send({ message: "Failed to update attendance" });
      }
    });


    console.log('✅ Successfully connected to MongoDB.');
    app.listen(port, () => {
      console.log(`✅ StayVista is running on port ${port}`);
    });


  } catch (err) {
    console.error('❌ MongoDB connection failed:', err);
  }
}

run();

app.get('/', (req, res) => {
  res.send('Hello from StayVista Server..');
});
