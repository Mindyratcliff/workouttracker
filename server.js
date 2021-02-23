//Dependencies
const express = require("express");
const mongojs = require("mongojs");
const logger = require("morgan");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

//Including Morgan Logger for debugging

app.use(logger("dev"));

//Middleware

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

//Declare db and collection

const databaseUrl = "fitnesstracker";
const collections = ["workouts"];

const db = mongojs(databaseUrl, collections);

//Error handling

db.on("error", (error) => {
  console.log("Database Error:", error);
});

//Routes

//Index route

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "./public/index.html"));
});

//Exercise route

app.get("/exercise", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/exercise.html"));
});

//Stats route

app.get("/stats", (req, res) => {
  res.sendFile(path.join(__dirname + "/public/stats.html"));
});

app.get("/api/workouts/range", (req, res) => {
  db.workouts.aggregate([
    {
      $addFields: {
        totalDuration: { $sum: "$duration" },
        totalWeight: {$sum: "$weight"}
      },
    },
  ]);
});

app.post("/api/workouts", (req, res) => {
  console.log(req.body);

  db.workouts.insertOne(req.body, (error, data) => {
    if (error) {
      res.send(error);
    } else {
      res.send(data);
    }
  });
});

//Get all route

app.get("/api/workouts", (req, res) => {
  db.workouts.find({}).populate("workouts", (error, data) => {
    if (error) {
      res.send(error);
    } else {
      res.send(data);
    }
})
});

//ID get route

app.get("/api/workouts/:id", (req, res) => {
  db.workouts.findOne(
    {
      _id: mongojs.ObjectId(req.params.id),
    },
    (error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.send(data);
      }
    }
  );
});

app.put("/api/workouts/:id", (req, res) => {
  db.workouts.update(
    {
      _id: mongojs.ObjectId(req.params.id),
    },
    {
      $set: {
        type: req.body.type,
        name: req.body.name,
        duration: req.body.duration,
        weight: req.body.weight,
        reps: req.body.reps,
        sets: req.body.sets,
        modified: Date.now(),
      },
    },
    (error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.send(data);
      }
    }
  );
});

//Delete by ID route

app.delete("/api/delete/:id", (req, res) => {
  db.workouts.remove(
    {
      _id: mongojs.ObjectID(req.params.id),
    },
    (error, data) => {
      if (error) {
        res.send(error);
      } else {
        res.send(data);
      }
    }
  );
});

//Delete all route

app.delete("/clearall", (req, res) => {
  db.workouts.remove({}, (error, response) => {
    if (error) {
      res.send(error);
    } else {
      res.send(response);
    }
  });
});

//Server is listening

app.listen(3000, () => {
  console.log("App running on " + PORT);
});
