# Exhale AppDeploy page sources

This directory contains the **deployed AppDeploy text source snapshots**, not redesigned approximations.

- [Nonprofit Operations](./nonprofit-operations/) — https://exhale-nonprofit-operations-g6be4h.v2.appdeploy.ai/
- [B2B Revenue Recovery](./b2b-revenue-recovery/) — https://exhale-b2b-revenue-recovery-6qsxyc.v2.appdeploy.ai/
- [EverPro Lifecycle role page](./everpro-lifecycle/) — https://armand-sagredo-everpro-lifecycle-marketing-4ibqjf.v2.appdeploy.ai/

## Reproduction instructions

1. Use these folders as the source of truth for the typography, layouts, copy, calculators and form behavior. Match the live page visually before making improvements. Do not start from a new theme.
2. The first two pages are Vite + TypeScript + AppDeploy SDK applications; `backend/index.ts` persists form submissions via AppDeploy database APIs. A deployment outside AppDeploy must replace this backend and configure secure lead storage and notifications. **Do not promise that a static GitHub Pages copy will collect enquiries.**
3. Binary images and runtime resource bindings are not included in the text export. Alessandra's image is already hosted within the older AppDeploy instance; Armand's requested EverPro portrait is not yet bound to the live role page. Obtain authorized images before relying on local assets.
4. Keep the NGO capacity diagnostic and B2B lead diagnostic ungated. Calculations describe user-provided numbers, not measured revenue or guaranteed savings.
5. Preserve three distinct identities: warm nonprofit operations led by Alessandra; commercial B2B revenue recovery led by Armand; and independent candidate-specific EverPro page. Make them responsive and test desktop/mobile layouts, calculators and form validation.

Source snapshots copied on 2026-11-23.
