# Campaign backend integration

The UI depends on the `CampaignRepository` interface exported from
`campaignRepository.ts`. The active export currently points to
`localCampaignRepository`, so all create, update, delete, metrics, image metadata,
and donation-ledger synchronization work without a backend.

When API endpoints are ready, implement the same interface in an API adapter and
change only the final `campaignRepository` export. UI components do not need to be
rewritten.

Suggested endpoint mapping:

- `GET /admin/peduli/campaigns` -> `getSnapshot`
- `POST /admin/peduli/campaigns` -> `saveCampaign` without `existingId`
- `PATCH /admin/peduli/campaigns/:id` -> `saveCampaign` with `existingId`
- `DELETE /admin/peduli/campaigns/:id` -> `deleteCampaign`
- `GET /admin/peduli/campaigns/metrics` -> `CampaignMetrics`
- `POST /donations` should accept `campaignId`

Keep uploaded media as URLs in the API response. The current data-URL fields are
only for browser-local persistence and already use image compression before save.
