# Web Technology Lab — Experiment 10: Working with MongoDB Using Shell Commands

## Overview
This experiment demonstrates core MongoDB database operations using the MongoDB Shell (`mongosh`) against a local MongoDB server instance. All operations are performed on the `universityDB` database within the `students` collection using standard MongoDB BSON/JSON document models.

---

## Prerequisites
1. **MongoDB Server (`mongod`):** Running locally on port `27017`.
2. **MongoDB Shell (`mongosh`):** Version `2.x+` installed and accessible in the system PATH.
   ```powershell
   mongosh --version
   ```

---

## Project Structure
```text
exp10/
├── experiment10.mongodb.js   # Automated, fully-commented MongoDB Shell script
├── README.md                 # Lab execution manual and viva reference guide
└── Record Template.docx      # Lab record document template (preserved)
```

---

## Execution Guide

### Method A: Automated Execution (Single Command)
Run the entire practical script directly from PowerShell or Command Prompt:

```powershell
# Navigate to the Experiment 10 folder
cd "D:\yasmin programs\SEM 5\WT Lab\exp10"

# Execute the script using mongosh against the local instance
mongosh "mongodb://localhost:27017" experiment10.mongodb.js
```

---

### Method B: Interactive Shell Execution (Viva / Step-by-Step)
Start the interactive shell:
```powershell
mongosh "mongodb://localhost:27017"
```

Once connected, run each section step by step:

#### 1. Database and Collection Management
```javascript
// List all databases
show dbs

// Switch to (or create) target database
use universityDB

// Check active database
db

// Explicitly create students collection
db.createCollection("students")

// List collections in active database
show collections
```

#### 2. Create Operations
```javascript
// 2.1 Insert a single document
db.students.insertOne({
  student_id: 101,
  name: "Aarav Sharma",
  age: 20,
  major: "Computer Science",
  gpa: 3.85,
  skills: ["Python", "SQL", "JavaScript"],
  enrollmentDate: new Date("2023-08-15")
})

// 2.2 Insert multiple documents
db.students.insertMany([
  {
    student_id: 102,
    name: "Bhavna Patel",
    age: 21,
    major: "Information Technology",
    gpa: 3.65,
    skills: ["Java", "HTML", "CSS"],
    enrollmentDate: new Date("2022-08-15")
  },
  {
    student_id: 103,
    name: "Chetan Kumar",
    age: 22,
    major: "Computer Science",
    gpa: 3.92,
    skills: ["C++", "Python", "Docker"],
    enrollmentDate: new Date("2021-08-15")
  },
  {
    student_id: 104,
    name: "Divya Nair",
    age: 19,
    major: "Data Science",
    gpa: 3.40,
    skills: ["R", "Python", "Tableau"],
    enrollmentDate: new Date("2024-08-15")
  }
])
```

#### 3. Read Operations
```javascript
// 3.1 Retrieve all documents formatted nicely
db.students.find()

// 3.2 Exact-match query
db.students.find({ major: "Computer Science" })

// 3.3 Comparison query ($gte)
db.students.find({ gpa: { $gte: 3.70 } })

// 3.4 Logical $or with array element matching
db.students.find({
  $or: [
    { major: "Information Technology" },
    { skills: "Python" }
  ]
})

// 3.5 Projection query (suppressing _id)
db.students.find({}, { _id: 0, name: 1, gpa: 1, major: 1 })

// 3.6 Retrieve single document
db.students.findOne({ student_id: 101 })

// 3.7 Count documents matching criteria
db.students.countDocuments({ major: "Computer Science" })
```

#### 4. Update Operations
```javascript
// 4.1 Update single document using $set
db.students.updateOne(
  { student_id: 101 },
  { $set: { gpa: 3.95 } }
)

// 4.2 Append array value using $push across multiple documents
db.students.updateMany(
  { major: "Computer Science" },
  { $push: { skills: "Git" } }
)

// 4.3 Increment numeric value using $inc
db.students.updateOne(
  { student_id: 102 },
  { $inc: { age: 1 } }
)

// 4.4 Verify updates
db.students.find({ student_id: { $in: [101, 102, 103] } })
```

#### 5. Indexing Operations
```javascript
// 5.1 Create unique ascending index on student_id
db.students.createIndex({ student_id: 1 }, { unique: true })

// 5.2 Display all indexes on the collection
db.students.getIndexes()

// 5.3 Demonstrate index utilization via executionStats
db.students.find({ student_id: 101 }).explain("executionStats")
```

#### 6. Delete Operations
```javascript
// 6.1 Delete one document
db.students.deleteOne({ student_id: 104 })

// 6.2 Delete multiple documents using comparison operator ($lt)
db.students.deleteMany({ gpa: { $lt: 3.70 } })

// 6.3 Verify remaining documents
db.students.find()
db.students.countDocuments()
```

---

## Destructive Cleanup (Post-Verification Only)
> [!IMPORTANT]
> Do NOT execute destructive cleanup until all required screenshots and verification outputs have been recorded for your lab record!

```javascript
// Remove the collection
db.students.drop()

// Remove the database
db.dropDatabase()
```

---

## Operations Checklist

- [x] Database creation & switching (`use universityDB`)
- [x] Collection creation (`createCollection("students")`)
- [x] Single document insert (`insertOne()`)
- [x] Bulk document insert (`insertMany()`)
- [x] Full collection read (`find()`)
- [x] Exact-match filtering (`{ major: "Computer Science" }`)
- [x] Comparison query (`$gte`)
- [x] Compound logical query (`$or` + array matching)
- [x] Field projection (`{ _id: 0, name: 1, gpa: 1, major: 1 }`)
- [x] Single document retrieval (`findOne()`)
- [x] Document counting (`countDocuments()`)
- [x] Field update (`$set`)
- [x] Array append update (`$push`)
- [x] Numeric increment update (`$inc`)
- [x] Unique ascending index creation (`createIndex({ student_id: 1 }, { unique: true })`)
- [x] Index inspection (`getIndexes()`)
- [x] Query plan verification (`explain("executionStats")`)
- [x] Single document delete (`deleteOne()`)
- [x] Bulk condition delete (`deleteMany({ gpa: { $lt: ... } })`)
- [x] Remaining state verification
