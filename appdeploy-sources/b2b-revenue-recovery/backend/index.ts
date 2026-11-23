import { router, json, error, db } from '@appdeploy/sdk';
type Enquiry = {
  name?: unknown;
  email?: unknown;
  organization?: unknown;
  challenge?: unknown;
  engagement?: unknown;
  website?: unknown;
};
const clean = (value: unknown, max: number) =>
  typeof value === 'string' ? value.trim().slice(0, max + 1) : '';
export const handler = router({
  'GET /api/_healthcheck': [async () => json({ ok: true })],
  'POST /api/enquiries': [
    async ({ body }) => {
      const input = (body ?? {}) as Enquiry;
      if (input.website) return json({ ok: true });
      const name = clean(input.name, 100),
        email = clean(input.email, 200),
        organization = clean(input.organization, 150),
        challenge = clean(input.challenge, 2500),
        engagement = clean(input.engagement, 40);
      if (
        !name ||
        name.length > 100 ||
        !organization ||
        organization.length > 150 ||
        !challenge ||
        challenge.length > 2500 ||
        email.length > 200 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        !['not-sure', 'consulting', 'contract'].includes(engagement)
      )
        return error('Please complete the required fields.', 400);
      try {
        const [id] = await db.add('exhale_enquiries', [
          {
            name,
            email,
            organization,
            challenge,
            engagement,
            submittedAt: new Date().toISOString(),
            source: 'b2b-revenue-recovery',
          },
        ]);
        if (!id) return error('Could not save the enquiry.', 503);
        return json({ ok: true });
      } catch {
        return error('Unable to save the enquiry.', 503);
      }
    },
  ],
});
