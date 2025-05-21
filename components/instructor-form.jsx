"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const instructorSchema = z.object({
  name: z.string().min(2, "يجب أن يكون الاسم على الأقل حرفين"),
  email: z.string().email("عنوان البريد الإلكتروني غير صالح"),
  phone: z.string().min(10, "يجب أن يكون رقم الهاتف على الأقل 10 أرقام"),
  password: z.string().min(6, "يجب أن تكون كلمة المرور على الأقل 6 أحرف"),
  description: z.string().optional(),
  image: z.string().optional(),
  sports: z.array(z.string()).min(1, "الرجاء اختيار رياضة واحدة على الأقل"),
  specialties: z.array(z.string()).optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          <div className="h-10 w-full bg-muted animate-pulse rounded" />
        </div>
      ))}
      <div className="flex gap-4">
        <div className="h-10 w-32 bg-muted animate-pulse rounded" />
        <div className="h-10 w-24 bg-muted animate-pulse rounded" />
      </div>
    </div>
  );
}

export function InstructorForm({ instructorId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [sports, setSports] = useState([]);

  const form = useForm({
    resolver: zodResolver(instructorSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      description: "",
      image: "",
      sports: [],
      specialties: [],
      status: "active",
    },
  });

  const fetchSports = async () => {
    try {
      const response = await fetch("/api/sports");
      if (!response.ok) throw new Error("فشل في جلب الرياضات");
      const data = await response.json();
      setSports(data);
    } catch (error) {
      toast.error("خطأ في تحميل الرياضات");
    }
  };

  const fetchInstructor = async () => {
    setFetching(true);
    try {
      const response = await fetch(`/api/instructors/${instructorId}`);
      if (!response.ok) throw new Error("فشل في جلب بيانات المدرب");
      const data = await response.json();
      form.reset({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password || "",
        description: data.description || "",
        image: data.image || "",
        sports: data.sports?.map((s) => s._id) || [],
        specialties: data.specialties || [],
        status: data.status || "active",
      });
    } catch (error) {
      toast.error("خطأ في تحميل بيانات المدرب");
      router.push("/dashboard/instructors");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchSports();
    if (instructorId) {
      fetchInstructor();
    }
  }, [instructorId, form, router]);

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      if (instructorId && !values.password) {
        delete values.password;
      }

      const response = await fetch(
        instructorId ? `/api/instructors/${instructorId}` : "/api/instructors",
        {
          method: instructorId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "فشل في حفظ بيانات المدرب");
      }

      toast.success(
        instructorId ? "تم تحديث بيانات المدرب بنجاح" : "تم إنشاء المدرب بنجاح"
      );
      router.push("/dashboard/instructors");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <LoadingSkeleton />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <CardHeader>
          <CardTitle>
            {instructorId ? "تعديل المتخصص" : "إضافة متخصص جديد"}
          </CardTitle>
          <CardDescription>
            {instructorId
              ? "تحديث معلومات المتخصص"
              : "إضافة متخصص جديد إلى النظام"}
          </CardDescription>
        </CardHeader>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>الاسم</FormLabel>
                <FormControl>
                  <Input placeholder="أدخل اسم المدرب" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>البريد الإلكتروني</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رقم الهاتف</FormLabel>
                <FormControl>
                  <Input placeholder="أدخل رقم الهاتف" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!instructorId && (
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="أدخل كلمة المرور"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <FormField
          control={form.control}
          name="sports"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الرياضات</FormLabel>
              <Select
                onValueChange={(value) => {
                  const currentValue = field.value || [];
                  if (!currentValue.includes(value)) {
                    field.onChange([...currentValue, value]);
                  }
                }}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الرياضات" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sports.map((sport) => (
                    <SelectItem key={sport._id} value={sport._id}>
                      {sport.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex flex-wrap gap-2 mt-2">
                {field.value?.map((sportId) => {
                  const sport = sports.find((s) => s._id === sportId);
                  return (
                    <Badge
                      key={sportId}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {sport?.name}
                      <button
                        type="button"
                        onClick={() => {
                          field.onChange(
                            field.value.filter((id) => id !== sportId)
                          );
                        }}
                        className="ml-1 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نبذة عن المدرب</FormLabel>
              <FormControl>
                <Input placeholder="أخبرنا عن المدرب..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الحالة</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="inactive">غير نشط</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading
              ? "جاري الحفظ..."
              : instructorId
              ? "تحديث المتخصص"
              : "إنشاء المتخصص"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/instructors")}
          >
            إلغاء
          </Button>
        </div>
      </form>
    </Form>
  );
}
