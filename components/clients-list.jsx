"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, Eye, FileText } from "lucide-react";
import { toast } from "sonner";

function LoadingSkeleton() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>الاسم</TableHead>
            <TableHead>البريد الإلكتروني</TableHead>
            <TableHead>الهاتف</TableHead>
            <TableHead>تاريخ الانضمام</TableHead>
            <TableHead>مفعل</TableHead>

            <TableHead className="text-right">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(5)].map((_, i) => (
            <TableRow key={i}>

              <TableCell>
                <div className="h-4 w-48 bg-muted animate-pulse rounded" />
              </TableCell>
              <TableCell>
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </TableCell>
              <TableCell>
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </TableCell>
              <TableCell>
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </TableCell>
              <TableCell>
                <div className="h-4 w-40 bg-muted animate-pulse rounded" />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <div className="h-8 w-8 bg-muted animate-pulse rounded" />
                  <div className="h-8 w-8 bg-muted animate-pulse rounded" />
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

export function ClientsList() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstructors();
  }, []);

 

  const fetchInstructors = async () => {
    try {
      const response = await fetch("/api/clients");
      if (!response.ok) throw new Error("فشل في جلب العملاء");
      const data = await response.json();
      setInstructors(data);
    } catch (error) {
      toast.error("خطأ في تحميل العملاء");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("هل أنت متأكد من حذف هذا العميل")) return;

    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("فشل في حذف العميل");
      toast.success("تم حذف العميل بنجاح");
      fetchInstructors();
    } catch (error) {
      toast.error("خطأ في حذف العميل");
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (instructors.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        لم يتم العثور على عملاء. أضف أول عميل للبدء.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table className="text-left">
        <TableHeader>
          <TableRow>
          <TableHead>الاسم</TableHead>
            <TableHead>البريد الإلكتروني</TableHead>
            <TableHead>الهاتف</TableHead>
            <TableHead>تاريخ الانضمام</TableHead>
            <TableHead>مفعل</TableHead>

          </TableRow>
        </TableHeader>
        <TableBody>
          {instructors.map((instructor) => (
            <TableRow key={instructor._id}>
              <TableCell>{instructor.name}</TableCell>
              <TableCell>{instructor.email}</TableCell>
              <TableCell>{instructor.phone}</TableCell>
              <TableCell>{instructor.joinDate.slice(0, 10)}</TableCell>
              <TableCell>
              {instructor.status}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/dashboard/clients/${instructor._id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild>
                    <Link
                      href={`/dashboard/clients/${instructor._id}/edit`}
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="ghost" size="icon" asChild></Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(instructor._id)}
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
