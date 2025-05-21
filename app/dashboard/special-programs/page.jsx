"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { SpecialProgramList } from "@/components/special-program-list";
import Link from "next/link";

export default function SpecialProgramsPage() {
  const [specialPrograms, setSpecialPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSpecialPrograms();
  }, []);

  const fetchSpecialPrograms = async () => {
    try {
      const response = await fetch("/api/special-programs");
      if (!response.ok) {
        throw new Error("Failed to fetch special programs");
      }
      const data = await response.json();
      setSpecialPrograms(data);
    } catch (error) {
      console.error("Error fetching special programs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6 mx-32 my-12">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">البرامج الخاصة</h1>
        <Link href="/dashboard/special-programs/new">
          <Button>إضافة برنامج خاص جديد</Button>
        </Link>
      </div>

      <SpecialProgramList dir="ltr" specialPrograms={specialPrograms} />
    </div>
  );
}
