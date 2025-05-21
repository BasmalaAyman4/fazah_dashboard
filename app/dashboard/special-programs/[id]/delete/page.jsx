"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DeleteSpecialProgramPage({ params }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [specialProgram, setSpecialProgram] = useState(null);

  useEffect(() => {
    fetchSpecialProgram();
  }, [params.id]);

  const fetchSpecialProgram = async () => {
    try {
      const response = await fetch(`/api/special-programs/${params.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch special program");
      }
      const data = await response.json();
      setSpecialProgram(data);
    } catch (error) {
      console.error("Error fetching special program:", error);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/special-programs/${params.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete special program");
      }

      router.push("/special-programs");
    } catch (error) {
      console.error("Error deleting special program:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!specialProgram) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">حذف البرنامج الخاص</h1>
      <div className="bg-destructive/10 p-4 rounded-md">
        <p className="text-destructive">
          هل أنت متأكد من حذف البرنامج الخاص "{specialProgram.title}"؟
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
          onClick={() => router.push("/special-programs")}
        >
          إلغاء
        </Button>
      </div>
    </div>
  );
}
