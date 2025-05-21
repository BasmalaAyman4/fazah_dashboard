import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Define schemas
const sportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const instructorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  description: { type: String },
  image: { type: String },
  sports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sport" }],
  schedules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Schedule" }],
  specialties: [{ type: String }],
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  joinDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  description: { type: String },
  image: { type: String },
  schedules: [{ type: mongoose.Schema.Types.ObjectId, ref: "Schedule" }],
  specialties: [{ type: String }],
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  joinDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const workshopSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  duration: { type: Number },
  price: { type: Number },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const specialProgramSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  duration: { type: Number },
  price: { type: Number },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const specialist2Schema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  label: { type: String },
  image: { type: String },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const packageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  sport: { type: String, required: true },
  type: { type: String, enum: ["private", "regular"], required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const scheduleSchema = new mongoose.Schema({
  day: { type: String, required: true },
  date: { type: Date, required: true },
  month: { type: Number, required: true },
  dayOfMonth: { type: Number, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  activityType: {
    type: String,
    enum: ["Sport", "Workshop", "SpecialProgram"],
    required: true,
  },
  activity: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor",
    required: false,
  },
  maximumParticipants: { type: Number, default: 0 },
  showParticipants: { type: Boolean, default: false },
  showInstructor: { type: Boolean, default: false },
  showPrice: { type: Boolean, default: false },
  price: { type: Number, default: 0 },
  isPrivate: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["active", "inactive", "completed", "canceled"],
    default: "active",
  },
  delegatedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor",
    default: null,
  },
  delegatedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Instructor",
    default: null,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Delete existing models if they exist
delete mongoose.models.Sport;
delete mongoose.models.Instructor;
delete mongoose.models.Client;
delete mongoose.models.Workshop;
delete mongoose.models.SpecialProgram;
delete mongoose.models.Schedule;
delete mongoose.models.Specialist2;
delete mongoose.models.Package;
delete mongoose.models.User;

// Create models
export const Sport =
  mongoose.models.Sport || mongoose.model("Sport", sportSchema);
export const Instructor =
  mongoose.models.Instructor || mongoose.model("Instructor", instructorSchema);
export const Client =
  mongoose.models.Client || mongoose.model("Client", clientSchema);
export const Workshop =
  mongoose.models.Workshop || mongoose.model("Workshop", workshopSchema);
export const SpecialProgram =
  mongoose.models.SpecialProgram ||
  mongoose.model("SpecialProgram", specialProgramSchema);
export const Specialist2 =
  mongoose.models.Specialist2 ||
  mongoose.model("Specialist2", specialist2Schema);
export const Package =
  mongoose.models.Package || mongoose.model("Package", packageSchema);
export const Schedule =
  mongoose.models.Schedule || mongoose.model("Schedule", scheduleSchema);
export const User = mongoose.models.User || mongoose.model("User", userSchema);
