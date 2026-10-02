# Medisync

### Medicine at risk. Action before shortage.

Medisync is a student-built prototype for medicine inventory visibility and supply-chain risk. It brings risk explanations, supplier comparison, batch traceability, and refill planning into one clear workflow.

> **Prototype notice:** all records are fictional demo data. The project does not connect to pharmacies, inventory systems, patient records, barcode scanners, GPS, or messaging providers. It does not place orders or provide medical advice.

## Explore the demo

Open [`index.html`](./index.html) in a modern browser. No package installation, build step, or API key is required. The Google Fonts import is optional; system fonts remain available offline.

The site is ready for GitHub Pages deployment. After this repository is created, choose **Settings → Pages → GitHub Actions** as the publishing source. The included workflow publishes the root static site when changes are pushed to `main`.

## What you can try

- **Risk Radar:** select one of six medicines and inspect a weighted score, contributing factors, and a plain-language next step.
- **Alternative Supplier Finder:** change quantity, delivery time, distance, and reliability requirements; supplier eligibility and failure reasons recalculate immediately.
- **Batch traceability:** follow a sample lot from manufacturer to distributor to hospital pharmacy. Events are labeled as simulated scan records.
- **Refill plan preview:** choose a preferred delivery day and review a confirmation step. The demo never submits an order.
- **Accessible display:** increase text size, switch to high contrast, navigate by keyboard, and use responsive layouts.
- **Evidence and project rationale:** review cited supply-chain sources and common hackathon evaluation themes on the site.

## Risk model

The demo calculates a score from five factors: stockout proximity (30%), shipment delay (20%), supplier reliability (15%), expiry exposure (15%), and unusual inventory movement (20%). Each factor is scored from 0 to 100; weighted contributions are summed and rounded. Risk bands are Low (0–29), Moderate (30–54), High (55–74), and Critical (75–100).

This is a transparent demonstration model, not a validated forecasting or clinical tool. See [`docs/risk-model.md`](./docs/risk-model.md) for assumptions and limitations.

## Project structure

```text
.
├── index.html
├── styles.css
├── script.js
├── docs/
│   ├── risk-model.md
│   └── sources-and-judging.md
└── .github/workflows/pages.yml
```

The site is intentionally dependency-light: semantic HTML, CSS, and vanilla JavaScript. The risk calculation and supplier eligibility logic are kept in named functions in `script.js` so they can later move behind API services.

## Accessibility

Medisync is designed for patients, caregivers, pharmacy teams, and supply-chain staff of all ages. Senior-friendly choices are built into the shared experience rather than separated into a seniors-only app: readable type, high contrast, large controls, plain language, visible keyboard focus, and reduced-motion support.

## Safety and data boundaries

- Risk, supplier, shipment, and traceability records are fictional.
- A trace anomaly asks an operator to review the record; it does not prove a medicine is falsified.
- Refill planning does not modify prescriptions, doses, or authorized quantities.
- Supplier matching supports comparison only; it does not contact suppliers or place orders.
- SMS, WhatsApp, authentication, patient-data storage, and live inventory are not connected.

## Sources

See [`docs/sources-and-judging.md`](./docs/sources-and-judging.md) for the source list and notes on how the project relates to common hackathon rubrics. Each school or event sets its own criteria.

## License

No open-source license has been selected. Unless a license is added, the source remains under its default copyright; please ask the author before reusing it.

