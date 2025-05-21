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

const clientSchema = z.object({
  name: z.string().min(2, "يجب أن يكون الاسم على الأقل حرفين"),
  email: z.string().email("عنوان البريد الإلكتروني غير صالح"),
  phone: z.string().min(10, "يجب أن يكون رقم الهاتف على الأقل 10 أرقام"),
  password: z.string().min(6, "يجب أن تكون كلمة المرور على الأقل 6 أحرف"),
  description: z.string().optional(),
  image: z.string().optional(),
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

export function ClientForm({ clientId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const form = useForm({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      description: "",
      image: "",
      specialties: [],
      status: "active",
    },
  });



  const fetchInstructor = async () => {
    setFetching(true);
    try {
      const response = await fetch(`/api/clients/${clientId}`);
      if (!response.ok) throw new Error("فشل في جلب بيانات العميل");
      const data = await response.json();
      form.reset({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password || "",
        description: data.description || "",
        image: data.image || "",
        specialties: data.specialties || [],
        status: data.status || "active",
      });
    } catch (error) {
      toast.error("خطأ في تحميل بيانات العميل");
      router.push("/dashboard/clients");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (clientId) {
      fetchInstructor();
    }
  }, [clientId, form, router]);

  const onSubmit = async (values) => {
    setLoading(true);
    console.log(values)
    try {
      if (clientId && !values.password) {
        delete values.password;
      }

      const response = await fetch(
        clientId ? `/api/clients/${clientId}` : "/api/clients",
        {
          method: clientId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "فشل في حفظ بيانات العميل");
      }

      toast.success(
        clientId ? "تم تحديث بيانات العميل بنجاح" : "تم إنشاء العميل بنجاح"
      );
      router.push("/dashboard/clients");
    } catch (error) {
        console.log(error)
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
            {clientId ? "تعديل عميل" : "إضافة عميل جديد"}
          </CardTitle>
          <CardDescription>
            {clientId
              ? "تحديث معلومات عميل"
              : "إضافة عميل جديد إلى النظام"}
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
                  <Input placeholder="أدخل اسم العميل" {...field} />
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
          {!clientId && (
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نبذة عن عميل</FormLabel>
              <FormControl>
                <Input placeholder="أخبرنا عن عميل..." {...field} />
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
              : clientId
              ? "تحديث عميل"
              : "إنشاء عميل"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/clients")}
          >
            إلغاء
          </Button>
        </div>
      </form>
    </Form>
  );
}
