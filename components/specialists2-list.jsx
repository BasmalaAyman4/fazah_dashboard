"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

function LoadingSkeleton() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الاسم</TableHead>
            <TableHead>الوصف</TableHead>
            <TableHead>التصنيف</TableHead>
            <TableHead className="text-right">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              </TableCell>
              <TableCell>
                <div className="h-4 w-48 bg-muted animate-pulse rounded" />
              </TableCell>
              <TableCell>
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                  <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function Specialists2List() {
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpecialists();
  }, []);

  const fetchSpecialists = async () => {
    try {
      const response = await fetch("/api/specialists2");
      if (!response.ok) throw new Error("فشل في جلب المتخصصين");
      const data = await response.json();
      setSpecialists(data);
    } catch (error) {
      toast.error("خطأ في تحميل المتخصصين");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا المتخصص؟")) return;

    try {
      const response = await fetch(`/api/specialists2/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("فشل في حذف المتخصص");
      toast.success("تم حذف المتخصص بنجاح");
      fetchSpecialists();
    } catch (error) {
      toast.error("خطأ في حذف المتخصص");
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (specialists.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        لم يتم العثور على متخصصين. أضف أول متخصص للبدء.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table dir="ltr">
        <TableHeader>
          <TableRow>
            <TableHead>الاسم</TableHead>
            <TableHead>الوصف</TableHead>
            <TableHead>التصنيف</TableHead>
            <TableHead className="text-right">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {specialists.map((specialist) => (
            <TableRow key={specialist._id}>
              <TableCell>{specialist.name}</TableCell>
              <TableCell className="max-w-[300px] truncate">
                {specialist.description}
              </TableCell>
              <TableCell>{specialist.label}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" asChild>
                    <Link
                      href={`/dashboard/specialists2/${specialist._id}/edit`}
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(specialist._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
