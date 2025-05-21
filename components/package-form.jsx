"use client";
import { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  sport: z.string().min(1, "الرياضة مطلوبة"),
  type: z.enum(["private", "regular"], {
    required_error: "نوع الحزمة مطلوب",
  }),
  duration: z.string().min(1, "المدة مطلوبة"),
  description: z.string().min(1, "الوصف مطلوب"),
  price: z.string().min(1, "السعر مطلوب"),
});

export function PackageForm({ initialData, onSubmit, isLoading }) {
  const [sports, setSports] = useState([]);

  useEffect(() => {
    fetchSports();
  }, []);

  const fetchSports = async () => {
    try {
      const response = await fetch("/api/sports");
      if (!response.ok) {
        throw new Error("Failed to fetch sports");
      }
      const data = await response.json();
      setSports(data);
    } catch (error) {
      console.error("Error fetching sports:", error);
    }
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      sport: initialData?.sport?._id || "",
      type: initialData?.type || "regular",
      duration: initialData?.duration || "",
      description: initialData?.description || "",
      price: initialData?.price || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>العنوان</FormLabel>
              <FormControl>
                <Input placeholder="أدخل عنوان الحزمة" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sport"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الرياضة</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الرياضة" />
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
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>نوع الحزمة</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر نوع الحزمة" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="private">خاص</SelectItem>
                  <SelectItem value="regular">عادي</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>المدة</FormLabel>
              <FormControl>
                <Input placeholder="أدخل مدة الحزمة" {...field} />
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
              <FormLabel>الوصف</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="أدخل وصف الحزمة"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>السعر</FormLabel>
              <FormControl>
                <Input placeholder="أدخل سعر الحزمة" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
        </Button>
      </form>
    </Form>
  );
}
