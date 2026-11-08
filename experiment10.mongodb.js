/**
 * ============================================================================
 * EXPERIMENT 10: WORKING WITH MONGODB USING SHELL COMMANDS
 * Web Technology Lab — Semester 5
 * Database: universityDB | Collection: students
 * ============================================================================
 * Execution:
 *   mongosh "mongodb://localhost:27017" experiment10.mongodb.js
 * ============================================================================
 */

console.log("============================================================================");
console.log("EXPERIMENT 10: MONGODB SHELL COMMANDS EXECUTION");
console.log("============================================================================");

// ============================================================================
// SECTION 1: DATABASE AND COLLECTION MANAGEMENT
// ============================================================================
console.log("\n--- [SECTION 1] Database and Collection Management ---");

// 1.1 List all databases on the cluster
console.log("\n[1.1] Listing all databases:");
const dbsResult = db.adminCommand({ listDatabases: 1 });
dbsResult.databases.forEach(d => console.log(`  - ${d.name} (${(d.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`));

// 1.2 Switch to or initialize the target database: 'universityDB'
// (In interactive mongosh: use universityDB)
const targetDB = db.getSiblingDB("universityDB");
console.log(`\n[1.2 & 1.3] Active database set to: ${targetDB.getName()}`);

// 1.4 Check for existing data and safely create 'students' collection
const existingCollections = targetDB.getCollectionNames();
if (existingCollections.includes("students")) {
    console.log("\n[1.4] 'students' collection already exists. Checking document count...");
    const count = targetDB.students.countDocuments();
    console.log(`      Found ${count} existing document(s).`);
    if (count > 0) {
        console.log("      Resetting collection data for a clean experiment run...");
        targetDB.students.drop();
        targetDB.createCollection("students");
        console.log("      Fresh 'students' collection created.");
    }
} else {
    console.log("\n[1.4] Creating collection 'students'...");
    targetDB.createCollection("students");
    console.log("      Collection 'students' created successfully.");
}

// 1.5 List collections in active database
// (In interactive mongosh: show collections)
console.log("\n[1.5] Collections in universityDB:");
targetDB.getCollectionNames().forEach(c => console.log(`  - ${c}`));


// ============================================================================
// SECTION 2: CREATE OPERATIONS
// ============================================================================
console.log("\n--- [SECTION 2] Create Operations ---");

// 2.1 Insert one student using insertOne()
console.log("\n[2.1] Inserting single student document using insertOne():");
const insertOneResult = targetDB.students.insertOne({
    student_id: 101,
    name: "Aarav Sharma",
    age: 20,
    major: "Computer Science",
    gpa: 3.85,
    skills: ["Python", "SQL", "JavaScript"],
    enrollmentDate: new Date("2023-08-15")
});
console.log("  Inserted ID:", insertOneResult.insertedId);

// 2.2 Insert three students using insertMany()
console.log("\n[2.2] Inserting three student documents using insertMany():");
const insertManyResult = targetDB.students.insertMany([
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
]);
console.log(`  Successfully inserted ${Object.keys(insertManyResult.insertedIds).length} documents.`);
console.log(`  Total student count: ${targetDB.students.countDocuments()}`);


// ============================================================================
// SECTION 3: READ OPERATIONS
// ============================================================================
console.log("\n--- [SECTION 3] Read Operations ---");

// 3.1 Retrieve all documents
console.log("\n[3.1] Retrieving all documents in 'students' collection:");
const allStudents = targetDB.students.find().toArray();
console.log(JSON.stringify(allStudents, null, 2));

// 3.2 Exact-match query for Computer Science students
console.log("\n[3.2] Exact-match query: Students with major = 'Computer Science':");
const csStudents = targetDB.students.find({ major: "Computer Science" }).toArray();
csStudents.forEach(s => console.log(`  - [${s.student_id}] ${s.name} (${s.major}) | GPA: ${s.gpa}`));

// 3.3 Comparison query using $gte (GPA >= 3.7)
console.log("\n[3.3] Comparison query: Students with GPA >= 3.70:");
const highGpaStudents = targetDB.students.find({ gpa: { $gte: 3.70 } }).toArray();
highGpaStudents.forEach(s => console.log(`  - [${s.student_id}] ${s.name} | GPA: ${s.gpa}`));

// 3.4 Logical $or query combined with array-value matching:
// Major is 'Information Technology' OR has 'Python' in skills array
console.log("\n[3.4] Logical $or query: major = 'Information Technology' OR skills contains 'Python':");
const orStudents = targetDB.students.find({
    $or: [
        { major: "Information Technology" },
        { skills: "Python" }
    ]
}).toArray();
orStudents.forEach(s => console.log(`  - [${s.student_id}] ${s.name} | Major: ${s.major} | Skills: ${s.skills.join(", ")}`));

// 3.5 Projection query: Displaying only name, gpa, and major (suppressing _id)
console.log("\n[3.5] Projection query: Displaying only { name, gpa, major } without _id:");
const projectedStudents = targetDB.students.find({}, { _id: 0, name: 1, gpa: 1, major: 1 }).toArray();
console.log(JSON.stringify(projectedStudents, null, 2));

// 3.6 Retrieve single document using findOne()
console.log("\n[3.6] Retrieve one student using findOne({ student_id: 101 }):");
const singleStudent = targetDB.students.findOne({ student_id: 101 });
console.log(JSON.stringify(singleStudent, null, 2));

// 3.7 Count matching documents using countDocuments()
const csCount = targetDB.students.countDocuments({ major: "Computer Science" });
console.log(`\n[3.7] Count of Computer Science students: ${csCount}`);


// ============================================================================
// SECTION 4: UPDATE OPERATIONS
// ============================================================================
console.log("\n--- [SECTION 4] Update Operations ---");

// 4.1 Update one student using $set (Update Aarav's GPA from 3.85 to 3.95)
console.log("\n[4.1] Updating student 101's GPA to 3.95 using $set:");
const updateOneResult = targetDB.students.updateOne(
    { student_id: 101 },
    { $set: { gpa: 3.95 } }
);
console.log(`  Matched: ${updateOneResult.matchedCount}, Modified: ${updateOneResult.modifiedCount}`);

// 4.2 Update multiple students using $push (Append 'Git' to skills for Computer Science students)
console.log("\n[4.2] Appending 'Git' to skills array for all Computer Science students using $push:");
const updateManyResult = targetDB.students.updateMany(
    { major: "Computer Science" },
    { $push: { skills: "Git" } }
);
console.log(`  Matched: ${updateManyResult.matchedCount}, Modified: ${updateManyResult.modifiedCount}`);

// 4.3 Increment a student's age using $inc (Increment Bhavna's age by 1)
console.log("\n[4.3] Incrementing student 102's age by 1 using $inc:");
const incResult = targetDB.students.updateOne(
    { student_id: 102 },
    { $inc: { age: 1 } }
);
console.log(`  Matched: ${incResult.matchedCount}, Modified: ${incResult.modifiedCount}`);

// 4.4 Display updated documents to verify changes
console.log("\n[4.4] Verifying updated documents (student_id: 101, 102, 103):");
const updatedStudents = targetDB.students.find(
    { student_id: { $in: [101, 102, 103] } },
    { _id: 0, student_id: 1, name: 1, age: 1, gpa: 1, skills: 1 }
).toArray();
console.log(JSON.stringify(updatedStudents, null, 2));


// ============================================================================
// SECTION 5: INDEXING
// ============================================================================
console.log("\n--- [SECTION 5] Indexing ---");

// 5.1 Create unique ascending index on student_id
console.log("\n[5.1] Creating unique ascending index on 'student_id':");
const indexName = targetDB.students.createIndex({ student_id: 1 }, { unique: true });
console.log(`  Index created: ${indexName}`);

// 5.2 Display indexes using getIndexes()
console.log("\n[5.2] Displaying indexes on 'students' collection using getIndexes():");
const indexes = targetDB.students.getIndexes();
console.log(JSON.stringify(indexes, null, 2));

// 5.3 Demonstrate that index exists and functions (Query Execution Stats)
console.log("\n[5.3] Demonstrating index usage with explain('executionStats'):");
const explainStats = targetDB.students.find({ student_id: 101 }).explain("executionStats");
const stage = explainStats.executionStats.executionStages.stage;
console.log(`  Query Plan Stage: ${stage} (Expected: IXSCAN or FETCH over IXSCAN)`);
console.log(`  Total Keys Examined: ${explainStats.executionStats.totalKeysExamined}`);
console.log(`  Total Docs Examined: ${explainStats.executionStats.totalDocsExamined}`);


// ============================================================================
// SECTION 6: DELETE OPERATIONS
// ============================================================================
console.log("\n--- [SECTION 6] Delete Operations ---");

// 6.1 Delete one student using deleteOne() (Delete Divya Nair, student_id: 104)
console.log("\n[6.1] Deleting student_id: 104 using deleteOne():");
const deleteOneResult = targetDB.students.deleteOne({ student_id: 104 });
console.log(`  Deleted count: ${deleteOneResult.deletedCount}`);

// 6.2 Delete matching students using deleteMany() with $lt (Delete students with gpa < 3.70)
console.log("\n[6.2] Deleting students with GPA < 3.70 using deleteMany() with $lt:");
const deleteManyResult = targetDB.students.deleteMany({ gpa: { $lt: 3.70 } });
console.log(`  Deleted count: ${deleteManyResult.deletedCount}`);

// 6.3 Verify remaining documents in collection
console.log("\n[6.3] Verifying remaining documents in 'students' collection:");
const remainingDocs = targetDB.students.find({}, { _id: 0, student_id: 1, name: 1, major: 1, gpa: 1, age: 1 }).toArray();
console.log(JSON.stringify(remainingDocs, null, 2));
console.log(`\nRemaining student count: ${targetDB.students.countDocuments()}`);


// ============================================================================
// SECTION 7: CLEANUP (OPTIONAL / POST-VERIFICATION)
// ============================================================================
console.log("\n--- [SECTION 7] Cleanup Instructions ---");
console.log("NOTE: Destructive cleanup commands are NOT executed automatically.");
console.log("To drop the collection or database after taking viva screenshots, run manually:");
console.log("  targetDB.students.drop();");
console.log("  targetDB.dropDatabase();");

console.log("\n============================================================================");
console.log("ALL EXPERIMENT 10 MONGODB SHELL OPERATIONS COMPLETED SUCCESSFULLY!");
console.log("============================================================================");
