const cors = require('cors');
const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const multer = require('multer');
const express = require('express');
/* siam */
const uploadGoogleDriveRoute = require('./routes/UploadGoogleDrive');
const uploadPdfToDrive = require('./utils/GooglePdfUploader');
const studentRoutes = require('./routes/students');
const teachersRoutes = require('./routes/teachers');
/* commetn */
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

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

// Token middleware
const verifyToken = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).send({ message: 'unauthorized access' });

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(401).send({ message: 'unauthorized access' });
    req.user = decoded;
    next();
  });
};

async function run() {
  try {
    await client.connect();

    const db = client.db('allNotice');
    const noticesCollection = db.collection('notices');
    const studentsCollection = db.collection('students');
    const teachersCollection = db.collection('teachers');
    const routinesCollection = db.collection('routines');
    const resultCollection = db.collection('results');
    // Auth APIs
    app.post('/jwt', async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '365d' });
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      }).send({ success: true });
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
    app.post('/notices', async (req, res) => {
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
    app.use('/students', studentRouter);

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
    app.get("/students/:studentId", async (req, res) => {
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
    app.put('/update-rolls', async (req, res) => {
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
app.post('/upload-results', async (req, res) => {
   
    const { results, exam, year } = req.body;

    if (!results || !exam || !year) {
        return res.status(400).json({
            success: false,
            message: 'Missing results, exam, or year in request body'
        });
    }

    try {
        const bulkOps = results.map(result => {
            const { studentId,  newRoll, oldRoll, result: subjects } = result;

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
  // if (updateData.profileImageUrl !== undefined) {
  //   finalUpdateData.profileImageUrl = updateData.profileImageUrl;
  // }
  // if (updateData.documents !== undefined) {
  //   finalUpdateData.documents = updateData.documents; // Assuming documents is an array of objects
  // }
  // if (updateData.birthCertificatePdfRaw !== undefined) {
  //   finalUpdateData.birthCertificatePdfRaw = updateData.birthCertificatePdfRaw;
  // }
  // if (updateData.admissionPdfRaw !== undefined) {
  //   finalUpdateData.admissionPdfRaw = updateData.admissionPdfRaw;
  // }
 
  // Add other fields here if they can be updated, e.g., session, etc.

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
