"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DeleteWorkshopPage({ params }) {
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

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/workshops/${params.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete workshop");
      }

      router.push("/dashboard/workshops");
    } catch (error) {
      console.error("Error deleting workshop:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!workshop) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">حذف الورشة</h1>
      <div className="bg-destructive/10 p-4 rounded-md">
        <p className="text-destructive">
          هل أنت متأكد من حذف الورشة "{workshop.title}"؟
        </p>
      </div>
      <div className="flex gap-4">
        <Button
          variant="destructive"
          onClick={handleDelete}
          disabled={isLoading}
        >
          {isLoading ? "جاري الحذف..." : "حذف"}
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/workshops")}
        >
          إلغاء
        </Button>
      </div>
    </div>
  );
}
