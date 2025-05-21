"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function WorkshopList({ workshops }) {
  return (
    <div dir="ltr" className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>العنوان</TableHead>
            <TableHead>الوصف</TableHead>
            <TableHead>السعر</TableHead>
            <TableHead>الموقع</TableHead>
            <TableHead className="text-right">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {workshops?.map((workshop) => (
            <TableRow key={workshop._id}>
              <TableCell>{workshop.title}</TableCell>
              <TableCell>{workshop.description}</TableCell>
              <TableCell>{workshop.price} ريال</TableCell>
              <TableCell>{workshop.location}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/dashboard/workshops/${workshop._id}/delete`}>
                    <Button variant="destructive" size="sm">
                      حذف
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
