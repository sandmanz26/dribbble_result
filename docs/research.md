# Rawat: research notes

Research done before redesigning, so the product follows how an Indonesian primary clinic actually
runs. Secondary sources are marked; regulations should be checked against JDIH Kemenkes before a
real build.

## Regulation the software must respect
- **Electronic medical records**: Permenkes 24/2022 requires every facility to run electronic
  records (deadline 31 Dec 2023), keep them at least 25 years after the last visit, keep an audit
  trail, and register the system as a health-sector electronic system operator (PSE).
  -> Activity log on every action and record opening; retention stated on Patients; no editing of
  signed records.
- **SATUSEHAT**: visits are sent as FHIR resources: Encounter, Condition (ICD-10), Observation
  (vital signs), MedicationRequest (needs the KFA drug code). Practitioners need an IHS number and
  patients are identified by NIK. Common rejections: unregistered organization or location, missing
  practitioner IHS, wrong terminology mapping. OAuth tokens last about an hour.
  -> KFA code on every drug, IHS number on every doctor, the failure case "practitioner IHS missing"
  with its fix and retry.
- **BPJS (JKN)**: participants start care at the FKTP they registered with; PCare bridging sends
  visits, diagnoses and referrals; Mobile JKN lets patients take a queue number, and the clinic's
  practice schedule must be kept current for that to work.
  -> Live participant check with three outcomes, Mobile JKN check-in, schedule published to Mobile JKN.
- **144 diagnoses** (Kepmenkes HK.01.07/MENKES/1186/2022, from Permenkes 28/2014): diseases a GP
  treats to completion at primary care; referral is still allowed with a medical indication.
  -> Flag in the referral form and a required indication.
- **Capitation and KBK**: Permenkes 3/2023 sets klinik pratama capitation at Rp 9,000 to 16,000 per
  participant per month (depends on doctor ratio). Kapitasi Berbasis Kinerja adjusts payment on
  three indicators: contact rate ≥ 150‰, non-specialist referral ratio ≤ 2%, controlled Prolanis
  ratio ≥ 5% (BPJS targets cited by secondary sources).
  -> Reports lead with KBK; Asa's Prolanis reminders exist to move the weakest indicator.
- **Non-capitation**: antenatal care, family planning, ambulance and similar are claimed per service.
  -> Cashier distinguishes capitation-covered from claimed visits.
- **Pharmacy**: Permenkes 34/2021 (pharmacy services in clinics) requires a pharmacist in charge;
  storage by first-expiry-first-out and monthly stock counts are common practice; psychotropics and
  narcotics are reported to SIPNAP.
  -> Pharmacist review, label, counsel steps; batches with expiry; stock count; SIPNAP note.
- **Waiting time**: 60 minutes from registration to doctor is the outpatient standard most clinics
  measure against (from the hospital minimum service standard, Kepmenkes 129/2008); studies of
  primary clinics report averages near or above it.
  -> Wait shown everywhere, amber at 40 and red at 60 minutes, median and 90th percentile in Reports.
- **Clinic licensing**: Permenkes 14/2021 has been replaced by Permenkes 11/2025 for clinic
  business standards (secondary source).

## Business model of a klinik pratama
Income: BPJS capitation (participants × rate, paid whether or not they visit), BPJS non-capitation
claims, self-pay, private insurance and company contracts. Because capitation does not grow with
visits, cost per BPJS visit and the KBK indicators matter more than volume; self-pay and insurance
carry the margin. Staff: front desk, nurses, GPs, a dentist, a midwife, a pharmacist, a cashier and a
manager, each needing only part of the system.

## Competitors (Indonesia)
Trustmedis (full hospital and clinic system up to accounting), eClinic (PCare, SATUSEHAT and
ePuskesmas reporting, accreditation focus), DoctorTool (registration and PCare integration),
HashMicro clinic module, DIGIClinic (AdMedika and Telkom), and SIMGOS from Kemenkes (free, connected
to SATUSEHAT and BPJS). Integration with BPJS and SATUSEHAT is table stakes; the gaps Rawat targets
are the floor view of waiting time, failures that explain their own fix, and an assistant that
removes administrative work without touching clinical decisions.

## Sources
- Permenkes 24/2022 summaries: ojs.udb.ac.id, jurnal.ubd.ac.id, republika.co.id (26 Sep 2022)
- SATUSEHAT implementation notes: medminutes.io, packagist satusehat libraries, docs.openfn.org
- KBK targets: menpan.go.id, journals.uima.ac.id, ejournal.undip.ac.id
- Capitation 2023: cnnindonesia.com, tirto.id, kemkes.go.id, peraturan.go.id (Permenkes 3/2023)
- 144 diagnoses: bisnis.com, detik.com, antaranews.com, ukmindonesia.id
- Pharmacy: farmalkes.kemkes.go.id (PMK 34/2021), university reports on clinic pharmacy practice
- Mobile JKN queue: antaranews.com, detik.com, infobanknews.com
- Waiting time: repository.unair.ac.id, journal.universitaspahlawan.ac.id and other studies
- Competitors: hashmicro.com, jpnn.com (eClinic), gizmologi.id, keslan.kemkes.go.id (SIMGOS),
  mediaasuransinews.co.id (DoctorTool)
