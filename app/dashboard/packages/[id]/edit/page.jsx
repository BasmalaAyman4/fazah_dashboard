"use client";
import { useState, useEffect } from "react";
import { PackageForm } from "@/components/package-form";
import { useRouter } from "next/navigation";

export default function EditPackagePage({ params }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [packageData, setPackageData] = useState(null);

  useEffect(() => {
    fetchPackage();
  }, [params.id]);

  const fetchPackage = async () => {
    try {
      const response = await fetch(`/api/packages/${params.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch package");
      }
      const data = await response.json();
      setPackageData(data);
    } catch (error) {
      console.error("Error fetching package:", error);
    }
  };

  const handleSubmit = async (data) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/packages/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update package");
      }

      router.push("/dashboard/packages");
    } catch (error) {
      console.error("Error updating package:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!packageData) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">تعديل الحزمة</h1>
      <PackageForm
        initialData={packageData}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
