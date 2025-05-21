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
  CardDescription,
} from "@/components/ui/card";
import Image from "next/image";

const specialist2Schema = z.object({
  name: z.string().min(1, "يجب إدخال اسم المتخصص"),
  description: z.string().min(1, "يجب إدخال وصف المتخصص"),
  label: z.string().min(1, "يجب إدخال تصنيف المتخصص"),
  image: z.string().min(1, "يجب رفع صورة المتخصص"),
});

function LoadingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="h-4 w-64 bg-muted animate-pulse rounded" />
      </CardHeader>
      <CardContent className="space-y-8">
        {[...Array(4)].map((_, i) => (
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

export function Specialist2Form({ specialistId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const form = useForm({
    resolver: zodResolver(specialist2Schema),
    defaultValues: {
      name: "",
      description: "",
      label: "",
      image: "",
    },
  });

  useEffect(() => {
    if (specialistId) {
      fetchSpecialist();
    }
  }, [specialistId]);

  const fetchSpecialist = async () => {
    setFetching(true);
    try {
      const response = await fetch(`/api/specialists2/${specialistId}`);
      if (!response.ok) throw new Error("فشل في جلب بيانات المتخصص");
      const data = await response.json();
      form.reset({
        name: data.name,
        description: data.description,
        label: data.label,
        image: data.image,
      });
      setPreviewUrl(data.image);
    } catch (error) {
      toast.error("خطأ في تحميل بيانات المتخصص");
      router.push("/dashboard/specialists2");
    } finally {
      setFetching(false);
    }
  };

  const handleFileUpload = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("فشل في رفع الصورة");
      }

      const data = await response.json();
      form.setValue("image", data.url);
      setPreviewUrl(data.url);
    } catch (error) {
      toast.error("خطأ في رفع الصورة");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await fetch(
        specialistId
          ? `/api/specialists2/${specialistId}`
          : "/api/specialists2",
        {
          method: specialistId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "فشل في حفظ بيانات المتخصص");
      }

      toast.success(`تم ${specialistId ? "تحديث" : "إنشاء"} المتخصص بنجاح`);
      router.push("/dashboard/specialists2");
    } catch (error) {
      toast.error(
        error.message || `خطأ في ${specialistId ? "تحديث" : "إنشاء"} المتخصص`
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
        <CardTitle>
          {specialistId ? "تعديل المتخصص" : "إضافة متخصص جديد"}
        </CardTitle>
        <CardDescription>
          {specialistId
            ? "تحديث معلومات المتخصص"
            : "إضافة متخصص جديد إلى النظام"}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم المتخصص</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: د. أحمد محمد" {...field} />
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
                  <FormLabel>وصف المتخصص</FormLabel>
                  <FormControl>
                    <Input placeholder="وصف مختصر للمتخصص" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تصنيف المتخصص</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="مثال: أخصائي العلاج الطبيعي"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>صورة المتخصص</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          handleFileUpload(file);
                        }
                      }}
                      disabled={uploading}
                    />
                  </FormControl>
                  {previewUrl && (
                    <div className="mt-2 relative w-32 h-32">
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>

          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading
                ? "جاري الحفظ..."
                : specialistId
                ? "تحديث المتخصص"
                : "إنشاء المتخصص"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/specialists2")}
            >
              إلغاء
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
