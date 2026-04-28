Synthetic US-Style Hospital Discharge Paper Samples

These files are fictional test documents for software development only. They do not contain real patient data and are not medical advice.

Use cases:
- PDF parsing/OCR testing
- Medication extraction
- Follow-up appointment extraction
- Red-flag/return-precaution extraction
- Post-discharge reminder generation
- FHIR/C-CDA style workflow testing

Recommended parser checks:
1. Identify patient demographics without treating them as real PHI.
2. Extract diagnosis list.
3. Extract medication name, dose, route, frequency, duration, and start/stop/change status.
4. Extract follow-up appointments and due dates.
5. Extract return precautions.
6. Extract care instructions such as diet, activity, wound care, and home monitoring.
7. Flag high-risk cases such as heart failure weight gain, COPD oxygen, diabetes insulin changes, infection symptoms, or post-op complications.

More public synthetic data sources to consider:
- Synthea synthetic patient records in FHIR, C-CDA, and CSV formats.
- HL7 US Core examples.
