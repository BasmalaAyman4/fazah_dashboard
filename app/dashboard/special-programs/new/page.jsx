"use client";
import { useState } from "react";
import { SpecialProgramForm } from "@/components/special-program-form";
import { useRouter } from "next/navigation";

export default function NewSpecialProgramPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/special-programs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create special program");
      }

      router.push("/dashboard/special-programs");
    } catch (error) {
      console.error("Error creating special program:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 mx-32 my-12">
      <h1 className="text-3xl font-bold">إضافة برنامج خاص جديد</h1>
      <SpecialProgramForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
