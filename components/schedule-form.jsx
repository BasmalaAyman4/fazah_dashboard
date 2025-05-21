"use client";
import React, { useCallback } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import Test from "./Test";
const formSchema = z.object({
  day: z.string({
    required_error: "الرجاء اختيار يوم من الأسبوع.",
  }),
  date: z.string({
    required_error: "الرجاء اختيار التاريخ.",
  }),
  startTime: z.string({
    required_error: "الرجاء اختيار وقت البدء.",
  }),
  endTime: z.string({
    required_error: "الرجاء اختيار وقت الانتهاء.",
  }),
  activity: z.string({
    required_error: "الرجاء اختيار النشاط.",
  }),
  instructor: z.string().optional(),
  maximumParticipants: z.number().min(1).optional(),
  showParticipants: z.boolean().default(false),
  showInstructor: z.boolean().default(false),
  showPrice: z.boolean().default(false),
  price: z.number().min(0).default(0),
});

export function ScheduleForm({ scheduleId, schedule, onSuccess }) {
  const { toast } = useToast();
  const router = useRouter();
  const [sports, setSports] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [specialPrograms, setSpecialPrograms] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDays, setSelectedDays] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          sportsRes,
          workshopsRes,
          specialProgramsRes,
          instructorsRes,
          activityTypesRes,
        ] = await Promise.all([
          fetch("/api/sports"),
          fetch("/api/workshops"),
          fetch("/api/special-programs"),
          fetch("/api/instructors"),
          fetch("/api/activity-types"),
        ]);

        if (
          !sportsRes.ok ||
          !workshopsRes.ok ||
          !specialProgramsRes.ok ||
          !instructorsRes.ok ||
          !activityTypesRes.ok
        ) {
          throw new Error("فشل في جلب البيانات");
        }

        const [
          sportsData,
          workshopsData,
          specialProgramsData,
          instructorsData,
          activityTypesData,
        ] = await Promise.all([
          sportsRes.json(),
          workshopsRes.json(),
          specialProgramsRes.json(),
          instructorsRes.json(),
          activityTypesRes.json(),
        ]);

        setSports(sportsData);
        setWorkshops(workshopsData);
        setSpecialPrograms(specialProgramsData);
        setInstructors(instructorsData);
        setActivityTypes(activityTypesData);
        setLoading(false);
      } catch (error) {
        toast({
          title: "خطأ",
          description: "فشل في تحميل البيانات. يرجى المحاولة مرة أخرى.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      day: schedule?.day || "",
      date: schedule?.date || "",
      startTime: schedule?.startTime || "",
      endTime: schedule?.endTime || "",
      activity: schedule?.activity?._id || "",
      instructor: schedule?.instructor?._id || "",
      maximumParticipants: schedule?.maximumParticipants || 0,
      showParticipants: schedule?.showParticipants || false,
      showInstructor: schedule?.showInstructor || false,
      showPrice: schedule?.showPrice || false,
      price: schedule?.price || 0,
    },
  });

  // Function to get activities by type
  const getActivitiesByType = (typeId) => {
    switch (typeId) {
      case "sports":
        return sports;
      case "workshops":
        return workshops;
      case "special-programs":
        return specialPrograms;
      default:
        return [];
    }
  };

  // Function to get the activity type from the activity ID
  const getActivityTypeFromId = (activityId) => {
    if (!activityId) return null;

    if (sports.some((sport) => sport._id === activityId)) return "Sport";
    if (workshops.some((workshop) => workshop._id === activityId))
      return "Workshop";
    if (specialPrograms.some((program) => program._id === activityId))
      return "SpecialProgram";

    return null;
  };

  // Function to get the activity type from the schedule
  const getActivityTypeFromSchedule = () => {
    if (!schedule?.activityType) return null;
    return schedule.activityType;
  };

  // Get the current activity type (from form or schedule)
  const currentActivityType =
    getActivityTypeFromId(form.watch("activity")) ||
    getActivityTypeFromSchedule();

  const onSubmit = async (values) => {
    try {
      // Get the activity type based on the selected activity
      const activityType = getActivityTypeFromId(values.activity);

      if (!activityType) {
        toast({
          title: "خطأ",
          description: "لم يتم تحديد نوع النشاط. يرجى اختيار نشاط صحيح.",
          variant: "destructive",
        });
        return;
      }

      if (selectedDays.length === 0) {
        toast({
          title: "خطأ",
          description: "الرجاء اختيار يوم واحد على الأقل.",
          variant: "destructive",
        });
        return;
      }

      // Create schedules for each selected day
      const schedules = selectedDays.map((date) => {
        const dateObj = new Date(date);
        const days = [
          "الأحد",
          "الإثنين",
          "الثلاثاء",
          "الأربعاء",
          "الخميس",
          "الجمعة",
          "السبت",
        ];
        const day = days[dateObj.getDay()];

        return {
          day,
          date,
          startTime: values.startTime,
          endTime: values.endTime,
          activity: values.activity,
          activityType,
          instructor: values.instructor,
          maximumParticipants: values.maximumParticipants,
          showParticipants: values.showParticipants,
          showInstructor: values.showInstructor,
          showPrice: values.showPrice,
          status: values.status,
        };
      });

      const url = scheduleId
        ? `/api/schedules/${scheduleId}`
        : "/api/schedules/bulk";

      const method = scheduleId ? "PUT" : "POST";

      console.log("Submitting schedules:", schedules);

      // Show loading toast
      toast({
        title: "جاري الحفظ...",
        description: "يرجى الانتظار بينما نقوم بحفظ الجداول.",
      });

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          scheduleId ? { ...values, date: selectedDays[0] } : { schedules }
        ),
      });

      // Check if the response is JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "حدث خطأ أثناء حفظ الجداول");
        }

        toast({
          title: scheduleId ? "تم تحديث الجدول" : "تم حفظ الجداول",
          description: scheduleId
            ? "تم تحديث الجدول بنجاح."
            : `تم حفظ ${selectedDays.length} جدول بنجاح.`,
        });

        if (onSuccess) {
          onSuccess();
        } else {
          router.push("/dashboard/schedules");
        }
      } else {
        // Handle non-JSON response
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("حدث خطأ في الخادم. يرجى المحاولة مرة أخرى.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "خطأ",
        description:
          error.message || "فشل في حفظ الجداول. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  // Function to handle selected days from the Test component
  const handleSelectedDays = useCallback((dates) => {
    console.log("Selected days:", dates);
    if (dates && dates.length > 0) {
      setSelectedDays(dates);
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{scheduleId ? "تعديل الجدول" : "جدول جديد"}</CardTitle>
        <CardDescription>
          {scheduleId
            ? "تحديث تفاصيل هذا الجدول."
            : "إضافة جدول نشاط رياضي جديد."}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="flex flex-row gap-16">
              <div className="flex-1 space-y-4">
                <FormField
                  control={form.control}
                  name="activity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>النشاط</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="اختر النشاط" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem
                            value="placeholder"
                            disabled
                            className="text-muted-foreground"
                          >
                            اختر النشاط
                          </SelectItem>

                          {activityTypes.map((type) => (
                            <React.Fragment key={type._id}>
                              <SelectItem
                                value={type._id}
                                disabled
                                className="font-bold"
                              >
                                {type.name}
                              </SelectItem>
                              {getActivitiesByType(type._id).map((activity) => (
                                <SelectItem
                                  key={activity._id}
                                  value={activity._id}
                                  className="pl-4"
                                >
                                  {activity.name || activity.title}
                                </SelectItem>
                              ))}
                            </React.Fragment>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-row gap-4">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>وقت البدء</FormLabel>
                        <FormControl>
                          <Input type="time" step="1800" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>وقت الانتهاء</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex flex-row gap-4 items-center">
                  <FormField
                    control={form.control}
                    name="instructor"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>المدرب</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  schedule?.instructor?.name || "اختر المدرب"
                                }
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {instructors.map((instructor) => (
                              <SelectItem
                                key={instructor._id}
                                value={instructor._id}
                              >
                                {instructor.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="showInstructor"
                    render={({ field }) => (
                      <div className="mt-8 flex items-center gap-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>إظهار/اخفاء</FormLabel>
                      </div>
                    )}
                  />
                </div>
                <div className="flex flex-row gap-4 items-center">
                  <FormField
                    control={form.control}
                    name="maximumParticipants"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>الحد الأقصى للمشاركين</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? parseInt(e.target.value) : 0
                              )
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          اتركه فارغًا إذا لم يكن هناك حد أقصى
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="showParticipants"
                    render={({ field }) => (
                      <>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>إظهار/اخفاء</FormLabel>
                        </div>
                      </>
                    )}
                  />
                </div>
                <div className="flex flex-row gap-4 items-center">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>السعر</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value ? parseInt(e.target.value) : 0
                              )
                            }
                          />
                        </FormControl>
                        <FormDescription>أدخل السعر للنشاط</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="showPrice"
                    render={({ field }) => (
                      <>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>إظهار/اخفاء</FormLabel>
                        </div>
                      </>
                    )}
                  />
                </div>
              </div>
              <div>
                <Test onSelectDays={handleSelectedDays} />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => router.back()}
            >
              إلغاء
            </Button>
            <Button type="submit">حفظ</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
