# Medisync demo risk model

## Purpose

This page describes the deterministic, illustrative score used by the browser demo. It is intended to make the prototype explainable during review. It is not clinically validated and must not be used to make real procurement, dispensing, or treatment decisions.

## Inputs and weights

| Factor | Weight | Demo signal |
| --- | ---: | --- |
| Stockout proximity | 30% | Current usable quantity divided by average daily use, grouped by days remaining |
| Shipment delay | 20% | Delay duration compared with the remaining stock buffer |
| Supplier reliability | 15% | Demonstration reliability band derived from the mock supplier percentage |
| Expiry exposure | 15% | Days to expiry grouped into illustrative bands |
| Unusual inventory movement | 20% | Defined mock anomaly event, such as an unexpected transfer |

Each factor is scored from 0 to 100. The total is the sum of `factor score × weight`, rounded to the nearest integer.

## Classification

| Score | Label |
| ---: | --- |
| 0–29 | Low |
| 30–54 | Moderate |
| 55–74 | High |
| 75–100 | Critical |

## Assumptions and limits

- Stockout estimates use mock quantity and average daily use; they do not account for unrecorded demand or clinical substitution.
- Incoming stock is only a mitigating signal in the UI when its expected arrival is before the estimated stockout.
- Expiry bands are simplified and do not replace first-expiry-first-out procedures or professional review.
- Supplier reliability values and movement anomalies are invented demonstration records.
- A score is a prioritization aid for the prototype, not a probability of shortage, falsification, or patient harm.
- Production use would require validated data, locally approved policies, calibration, monitoring, and authorized human review.

