import { Schedule } from "@/lib/mongoose";

async function getSchedule(id) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const schedule = await Schedule.findById(id)
    .populate("activity", "name title")
    .populate("instructor", "name email");
  return schedule;
}

export default async function ScheduleData({ id }) {
  const schedule = await getSchedule(id);
  return schedule;
}
