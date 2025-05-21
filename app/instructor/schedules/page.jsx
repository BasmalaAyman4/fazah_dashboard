"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";

export default function InstructorSchedules() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch("/api/instructors/me/schedules");
        if (!response.ok) {
          throw new Error("Failed to fetch schedules");
        }
        const data = await response.json();
        setSchedules(data);
        console.log("schedules", data);
      } catch (error) {
        console.error("Error fetching schedules:", error);
        toast({
          title: "خطأ",
          description: "فشل في تحميل الجداول",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [toast]);

  const filteredSchedules = schedules.filter((schedule) => {
    if (!startDate && !endDate) return true;

    const scheduleDate = new Date(schedule.date);
    const from = startDate ? new Date(startDate) : null;
    const to = endDate ? new Date(endDate) : null;

    return (!from || scheduleDate >= from) && (!to || scheduleDate <= to);
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">جدول الأنشطة</h1>
        <p className="text-muted-foreground">جاري التحميل...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">جدول الأنشطة</h1>
      <p className="text-muted-foreground">عرض جدول الأنشطة الخاصة بك</p>

      {/* Filter inputs */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div>
          <label className="text-sm text-muted-foreground">من تاريخ</label>
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm text-muted-foreground">إلى تاريخ</label>
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent>
          {filteredSchedules.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              لا توجد أنشطة مجدولة حالياً
            </p>
          ) : (
            <Table dir="ltr">
              <TableHeader>
                <TableRow>
                  <TableHead>اليوم</TableHead>
                  <TableHead>التاريخ</TableHead>
                  <TableHead>الوقت</TableHead>
                  <TableHead>النشاط</TableHead>
                  <TableHead> الحالة</TableHead>
                  <TableHead> عدد المشاركين</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchedules.map((schedule) => (
                  <TableRow key={schedule._id}>
                    <TableCell>{schedule.day}</TableCell>
                    <TableCell>{schedule.date.slice(0, 10)}</TableCell>
                    <TableCell>
                      {schedule.startTime} - {schedule.endTime}
                    </TableCell>
                    <TableCell>
                      {schedule.activityTypeLabel}
                      <br />
                      {schedule.activityTitle}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          schedule.status == "active" ? "default" : "outline"
                        }
                      >
                        {schedule.status == "active" ? "مفعل" : "غير مفعل"}
                      </Badge>
                    </TableCell>
                    <TableCell>{schedule.maximumParticipants}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
