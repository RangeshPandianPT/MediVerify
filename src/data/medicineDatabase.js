// Medicine database with comprehensive information
export const medicineDatabase = [
  {
    id: 1,
    name: "Paracetamol",
    genericName: "Acetaminophen",
    category: "Analgesic/Antipyretic",
    dosage: "500mg",
    form: "Tablet",
    manufacturer: "Multiple",
    batchNumber: "PCT001",
    expiryDate: "2025-12-31",
    description: "Used for pain relief and fever reduction",
    sideEffects: ["Nausea", "Skin rash", "Liver damage (overdose)"],
    contraindications: ["Severe liver disease", "Alcohol dependence"],
    dosageInstructions: "Adults: 1-2 tablets every 4-6 hours. Maximum 8 tablets in 24 hours.",
    activeIngredients: ["Paracetamol 500mg"],
    storage: "Store in a cool, dry place below 30°C",
    warnings: ["Do not exceed recommended dose", "Keep out of reach of children"],
    interactions: ["Warfarin", "Carbamazepine", "Phenytoin"]
  },
  {
    id: 2,
    name: "Ibuprofen",
    genericName: "Ibuprofen",
    category: "NSAID",
    dosage: "400mg",
    form: "Tablet",
    manufacturer: "Various",
    batchNumber: "IBU002",
    expiryDate: "2026-06-30",
    description: "Anti-inflammatory, analgesic, and antipyretic",
    sideEffects: ["Stomach upset", "Dizziness", "Heartburn"],
    contraindications: ["Peptic ulcer", "Severe heart failure", "Pregnancy (3rd trimester)"],
    dosageInstructions: "Adults: 1 tablet every 6-8 hours with food. Maximum 3 tablets daily.",
    activeIngredients: ["Ibuprofen 400mg"],
    storage: "Store below 25°C in original packaging",
    warnings: ["Take with food", "May increase bleeding risk"],
    interactions: ["Aspirin", "ACE inhibitors", "Lithium", "Methotrexate"]
  },
  {
    id: 3,
    name: "Amoxicillin",
    genericName: "Amoxicillin",
    category: "Antibiotic",
    dosage: "500mg",
    form: "Capsule",
    manufacturer: "GSK",
    batchNumber: "AMX003",
    expiryDate: "2025-09-15",
    description: "Penicillin antibiotic for bacterial infections",
    sideEffects: ["Diarrhea", "Nausea", "Skin rash", "Allergic reactions"],
    contraindications: ["Penicillin allergy", "Mononucleosis"],
    dosageInstructions: "Adults: 1 capsule three times daily for 7-10 days. Complete the course.",
    activeIngredients: ["Amoxicillin 500mg"],
    storage: "Store in refrigerator (2-8°C) if liquid form",
    warnings: ["Complete full course", "Report allergic reactions immediately"],
    interactions: ["Warfarin", "Oral contraceptives", "Methotrexate"]
  },
  {
    id: 4,
    name: "Aspirin",
    genericName: "Acetylsalicylic Acid",
    category: "NSAID/Antiplatelet",
    dosage: "100mg",
    form: "Tablet",
    manufacturer: "Bayer",
    batchNumber: "ASP004",
    expiryDate: "2026-03-20",
    description: "Low-dose aspirin for cardiovascular protection",
    sideEffects: ["Stomach irritation", "Bleeding risk", "Tinnitus"],
    contraindications: ["Active bleeding", "Severe asthma", "Children under 16"],
    dosageInstructions: "Adults: 1 tablet daily with food, preferably in the evening.",
    activeIngredients: ["Acetylsalicylic Acid 100mg"],
    storage: "Store in a cool, dry place away from moisture",
    warnings: ["Increases bleeding risk", "Avoid in viral infections in children"],
    interactions: ["Warfarin", "Ibuprofen", "ACE inhibitors"]
  },
  {
    id: 5,
    name: "Metformin",
    genericName: "Metformin HCl",
    category: "Antidiabetic",
    dosage: "850mg",
    form: "Tablet",
    manufacturer: "Teva",
    batchNumber: "MET005",
    expiryDate: "2025-11-10",
    description: "First-line treatment for type 2 diabetes",
    sideEffects: ["Nausea", "Diarrhea", "Metallic taste", "Vitamin B12 deficiency"],
    contraindications: ["Kidney disease", "Liver disease", "Heart failure"],
    dosageInstructions: "Adults: 1 tablet twice daily with meals. Start with lower dose.",
    activeIngredients: ["Metformin Hydrochloride 850mg"],
    storage: "Store at room temperature, protect from moisture",
    warnings: ["Monitor kidney function", "Risk of lactic acidosis"],
    interactions: ["Alcohol", "Contrast media", "Cimetidine"]
  }
];

export const searchMedicine = (query) => {
  if (!query) return medicineDatabase;
  
  const searchTerm = query.toLowerCase();
  return medicineDatabase.filter(medicine => 
    medicine.name.toLowerCase().includes(searchTerm) ||
    medicine.genericName.toLowerCase().includes(searchTerm) ||
    medicine.category.toLowerCase().includes(searchTerm) ||
    medicine.manufacturer.toLowerCase().includes(searchTerm)
  );
};

export const getMedicineById = (id) => {
  return medicineDatabase.find(medicine => medicine.id === id);
};

export const getMedicinesByCategory = (category) => {
  return medicineDatabase.filter(medicine => 
    medicine.category.toLowerCase() === category.toLowerCase()
  );
};

export const getExpiringMedicines = (days = 30) => {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  
  return medicineDatabase.filter(medicine => {
    const expiryDate = new Date(medicine.expiryDate);
    return expiryDate <= futureDate;
  });
};