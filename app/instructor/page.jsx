"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  PhoneIcon,
  MailIcon,
  UserIcon,
  InfoIcon,
} from "lucide-react";

export default function InstructorPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [sports, setSports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    description: "",
    image: null,
    sports: [],
    specialties: [],
    status: "active",
    joinDate: new Date(),
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");

  // Fetch sports from the API
  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await fetch("/api/sports");
        if (response.ok) {
          const data = await response.json();
          setSports(data);
          console.log(data);
        }
      } catch (error) {
        console.error("Error fetching sports:", error);
      }
    };

    fetchSports();
  }, []);

  // Fetch instructor data
  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        const response = await fetch("/api/instructors/me");
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "فشل في جلب بيانات المدرب");
        }
        const data = await response.json();
        console.log(data);
        setFormData({
          name: data.name || "",
          phone: data.phone || "",
          email: data.email || "",
          description: data.description || "",
          image: data.image || null,
          sports: Array.isArray(data.sports) ? data.sports : [],
          specialties: Array.isArray(data.specialties) ? data.specialties : [],
          status: data.status || "active",
          joinDate: data.createdAt?.slice(0, 10) || new Date(),
        });
        if (data.image) {
          setPreviewImage(data.image);
        }
      } catch (error) {
        console.error("Error fetching instructor data:", error);
        toast({
          title: "خطأ",
          description: error.message || "حدث خطأ أثناء تحميل بيانات المدرب",
          variant: "destructive",
        });
      }
    };

    if (session?.user) {
      fetchInstructorData();
    }
  }, [session, toast]);

  // Handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });

      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle sport selection
  const handleSportChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      sports: Array.isArray(prev.sports) ? [...prev.sports, value] : [value],
    }));
  };

  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    setPasswordError("");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "sports") {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await fetch("/api/instructors/me", {
        method: "PUT",
        body: formDataToSend,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "فشل في تحديث بيانات المدرب");
      }

      toast({
        title: "تم التحديث",
        description: "تم تحديث بيانات المدرب بنجاح",
      });
    } catch (error) {
      console.error("Error updating instructor:", error);
      toast({
        title: "خطأ",
        description: error.message || "حدث خطأ أثناء تحديث بيانات المدرب",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password change submission
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("كلمات المرور الجديدة غير متطابقة");
      setIsLoading(false);
      return;
    }

    // Validate password strength
    if (passwordData.newPassword.length < 8) {
      setPasswordError("يجب أن تكون كلمة المرور الجديدة 8 أحرف على الأقل");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/instructor/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      if (response.ok) {
        toast({
          title: "تم تغيير كلمة المرور بنجاح",
          description: "تم تحديث كلمة المرور الخاصة بك",
        });
        // Clear password fields
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to change password");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast({
        title: "خطأ في تغيير كلمة المرور",
        description: error.message || "حدث خطأ أثناء محاولة تغيير كلمة المرور",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1  gap-8 relative">
      {/* Right side - Profile Information */}
      <div className="w-1/3 h-fit sticky top-3">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-32 w-32">
                <AvatarImage
                  src={previewImage || "/placeholder-avatar.webp"}
                  alt="Instructor"
                />
                <AvatarFallback>IN</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">{formData.name}</CardTitle>
            <div className="flex justify-center">
              <Badge variant="outline">
                {formData.status === "active" ? "مدرب معتمد" : "غير نشط"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="mb-5">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <InfoIcon className="h-5 w-5" />
                نبذة عن المدرب
              </h3>
              <p className="text-gray-600">
                {formData.description || "لا توجد نبذة عن المدرب"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-gray-500" />
              <span>
                تاريخ الانضمام:{" "}
                {new Date(formData.joinDate).toLocaleDateString("ar-SA")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-gray-500" />
              <span>
                الرياضات:{" "}
                {Array.isArray(formData.sports) && formData.sports.length > 0
                  ? formData.sports.map((sport) => sport.name).join("، ")
                  : "لا توجد رياضات"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              الحالة:
              <Badge>{formData.status === "active" ? "نشط" : "غير نشط"}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <PhoneIcon className="h-5 w-5 text-gray-500" />
              <span>{formData.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MailIcon className="h-5 w-5 text-gray-500" />
              <span>{formData.email}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Left side - Edit Form */}
      <div className="w-2/3">
        <Card>
          <CardHeader>
            <CardTitle>تعديل الملف الشخصي</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="image">الصورة الشخصية</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="أدخل اسمك"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">رقم الجوال</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+966 50 123 4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sport">الرياضات</Label>
                  <Select onValueChange={handleSportChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="اختر الرياضات" />
                    </SelectTrigger>
                    <SelectContent>
                      {sports.map((sport) => (
                        <SelectItem key={sport._id} value={sport._id}>
                          {sport.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Array.isArray(formData.sports) &&
                      formData.sports.map((sport) => (
                        <Badge
                          key={sport._id}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {sport.name}
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                sports: prev.sports.filter(
                                  (s) => s._id !== sport._id
                                ),
                              }));
                            }}
                            className="ml-1 hover:text-destructive"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">نبذة عن المدرب</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="اكتب نبذة عن نفسك وخبراتك"
                  rows={4}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>تغيير كلمة المرور</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">كلمة المرور الحالية</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="أدخل كلمة المرور الحالية"
                />
              </div>
              <div className="flex gap-4">
                <div className="space-y-2 flex-1">
                  <Label htmlFor="newPassword">كلمة المرور الجديدة</Label>
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="أدخل كلمة المرور الجديدة"
                  />
                </div>

                <div className="space-y-2 flex-1">
                  <Label htmlFor="confirmPassword">
                    تأكيد كلمة المرور الجديدة
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="أدخل كلمة المرور الجديدة مرة أخرى"
                  />
                </div>
              </div>
              {passwordError && (
                <div className="text-red-500 text-sm">{passwordError}</div>
              )}

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "جاري التحديث..." : "تغيير كلمة المرور"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
