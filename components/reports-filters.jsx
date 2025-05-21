"use client";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

export function ReportsFilters({
  isInstructor,
  instructors,
  onFilterChange,
  initialFilters = {
    startDate: "",
    endDate: "",
    instructorId: "all",
    sport: "all",
    showOnlyCompleted: false,
    showOnlyPrivateCompleted: false,
    showOnlyCanceled: false,
    showOnlyPrivateCanceled: false,
    showOnlyDelegated: false,
    showOnlyReceived: false,
    showOnlyPrivateDelegated: false,
    showOnlyPrivateReceived: false,
  },
}) {
  const [filters, setFilters] = useState(initialFilters);
  const [localFilters, setLocalFilters] = useState(initialFilters);
  const [sports, setSports] = useState([]);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await fetch("/api/sports");
        if (response.ok) {
          const data = await response.json();
          setSports(data);
        }
      } catch (error) {
        console.error("Error fetching sports:", error);
      }
    };

    fetchSports();
  }, []);

  const handleChange = (key, value) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    setFilters(localFilters);
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      startDate: "",
      endDate: "",
      instructorId: "all",
      sport: "all",
      showOnlyCompleted: false,
      showOnlyPrivateCompleted: false,
      showOnlyCanceled: false,
      showOnlyPrivateCanceled: false,
      showOnlyDelegated: false,
      showOnlyReceived: false,
      showOnlyPrivateDelegated: false,
      showOnlyPrivateReceived: false,
    };
    setLocalFilters(resetFilters);
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="w-full space-y-6 rounded-md p-4 border-l bg-[#F2EEEC]">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        تصفية حسب <Filter className="w-4 h-4" />
      </h2>

      <div className="flex gap-5 items-center">
        <div>
          <label className="text-sm text-muted-foreground">من تاريخ</label>
          <input
            type="date"
            className="border p-2 rounded w-full mt-1"
            value={localFilters.startDate}
            onChange={(e) => handleChange("startDate", e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-muted-foreground">إلى تاريخ</label>
          <input
            type="date"
            className="border p-2 rounded w-full mt-1"
            value={localFilters.endDate}
            onChange={(e) => handleChange("endDate", e.target.value)}
          />
        </div>
        {!isInstructor && (
          <div className="w-1/4">
            <label className="text-sm text-muted-foreground">المدرب</label>
            <Select
              value={localFilters.instructorId}
              onValueChange={(value) => handleChange("instructorId", value)}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="اختر المدرب" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                {instructors.map((instructor) => (
                  <SelectItem
                    key={instructor.instructorId}
                    value={instructor.instructorId}
                  >
                    {instructor.instructorName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="w-1/4">
          <label className="text-sm text-muted-foreground">الرياضة</label>
          <Select
            value={localFilters.sport}
            onValueChange={(value) => handleChange("sport", value)}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="اختر الرياضة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">الكل</SelectItem>
              {sports.map((sport) => (
                <SelectItem key={sport._id} value={sport._id}>
                  {sport.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="flex items-center gap-2">
          <Checkbox
            id="showOnlyCompleted"
            checked={localFilters.showOnlyCompleted}
            onCheckedChange={(checked) =>
              handleChange("showOnlyCompleted", checked)
            }
          />
          <label htmlFor="showOnlyCompleted" className="text-sm">
            الجلسات المكتملة فقط
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="showOnlyPrivateCompleted"
            checked={localFilters.showOnlyPrivateCompleted}
            onCheckedChange={(checked) =>
              handleChange("showOnlyPrivateCompleted", checked)
            }
          />
          <label htmlFor="showOnlyPrivateCompleted" className="text-sm">
            الجلسات الخاصة المكتملة فقط
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="showOnlyCanceled"
            checked={localFilters.showOnlyCanceled}
            onCheckedChange={(checked) =>
              handleChange("showOnlyCanceled", checked)
            }
          />
          <label htmlFor="showOnlyCanceled" className="text-sm">
            الجلسات الملغاة فقط
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="showOnlyPrivateCanceled"
            checked={localFilters.showOnlyPrivateCanceled}
            onCheckedChange={(checked) =>
              handleChange("showOnlyPrivateCanceled", checked)
            }
          />
          <label htmlFor="showOnlyPrivateCanceled" className="text-sm">
            الجلسات الخاصة الملغاة فقط
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="showOnlyDelegated"
            checked={localFilters.showOnlyDelegated}
            onCheckedChange={(checked) =>
              handleChange("showOnlyDelegated", checked)
            }
          />
          <label htmlFor="showOnlyDelegated" className="text-sm">
            الجلسات المفوضة فقط
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="showOnlyReceived"
            checked={localFilters.showOnlyReceived}
            onCheckedChange={(checked) =>
              handleChange("showOnlyReceived", checked)
            }
          />
          <label htmlFor="showOnlyReceived" className="text-sm">
            الجلسات المستلمة فقط
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="showOnlyPrivateDelegated"
            checked={localFilters.showOnlyPrivateDelegated}
            onCheckedChange={(checked) =>
              handleChange("showOnlyPrivateDelegated", checked)
            }
          />
          <label htmlFor="showOnlyPrivateDelegated" className="text-sm">
            الجلسات الخاصة المفوضة فقط
          </label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="showOnlyPrivateReceived"
            checked={localFilters.showOnlyPrivateReceived}
            onCheckedChange={(checked) =>
              handleChange("showOnlyPrivateReceived", checked)
            }
          />
          <label htmlFor="showOnlyPrivateReceived" className="text-sm">
            الجلسات الخاصة المستلمة فقط
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleReset}>
          إعادة تعيين
        </Button>
        <Button onClick={handleApply}>تطبيق</Button>
      </div>
    </div>
  );
}
