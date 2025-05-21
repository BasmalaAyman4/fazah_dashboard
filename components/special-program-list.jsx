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
import Link from "next/link";

export function SpecialProgramList({ specialPrograms }) {
  return (
    <div dir="ltr" className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>العنوان</TableHead>
            <TableHead>الوصف</TableHead>
            <TableHead>السعر</TableHead>
            <TableHead className="text-right">الإجراءات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {specialPrograms.map((program) => (
            <TableRow key={program._id}>
              <TableCell>{program.title}</TableCell>
              <TableCell>{program.description}</TableCell>
              <TableCell>{program.price} ريال</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/special-programs/${program._id}/delete`}>
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
