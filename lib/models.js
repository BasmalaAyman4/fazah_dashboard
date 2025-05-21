// Sport Category model
export const SportCategory = {
  name: "",
  description: "",
  isActive: true,
  createdAt: Date,
  updatedAt: Date,
}

// Sport Subcategory model
export const SportSubcategory = {
  name: "",
  description: "",
  categoryId: "",
  isActive: true,
  createdAt: Date,
  updatedAt: Date,
}

// Schedule model
export const Schedule = {
  day: "",
  startTime: "",
  endTime: "",
  sportCategoryId: "",
  sportSubcategoryId: "",
  isActive: true,
  createdAt: Date,
  updatedAt: Date,
}

