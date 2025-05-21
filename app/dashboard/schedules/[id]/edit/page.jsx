"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import {
  Sport,
  Instructor,
  Workshop,
  SpecialProgram,
  Schedule,
} from "@/lib/mongoose";
import { connectDB } from "@/lib/mongoose";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function EditSchedulePage({ params }) {
  const paramsObj = use(params);
  const { id } = paramsObj;
  const scheduleId = id;

  if (!scheduleId) {
    return <div>Schedule not found</div>;
  }

  const router = useRouter();
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sports, setSports] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [specialPrograms, setSpecialPrograms] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await connectDB();
        const scheduleData = await Schedule.findById(scheduleId)
          .populate("instructor")
          .populate("activity");
        setSchedule(scheduleData);

        // Fetch related data
        const [
          sportsData,
          instructorsData,
          workshopsData,
          specialProgramsData,
        ] = await Promise.all([
          Sport.find({ status: "active" }),
          Instructor.find({ status: "active" }),
          Workshop.find({ status: "active" }),
          SpecialProgram.find({ status: "active" }),
        ]);

        setSports(sportsData);
        setInstructors(instructorsData);
        setWorkshops(workshopsData);
        setSpecialPrograms(specialProgramsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load schedule data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [scheduleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await connectDB();
      const updatedSchedule = await Schedule.findByIdAndUpdate(
        scheduleId,
        {
          day: schedule.day,
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          activityType: schedule.activityType,
          activity: schedule.activity,
          instructor: schedule.instructor,
          status: schedule.status,
        },
        { new: true }
      );

      if (updatedSchedule) {
        toast.success("Schedule updated successfully");
        router.push("/dashboard/schedules");
      } else {
        toast.error("Failed to update schedule");
      }
    } catch (error) {
      console.error("Error updating schedule:", error);
      toast.error("Failed to update schedule");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!schedule) {
    return <div>Schedule not found</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Schedule</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="day">Day</Label>
          <Input
            id="day"
            value={schedule.day}
            onChange={(e) => setSchedule({ ...schedule, day: e.target.value })}
            required
          />
        </div>

        <div>
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="time"
            value={schedule.startTime}
            onChange={(e) =>
              setSchedule({ ...schedule, startTime: e.target.value })
            }
            required
          />
        </div>

        <div>
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="time"
            value={schedule.endTime}
            onChange={(e) =>
              setSchedule({ ...schedule, endTime: e.target.value })
            }
            required
          />
        </div>

        <div>
          <Label htmlFor="activityType">Activity Type</Label>
          <Select
            value={schedule.activityType}
            onValueChange={(value) =>
              setSchedule({ ...schedule, activityType: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select activity type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sport">Sport</SelectItem>
              <SelectItem value="Workshop">Workshop</SelectItem>
              <SelectItem value="SpecialProgram">Special Program</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="activity">Activity</Label>
          <Select
            value={schedule.activity?.toString()}
            onValueChange={(value) =>
              setSchedule({ ...schedule, activity: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select activity" />
            </SelectTrigger>
            <SelectContent>
              {schedule.activityType === "Sport" &&
                sports.map((sport) => (
                  <SelectItem key={sport._id} value={sport._id.toString()}>
                    {sport.name}
                  </SelectItem>
                ))}
              {schedule.activityType === "Workshop" &&
                workshops.map((workshop) => (
                  <SelectItem
                    key={workshop._id}
                    value={workshop._id.toString()}
                  >
                    {workshop.title}
                  </SelectItem>
                ))}
              {schedule.activityType === "SpecialProgram" &&
                specialPrograms.map((program) => (
                  <SelectItem key={program._id} value={program._id.toString()}>
                    {program.title}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="instructor">Instructor</Label>
          <Select
            value={schedule.instructor?._id?.toString()}
            onValueChange={(value) =>
              setSchedule({ ...schedule, instructor: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select instructor" />
            </SelectTrigger>
            <SelectContent>
              {instructors.map((instructor) => (
                <SelectItem
                  key={instructor._id}
                  value={instructor._id.toString()}
                >
                  {instructor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={schedule.status}
            onValueChange={(value) =>
              setSchedule({ ...schedule, status: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-4">
          <Button type="submit">Update Schedule</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/schedules")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
