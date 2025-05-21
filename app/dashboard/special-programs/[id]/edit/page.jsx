"use client";
import { useState, useEffect } from "react";
import { SpecialProgramForm } from "@/components/special-program-form";
import { useRouter } from "next/navigation";

export default function EditSpecialProgramPage({ params }) {
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

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/special-programs/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update special program");
      }

      router.push("/special-programs");
    } catch (error) {
      console.error("Error updating special program:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!specialProgram) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6 px-24 py-12">
      <h1 className="text-3xl font-bold">تعديل البرنامج الخاص</h1>
      <SpecialProgramForm
        initialData={specialProgram}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
