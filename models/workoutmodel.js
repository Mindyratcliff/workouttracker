const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const workoutSchema = new Schema({
    day: {
        type: Date,
        default: Date.now
    },
    exercises: {
        type: String,
        name: String,
        duration: Number,
        weight: Number,
        reps: Number,
        sets: Number,
        distance: Number

    }
});

workoutSchema.methods.getLastWorkout = function () {
    this.lastWorkout = {
        day: Date.now(),
    };

    return this.lastWorkout;
}

workoutSchema.methods.addExercise = function () {
    this.set({
        
        day = Date.now(),
        exercises = {
            type: this.type,
            name: this.name,
            duration: this.duration,
            weight: this.weight,
            reps: this.reps,
            sets: this.sets,
            distance: this.distance
        }

    })
    
}

workoutSchema.methods.getWorkoutsInRange = function () {
    this.workoutsRange = this.aggregate([
        {
            $addFields: {
                totalWeight: { $sum: "$weight" } ,
                totalDuration: { $sum: "$duration" }
              }
        }
    ])
    return this.workoutsRange;
}


const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;
