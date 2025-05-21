"use client";
import { useState } from "react";
import { WorkshopForm } from "@/components/workshop-form";
import { useRouter } from "next/navigation";

export default function NewWorkshopPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/workshops", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create workshop");
      }

      router.push("/dashboard/workshops");
    } catch (error) {
      console.error("Error creating workshop:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 mx-32 my-12">
      <h1 className="text-3xl font-bold">إضافة ورشة عمل جديدة</h1>
      <WorkshopForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
