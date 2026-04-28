// ─── Medications (matches Amanda's meds from screenshots) ───────────────────
export interface Medication {
  id: string;
  name: string;
  genericName: string;
  dose: string;
  form: string;
  frequency: string;
  instructions: string;
  uses: string[];
  sideEffects: string[];
  cautions: string[];
  color: string;
  addedDate: string;
}

export const medications: Medication[] = [
  {
    id: 'm1',
    name: 'Acetaminophen Oral Capsule 500 Mg',
    genericName: 'Acetaminophen (TYLENOL)',
    dose: '500 mg',
    form: 'Oral Capsule',
    frequency: 'Every 4–6 hours as needed',
    instructions: 'Take one capsule by mouth every 4 to 6 hours as needed for pain. Max 3,000 mg/day.',
    uses: ['fever', 'pain'],
    sideEffects: ['signs of liver damage (yellowing of eye or skin, dark urine, unusual tiredness)'],
    cautions: ['Do not drink beverages with alcohol while on this medicine.', 'Do not use more than instructed.', 'Tell your doctor if you are pregnant or breastfeeding.'],
    color: '#D97706',
    addedDate: 'Dec 29, 2025',
  },
  {
    id: 'm2',
    name: 'Aspirin Oral Tablet 81 Mg  - Tablet',
    genericName: 'Aspirin (Bayer)',
    dose: '81 mg',
    form: 'Oral Tablet',
    frequency: 'Once daily',
    instructions: 'Take one tablet by mouth once daily with food.',
    uses: ['heart attack prevention', 'blood clot prevention', 'pain'],
    sideEffects: ['stomach upset or heartburn', 'nausea', 'unusual bleeding'],
    cautions: ['Do not give to children under 12.', 'Tell your doctor if you are pregnant.', 'Avoid alcohol while taking this medicine.'],
    color: '#DC2626',
    addedDate: 'Dec 29, 2025',
  },
];

// ─── Insurance Cards ─────────────────────────────────────────────────────────
export const insuranceCards = [
  {
    id: 'i1',
    provider: 'Blue Cross Blue Shield',
    memberId: 'BCB-20594926-01',
    groupNumber: 'GRP-88821',
    planName: 'PPO Preferred Plus',
    holderName: 'Amanda Lee',
    effectiveDate: 'Jan 1, 2026',
    color: '#1D4ED8',
  },
  {
    id: 'i2',
    provider: 'Dental Care Plus',
    memberId: 'DCP-77842-A',
    groupNumber: 'GRP-44192',
    planName: 'Delta Dental Premier',
    holderName: 'Amanda Lee',
    effectiveDate: 'Jan 1, 2026',
    color: '#7C3AED',
  },
];

// ─── Schedules ───────────────────────────────────────────────────────────────
export const schedules = [
  {
    id: 's1',
    title: 'Acetaminophen 500mg',
    time: '08:00 AM',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    type: 'medication' as const,
    active: true,
  },
  {
    id: 's2',
    title: 'Aspirin 81mg',
    time: '09:00 AM',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    type: 'medication' as const,
    active: true,
  },
  {
    id: 's3',
    title: 'Dr. Kevin Adams — Follow-Up',
    time: '10:30 AM',
    days: ['May 5'],
    type: 'appointment' as const,
    active: true,
  },
];

// ─── AI Chat Mock Responses ───────────────────────────────────────────────────
export interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const initialAIMessages: ChatMessage[] = [
  {
    id: 'ai-0',
    role: 'ai',
    text: 'Ask me about your medications',
    timestamp: '',
  },
];

export function getAIResponse(userMessage: string, meds: Medication[]): string {
  const lower = userMessage.toLowerCase();
  const medNames = meds.map((m) => m.genericName.split(' ')[0].toLowerCase());

  if (lower.includes('headache')) {
    return `I understand your concern about the headache you've been experiencing. Based on the medication details I have, headaches aren't listed as a common side effect of ${meds[0]?.genericName ?? 'your medications'}. However, it's important to remember that everyone's body reacts differently.\n\nI recommend consulting your healthcare provider to determine if there's a connection. They can assess your overall health and provide personalized advice.`;
  }
  if (lower.includes('yellow') || lower.includes('liver')) {
    return `I understand your concern about your eyes appearing yellow. Based on the medication details for ${meds[0]?.genericName ?? 'Acetaminophen'}, one of the side effects of taking too much is signs of liver damage, such as yellowing of the eyes or skin.\n\nI recommend contacting your healthcare provider immediately to let them know about this symptom. This requires prompt evaluation.`;
  }
  if (lower.includes('side effect') || lower.includes('side effects')) {
    const sideEffects = meds.flatMap((m) => m.sideEffects).join(', ');
    return `Based on your current medications, the known side effects include: ${sideEffects}.\n\nAlways contact your healthcare provider if you experience anything unusual or concerning. Never stop a medication without consulting your doctor first.`;
  }
  if (lower.includes('pain') || lower.includes('hurt')) {
    return `For pain management, ${meds[0]?.genericName ?? 'Acetaminophen'} can be used as directed — ${meds[0]?.instructions ?? 'take as prescribed'}.\n\nIf your pain is not controlled with your current medications, please reach out to Dr. Kevin Adams for further evaluation.`;
  }
  if (lower.includes('fever')) {
    return `Acetaminophen is effective for reducing fever. Take as directed — ${meds[0]?.instructions ?? 'per your prescription'}.\n\nIf your fever exceeds 103°F or persists more than 3 days, contact your healthcare provider immediately.`;
  }
  if (lower.includes('missed') || lower.includes('forgot')) {
    return `If you missed a dose, take it as soon as you remember — unless it's almost time for your next dose. In that case, skip the missed dose and continue your regular schedule.\n\nNever take two doses at once to make up for a missed one.`;
  }
  if (lower.includes('alcohol')) {
    return `Important: Do not drink alcohol while taking your current medications. Both Acetaminophen and Aspirin have interactions with alcohol that can increase risk of side effects.\n\nPlease discuss any questions about this with Dr. Kevin Adams at your next visit.`;
  }
  if (lower.includes('discharge') || lower.includes('hospital')) {
    return `I can see you were recently discharged. Your post-discharge medications have been recorded. Remember to:\n\n• Take all medications as prescribed\n• Attend all follow-up appointments\n• Watch for warning signs from your discharge paper\n\nUse the Discharge tab at the bottom to view your full discharge analysis.`;
  }
  return `Thank you for your question. Based on your medication profile — ${meds.map((m) => m.genericName).join(', ')} — I'm here to help you understand your medications and symptoms.\n\nFor any health concerns, I always recommend consulting with your healthcare provider, Dr. Kevin Adams, who can provide personalized medical advice.`;
}

// ─── Discharge Analysis Mock Output ─────────────────────────────────────────
export interface DischargeReminder {
  id: string;
  type: 'medication' | 'appointment' | 'instruction';
  title: string;
  subtitle: string;
  date: string;
  time: string;
  repeat?: string;
  isSet: boolean;
  notificationId?: string;
}

export interface ParsedDischarge {
  patientName: string;
  patientDOB: string;
  mrn: string;
  admittedDate: string;
  dischargedDate: string;
  hospital: string;
  dischargingPhysician: string;
  primaryDiagnosis: string;
  secondaryDiagnoses: string[];
  procedures: string[];
  dischargeMedications: Array<{
    name: string;
    dose: string;
    frequency: string;
    duration: string;
    purpose: string;
  }>;
  followUpAppointments: Array<{
    id: string;
    provider: string;
    specialty: string;
    date: string;
    time: string;
    location: string;
    phone: string;
  }>;
  followUpInstructions: string[];
  warningSigns: string[];
  activityRestrictions: string[];
  dietInstructions: string[];
}

export const mockParsedDischarge: ParsedDischarge = {
  patientName: 'Amanda Lee',
  patientDOB: 'March 14, 1991',
  mrn: 'MRN-20594926',
  admittedDate: 'April 20, 2026',
  dischargedDate: 'April 24, 2026',
  hospital: 'Oakridge Family Medicine Center',
  dischargingPhysician: 'Dr. Kevin Adams, MD',
  primaryDiagnosis: 'Community-Acquired Pneumonia (CAP) — Moderate Severity',
  secondaryDiagnoses: [
    'Mild Dehydration',
    'Reactive Airway Disease (mild)',
  ],
  procedures: [
    'Chest X-Ray — bilateral lower lobe infiltrates confirmed',
    'Blood cultures × 2 — pending at discharge',
    'IV fluid resuscitation — 2L Normal Saline',
    'Pulse oximetry monitoring — O2 sat maintained >94%',
    'Nebulized albuterol treatments q4h during admission',
  ],
  dischargeMedications: [
    {
      name: 'Amoxicillin-Clavulanate (Augmentin)',
      dose: '875 mg',
      frequency: 'Twice daily with food',
      duration: '10 days (complete full course)',
      purpose: 'Antibiotic — treats bacterial pneumonia',
    },
    {
      name: 'Prednisone',
      dose: '40 mg (tapering)',
      frequency: 'Once daily in morning — reduce by 10mg every 3 days',
      duration: '12 days — do NOT stop abruptly',
      purpose: 'Reduces airway inflammation',
    },
    {
      name: 'Albuterol Inhaler (Rescue)',
      dose: '2 puffs (90 mcg each)',
      frequency: 'Every 4–6 hours as needed for shortness of breath',
      duration: 'As needed — refill if used >1 inhaler/month',
      purpose: 'Opens airways quickly when short of breath',
    },
    {
      name: 'Ibuprofen (Advil / Motrin)',
      dose: '400 mg',
      frequency: 'Every 6 hours as needed',
      duration: '5–7 days — take with food',
      purpose: 'Reduces fever and chest wall pain',
    },
  ],
  followUpAppointments: [
    {
      id: 'appt1',
      provider: 'Dr. Kevin Adams',
      specialty: 'Primary Care / Internal Medicine',
      date: 'May 5, 2026',
      time: '10:30 AM',
      location: 'Oakridge Family Medicine, 321 Pine Street, Atlanta, GA 33038',
      phone: '(404) 555-0192',
    },
    {
      id: 'appt2',
      provider: 'Dr. Sarah Mitchell',
      specialty: 'Pulmonology',
      date: 'May 12, 2026',
      time: '2:00 PM',
      location: 'Atlanta Lung Specialists, Building B, Suite 210',
      phone: '(404) 555-0284',
    },
    {
      id: 'appt3',
      provider: 'Lab — Repeat Chest X-Ray',
      specialty: 'Radiology',
      date: 'April 29, 2026',
      time: '9:00 AM',
      location: 'Oakridge Radiology — same building, Ground Floor',
      phone: '(404) 555-0101',
    },
  ],
  followUpInstructions: [
    'Complete the full antibiotic course — do not stop early even if feeling better',
    'Use rescue inhaler (Albuterol) if you feel short of breath — do not wait until severe',
    'Do NOT stop Prednisone suddenly — follow the tapering schedule exactly',
    'Drink at least 8 glasses of water per day to aid recovery',
    'Rest for at least 5–7 days — avoid strenuous activity',
    'Check your temperature daily — log it and bring readings to your follow-up',
    'Wash hands frequently to prevent spreading infection',
  ],
  warningSigns: [
    'Worsening shortness of breath or difficulty breathing at rest',
    'Lips, fingertips, or fingernails turning blue or gray (cyanosis)',
    'Chest pain or sharp pain when breathing',
    'Fever above 103°F (39.4°C) that does not respond to Ibuprofen',
    'Coughing up blood-tinged or rust-colored mucus',
    'Confusion, extreme fatigue, or inability to stay awake',
    'New rash, severe itching, or throat swelling (allergic reaction)',
  ],
  activityRestrictions: [
    'No strenuous exercise, running, or heavy lifting for 10–14 days',
    'No swimming or submerging in water until cleared by physician',
    'Avoid crowds and people who are sick for 1 week',
    'Do not smoke or be around secondhand smoke during recovery',
    'Short walks as tolerated — increase gradually based on how you feel',
  ],
  dietInstructions: [
    'Eat light, nutritious meals — soups, broths, fruits, and vegetables',
    'Avoid dairy if it increases mucus production',
    'No alcohol during antibiotic course',
    'Stay well-hydrated — minimum 2 liters water per day',
  ],
};
