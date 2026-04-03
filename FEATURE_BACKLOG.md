# MediVerify Feature Backlog

This document lists features that can be added to improve MediVerify from prototype to production-ready platform.

## Current Status

### Recently implemented
- Confidence band output (`high`, `medium`, `low`)
- OCR quality scoring and suspicious fallback for low-quality scans
- Action recommendation text in verification response
- Save verification result to local history
- User feedback capture (`helpful` / `needs review`)
- Explainable verification result panel with supporting and concerning signals
- Scan-quality advisory with retake guidance for low-quality captures
- Medicine reference autocomplete for manufacturer and batch lookup
- PDF and CSV verification report export
- Offline queue with automatic retry when the connection returns

## Priority 0 (Critical for Production)

### Security and Abuse Protection
- Add API authentication and token-based access for verification endpoints
- Add role-based access (`user`, `pharmacist`, `admin`, `regulator`)
- Add backend rate limiting per IP and per user for `/api/verify`
- Add request signature checks for sensitive reporting actions
- Add strict upload validation (content type, extension, magic-byte checks)
- Add malware scanning pipeline for uploaded files
- Add CSRF protection for browser-based authenticated actions
- Add secure headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)
- Add audit logs for all safety-critical operations

### Reliability and Observability
- Add structured logging with correlation IDs
- Add request/response latency metrics and error-rate metrics
- Add model inference metrics (confidence distribution, suspicious rate)
- Add health/readiness/liveness checks for all services
- Add centralized dashboards and alerting
- Add retry with backoff for transient backend dependencies

### Data Safety and Compliance
- Add encryption at rest for stored metadata and reports
- Add encryption in transit with strict TLS settings
- Add PII masking/redaction in logs
- Add data retention and deletion policies
- Add consent and privacy policy acceptance tracking

## Priority 1 (High Product Impact)

### Verification Intelligence
- Add explainable result panel (top factors behind authenticity decision)
- Add calibrated confidence using validation curves
- Add model ensemble voting strategy for stronger decisions
- Add low-light and blur quality detector before inference
- Add duplicate-image detection to reduce repeated submissions
- Add barcode/QR verification against manufacturer databases
- Add batch-number consistency checks against known records
- Add package tamper signal detection (seal damage, print mismatch)

### OCR and Extraction Quality
- Add multilingual OCR support (English + regional languages)
- Add field-level OCR confidence for each extracted item
- Add OCR post-processing with medicine dictionary correction
- Add mandatory checks for key fields (name, batch, expiry)
- Add user correction flow for OCR mistakes

### Reporting and Safety Actions
- Add one-click counterfeit report to regulator workflow
- Add geotag-aware incident clustering for local alerts
- Add escalation workflow for repeated fake detections
- Add hotline and emergency guidance module with region-specific numbers

## Priority 2 (User Experience and Workflow)

### Verification Flow UX
- Add guided camera overlay with alignment hints
- Add blur/light warning before upload
- Add multi-angle capture flow for better accuracy
- Add comparison view (captured pack vs reference pack)
- Add verification confidence trend for repeated scans

### History and Results UX
- Add advanced filters (date, status, medicine, confidence band)
- Add CSV/PDF export with signed verification metadata
- Add shareable verification summary link
- Add pinned/flagged records in history
- Add edit notes and tags on verification results

### Accessibility and Localization
- Add complete i18n support across UI
- Add high-contrast mode and improved keyboard navigation
- Add screen-reader optimized labels and landmarks
- Add text scaling and responsive readability improvements

## Priority 3 (Offline and Performance)

### Offline-First Capability
- Add offline queue for verification requests
- Add automatic sync on reconnect with conflict handling
- Add local cache for medicine reference dataset
- Add offline status and sync diagnostics page

### Performance Optimization
- Add image compression pipeline before upload
- Add lazy-loading for heavy UI sections
- Add caching for common API responses
- Add CDN strategy for static assets
- Add model warm-up and inference batching

## Priority 4 (Platform and Integrations)

### Admin and Operations
- Add admin dashboard for detection trends and model health
- Add feedback triage panel for wrong predictions
- Add configurable verification thresholds by environment
- Add feature flags for safe progressive rollout

### External Integrations
- Add manufacturer verification API integration
- Add pharmacy ERP integration for stock validation
- Add regulator/reporting API integration for counterfeit notifications
- Add WhatsApp/SMS notification integration for urgent safety alerts

### Analytics and Insights
- Add weekly and monthly safety insights report generation
- Add fake-detection hotspot maps
- Add cohort analysis by region, medicine type, and source
- Add model drift detection and retraining triggers

## Testing and Quality Strategy

### Automated Testing
- Add backend unit tests for predictor, OCR, and route validation
- Add API integration tests for success and failure scenarios
- Add frontend unit tests for verification components
- Add end-to-end tests for full verification journey
- Add visual regression tests for result/status UI cards

### Quality Gates in CI/CD
- Add lint, type-check, tests, and build as mandatory checks
- Add dependency vulnerability scanning in CI
- Add container/image scanning before deployment
- Add staging smoke tests post-deploy

## Suggested Release Sequence

1. Secure and stabilize API (auth, rate limits, validation, logging)
2. Improve verification trust (explainability, OCR confidence, quality gates)
3. Strengthen user workflow (history tools, reporting, accessibility)
4. Add offline and performance improvements
5. Build admin/analytics and external integrations

## Notes

- Keep this file updated whenever a feature is shipped.
- Use issue IDs next to items once tracking starts (example: `[MV-123] Add API rate limiting`).
- Move completed items to a separate changelog section as implementation progresses.
