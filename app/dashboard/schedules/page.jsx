"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScheduleForm } from "@/components/schedule-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function LoadingSkeleton() {
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <div className="h-4 w-4 bg-muted animate-pulse rounded" />
              </TableHead>
              <TableHead>اليوم</TableHead>
              <TableHead>التاريخ</TableHead>
              <TableHead>الوقت</TableHead>
              <TableHead>الرياضة</TableHead>
              <TableHead>الحالة</TableHead>
              <TableHead>الإعدادات</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="h-4 w-4 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-28 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell>
                  <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="h-8 w-8 bg-muted animate-pulse rounded ml-auto" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

const formatDate = (date) => {
  const months = [
    "يناير",
    "فبراير",
    "مارس",
    "إبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];
  const d = new Date(date);
  return `${d.getDate()} ${months[d.getMonth()]}`;
};

export default function SchedulePage() {
  const [existingSchedules, setExistingSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchedules, setSelectedSchedules] = useState([]);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const response = await fetch("/api/schedules");
      if (!response.ok) throw new Error("فشل في جلب الجداول");
      const data = await response.json();
      setExistingSchedules(data);
    } catch (error) {
      toast.error("خطأ في تحميل الجداول");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا الجدول؟")) return;

    try {
      const response = await fetch(`/api/schedules/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("فشل في حذف الجدول");
      toast.success("تم حذف الجدول بنجاح");
      fetchSchedules();
    } catch (error) {
      toast.error("خطأ في حذف الجدول");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedSchedules.length === 0) {
      toast.error("الرجاء اختيار جداول للحذف");
      return;
    }

    if (!confirm(`هل أنت متأكد من حذف ${selectedSchedules.length} جدول؟`))
      return;

    try {
      const response = await fetch("/api/schedules/bulk", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: selectedSchedules }),
      });

      if (!response.ok) throw new Error("فشل في حذف الجداول");
      toast.success(`تم حذف ${selectedSchedules.length} جدول بنجاح`);
      setSelectedSchedules([]);
      fetchSchedules();
    } catch (error) {
      toast.error("خطأ في حذف الجداول");
    }
  };

  const toggleSelectAll = () => {
    if (selectedSchedules.length === existingSchedules.length) {
      setSelectedSchedules([]);
    } else {
      setSelectedSchedules(existingSchedules.map((schedule) => schedule._id));
    }
  };

  const toggleSelectSchedule = (id) => {
    setSelectedSchedules((prev) => {
      if (prev.includes(id)) {
        return prev.filter((scheduleId) => scheduleId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  return (
    <div className="container mx-auto py-8 px-24">
      <h1 className="text-2xl font-bold mb-6">إدارة الجداول</h1>

      <Tabs defaultValue="form" className="space-y-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form">إضافة جدول جديد</TabsTrigger>
          <TabsTrigger value="schedules">الجداول الحالية</TabsTrigger>
        </TabsList>

        <TabsContent value="form">
          <ScheduleForm onSuccess={fetchSchedules} />
        </TabsContent>

        <TabsContent value="schedules">
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">الجداول الحالية</h2>
              {selectedSchedules.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2"
                >
                  <Trash className="h-4 w-4" />
                  حذف المحدد ({selectedSchedules.length})
                </Button>
              )}
            </div>
            {loading ? (
              <LoadingSkeleton />
            ) : existingSchedules.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                لم يتم العثور على جداول. أضف جدولك الأول للبدء.
              </div>
            ) : (
              <Card>
                <CardContent className="p-0">
                  <Table dir="ltr">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">
                          <Checkbox
                            checked={
                              selectedSchedules.length ===
                              existingSchedules.length
                            }
                            onCheckedChange={toggleSelectAll}
                          />
                        </TableHead>
                        <TableHead>اليوم</TableHead>
                        <TableHead>التاريخ</TableHead>
                        <TableHead>الوقت</TableHead>
                        <TableHead>الرياضة</TableHead>
                        <TableHead>الحالة</TableHead>
                        <TableHead>الإعدادات</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {existingSchedules.map((schedule) => (
                        <TableRow key={schedule._id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedSchedules.includes(schedule._id)}
                              onCheckedChange={() =>
                                toggleSelectSchedule(schedule._id)
                              }
                            />
                          </TableCell>
                          <TableCell className="font-medium">
                            {schedule.day}
                          </TableCell>
                          <TableCell>{formatDate(schedule.date)}</TableCell>
                          <TableCell>
                            {schedule.startTime} - {schedule.endTime}
                          </TableCell>
                          <TableCell>
                            {schedule.activityTitle} (
                            {schedule.activityTypeLabel})
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                schedule.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {schedule.status === "active" ? "نشط" : "غير نشط"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              {schedule.showParticipants && (
                                <Badge variant="outline">المشاركين</Badge>
                              )}
                              {schedule.showInstructor && (
                                <Badge variant="outline">المدرب</Badge>
                              )}
                              {schedule.showPrice && (
                                <Badge variant="outline">السعر</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">فتح القائمة</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>الإجراءات</DropdownMenuLabel>
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleDelete(schedule._id)}
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  حذف
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
