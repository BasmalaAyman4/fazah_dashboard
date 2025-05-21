"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function PackagesList() {
  const [packages, setPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch("/api/packages");
      const data = await response.json();
      setPackages(data);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في جلب قائمة الحزم",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذه الحزمة؟")) return;

    try {
      const response = await fetch(`/api/packages/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("فشل في حذف الباقة");
      }

      toast({
        title: "نجاح",
        description: "تم حذف الباقة بنجاح",
      });

      fetchPackages();
    } catch (error) {
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء حذف الباقة",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">الباقات</h2>
        <Link href="/dashboard/packages/new">
          <Button>إضافة باقة جديدة</Button>
        </Link>
      </div>

      <div dir="ltr" className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>العنوان</TableHead>
              <TableHead>الرياضة</TableHead>
              <TableHead>النوع</TableHead>
              <TableHead>المدة</TableHead>
              <TableHead>السعر</TableHead>
              <TableHead className="text-right">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.map((packageData) => (
              <TableRow key={packageData._id}>
                <TableCell>{packageData.title}</TableCell>
                <TableCell>{packageData.sport.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      packageData.type === "private" ? "secondary" : "default"
                    }
                  >
                    {packageData.type === "private" ? "خاصة" : "عادية"}
                  </Badge>
                </TableCell>
                <TableCell>{packageData.duration}</TableCell>
                <TableCell>{packageData.price} ريال</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(packageData._id)}
                    >
                      حذف
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
