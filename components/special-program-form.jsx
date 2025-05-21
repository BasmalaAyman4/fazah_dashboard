"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import Image from "next/image";

const specialProgramSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  description: z.string().min(1, "الوصف مطلوب"),
  price: z.string().min(1, "السعر مطلوب"),
  image: z.any().optional(),
});

export function SpecialProgramForm({ initialData, onSubmit, isLoading }) {
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const form = useForm({
    resolver: zodResolver(specialProgramSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      image: null,
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        description: initialData.description,
        price: initialData.price.toString(),
        image: null,
      });
      setImagePreview(initialData.image);
    }
  }, [initialData, form]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      form.setValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (data) => {
    try {
      setUploading(true);
      let imageUrl = data.image;

      if (data.image instanceof File) {
        const formData = new FormData();
        formData.append("file", data.image);

        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadResponse.ok) {
          throw new Error("فشل في رفع الصورة");
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      }

      await onSubmit({
        ...data,
        price: parseFloat(data.price),
        image: imageUrl,
      });

      toast({
        title: "نجاح",
        description: initialData
          ? "تم تحديث البرنامج الخاص بنجاح"
          : "تم إنشاء البرنامج الخاص بنجاح",
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء حفظ البرنامج الخاص",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>عنوان البرنامج الخاص</FormLabel>
              <FormControl>
                <Input placeholder="أدخل عنوان البرنامج الخاص" {...field} />
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
              <FormLabel>وصف البرنامج الخاص</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="أدخل وصف البرنامج الخاص"
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
              <FormLabel>سعر البرنامج الخاص</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="أدخل سعر البرنامج الخاص"
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
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>صورة البرنامج الخاص</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    handleImageChange(e);
                    onChange(e.target.files[0]);
                  }}
                  disabled={uploading}
                  {...field}
                />
              </FormControl>
              {imagePreview && (
                <div className="mt-4 relative w-full h-48">
                  <Image
                    src={imagePreview}
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

        <Button type="submit" disabled={isLoading || uploading}>
          {isLoading || uploading
            ? "جاري الحفظ..."
            : initialData
            ? "تحديث"
            : "إنشاء"}
        </Button>
      </form>
    </Form>
  );
}
