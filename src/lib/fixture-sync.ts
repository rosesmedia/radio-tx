import { z } from "zod";

const fixtureSchema = z.object({
    id: z.string(),
    startsAt: z.string(),
    endsAt: z.string(),
    sport: z.object({
        name: z.string(),
    }),
    teams: z.object({
        team: z.object({
            name: z.string(),
        }),
    }).array(),
});

export async function doFixtureSync() {
    const resp = await fetch('https://sports-admin.yorksu.org/api/clst1o9lv0001q5teb61pqfyy/seasons/cm7uo6y6a0005nn0153286r5l/fixtures', {
        headers: {
            // TODO: update this when on roses.media domain
            'User-Agent': 'roses-radio-tx/1.0 (+https://ury.org.uk)',
        },
    });
    if (!resp.ok) {
        throw new Error(`Got response code ${resp.status} (${resp.statusText})`);
    }
    const data = await resp.json();
    const fixtures = fixtureSchema.array().parse(data);
    // TODO: we need an endpoint on roses-media-dashboard to query what fixtures we have coverage for
}
