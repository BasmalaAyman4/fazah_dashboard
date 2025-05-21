"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { WorkshopList } from "@/components/workshop-list";
import Link from "next/link";

export default function WorkshopsPage() {
  const [workshops, setWorkshops] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    try {
      const response = await fetch("/api/workshops");
      if (!response.ok) {
        throw new Error("Failed to fetch workshops");
      }
      const data = await response.json();
      setWorkshops(data);
    } catch (error) {
      console.error("Error fetching workshops:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6 my-12 mx-24">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">الورش</h1>
        <Link href="/dashboard/workshops/new">
          <Button>إضافة ورشة جديدة</Button>
        </Link>
      </div>

      <WorkshopList workshops={workshops} />
    </div>
  );
}
