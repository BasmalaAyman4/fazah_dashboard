"use client";
import { PackageForm } from "@/components/package-form";
import { useState } from "react";

export default function NewPackagePage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/packages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("فشل في إنشاء الحزمة");
      }

      window.location.href = "/dashboard/packages";
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">إضافة حزمة جديدة</h1>
        <PackageForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
