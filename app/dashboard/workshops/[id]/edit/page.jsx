"use client";
import { useState, useEffect } from "react";
import { WorkshopForm } from "@/components/workshop-form";
import { useRouter } from "next/navigation";

export default function EditWorkshopPage({ params }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [workshop, setWorkshop] = useState(null);

  useEffect(() => {
    fetchWorkshop();
  }, [params.id]);

  const fetchWorkshop = async () => {
    try {
      const response = await fetch(`/api/workshops/${params.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch workshop");
      }
      const data = await response.json();
      setWorkshop(data);
    } catch (error) {
      console.error("Error fetching workshop:", error);
    }
  };

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/workshops/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update workshop");
      }

      router.push("/dashboard/workshops");
    } catch (error) {
      console.error("Error updating workshop:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!workshop) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6 px-24 py-12">
      <h1 className="text-3xl font-bold">تعديل الورشة</h1>
      <WorkshopForm
        initialData={workshop}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
