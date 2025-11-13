import { join, map } from 'lodash';
import * as z from 'zod';
import { Category } from '../../category/models/category.entity';
import { City } from '../../city/models/city.entity';

export const GEMINI_DATA = {
  selectPois: {
    prompt: (
      city: City,
      categories: Category[],
      pois: { id: string; lon: number; lat: number; name: string }[],
    ) => `
      You are the best tour guide in the world. Choose the best 10 POIs from the list and sort them to create the most efficient and practical walking route.

      **Inputs:**
      1.  **city**: ${city.name}.
      2.  **country**: ${city.countryName}.
      3.  **poi_list**: A list of Point of Interest (POI) objects. ${JSON.stringify(pois)}.
      4.  **categories**: ${join(map(categories, 'name'), ', ')}.

      **Functionality Logic:**
      1.  **Selection:** Select exactly **10 best POIs** from the provided 'poi_list'. Prioritize POIs that match the user-specified 'categories'.
      2.  **Optimization:** Sort the selected 10 POIs to create the most efficient and practical walking route (e.g., minimizing backtracking and crossing), resulting in an ordered sequence of 10 pois.

      **Route Constraints:**
      * **Total Walking Distance:** Must be strictly **less than 3000 meters**.
      * **Total Duration:** Must be strictly **less than 1.5 hours** (90 minutes) of *estimated walking time*.

      **Output Requirement:**
      Return a JSON object that strictly adheres to the provided schema. The 'pois' array must contain the 10 selected POIs in the calculated route order, with the original POI 'id' and name translated into English as 'nameEn'.
    `,
    responseSchema: z.object({
      pois: z
        .array(
          z.object({
            id: z
              .string()
              .describe('The original ID of the Point of Interest.'),
            nameEn: z
              .string()
              .describe("The English translation of the POI's name."),
          }),
        )
        .describe(
          'An array of the 10 selected POIs in the optimal route order.',
        ),
    }),
  },
};
