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
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sportSchema = z.object({
  name: z.string().min(1, "يجب إدخال اسم الرياضة"),
  description: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

function LoadingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-4 w-64 bg-muted animate-pulse rounded" />
      </CardHeader>
      <CardContent className="space-y-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            <div className="h-10 w-full bg-muted animate-pulse rounded" />
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <div className="flex gap-4">
          <div className="h-10 w-32 bg-muted animate-pulse rounded" />
          <div className="h-10 w-24 bg-muted animate-pulse rounded" />
        </div>
      </CardFooter>
    </Card>
  );
}

export function SportForm({ sportId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const form = useForm({
    resolver: zodResolver(sportSchema),
    defaultValues: {
      name: "",
      description: "",
      status: "active",
    },
  });

  useEffect(() => {
    if (sportId) {
      fetchSport();
    }
  }, [sportId]);

  const fetchSport = async () => {
    setFetching(true);
    try {
      const response = await fetch(`/api/sports/${sportId}`);
      if (!response.ok) throw new Error("فشل في جلب بيانات الرياضة");
      const data = await response.json();
      form.reset({
        name: data.name,
        description: data.description || "",
        status: data.status || "active",
      });
    } catch (error) {
      toast.error("خطأ في تحميل بيانات الرياضة");
      router.push("/dashboard/sports");
    } finally {
      setFetching(false);
    }
  };

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(
        sportId ? `/api/sports/${sportId}` : "/api/sports",
        {
          method: sportId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "فشل في حفظ بيانات الرياضة");
      }

      toast.success(`تم ${sportId ? "تحديث" : "إنشاء"} الرياضة بنجاح`);
      router.push("/dashboard/sports");
    } catch (error) {
      toast.error(
        error.message || `خطأ في ${sportId ? "تحديث" : "إنشاء"} الرياضة`
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <LoadingSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{sportId ? "تعديل الرياضة" : "إضافة رياضة جديدة"}</CardTitle>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم الرياضة</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: اليوجا" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>وصف الرياضة</FormLabel>
                  <FormControl>
                    <Input placeholder="وصف مختصر للرياضة" {...field} />
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
          </CardContent>

          <CardFooter>
            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading
                  ? "جاري الحفظ..."
                  : sportId
                  ? "تحديث الرياضة"
                  : "إنشاء الرياضة"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/sports")}
              >
                إلغاء
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
