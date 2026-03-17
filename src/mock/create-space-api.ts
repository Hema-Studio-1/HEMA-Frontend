import { ImageType } from "@/types/image";
import type { SpaceWithRelations } from "@/types/space";

export const createSpaceApiResp: SpaceWithRelations = {
    id: "773ff449-581a-4a3f-b70e-261b578b107f",
    projectId: "",
    name: "asdasd",
    description: "",
    type: "living_room",
    status: "DRAFT",
    createdBy: "dbaf3c77-18c9-4dee-9696-2f68bbda7486",
    createdAt: "2026-03-17T01:15:08.935Z",
    updatedAt: "2026-03-17T01:15:08.935Z",
    project: null,
    views: [],
    dimensions: [
        {
            id: "8ebbf051-9260-427c-b494-b2f7d454520b",
            spaceId: "773ff449-581a-4a3f-b70e-261b578b107f",
            widthM: "5.0",
            depthM: "4.5",
            heightM: "2.6",
            createdAt: "2026-03-17T01:15:08.942Z"
        }
    ],
    preferences: [
        {
            id: "c19d5b12-ace1-4ad1-a047-9194ea2029d6",
            spaceId: "773ff449-581a-4a3f-b70e-261b578b107f",
            budget: "3000",
            repaintWalls: false,
            repaintCeiling: false,
            createdAt: "2026-03-17T01:15:08.952Z"
        }
    ],
    aiContexts: [],
    owner: {
        id: "dbaf3c77-18c9-4dee-9696-2f68bbda7486",
        email: "dacara3174@daerdy.com",
        password: "",
        status: "ACTIVE",
        last_login: null,
        hach_refresh_token: null,
        is_active: true,
        profile_id: 9,
        stripe_customer_id: null,
        created_on: "2026-03-05T12:26:35.521Z",
        updated_on: "2026-03-05T12:26:35.521Z"
    },
    images: [
        {
            id: "a98a9f6d-7fd7-42b8-9e89-d2585db2bb8e",
            projectId: "",
            spaceId: "773ff449-581a-4a3f-b70e-261b578b107f",
            type: ImageType.ORIGINAL,
            storagePath: "hema/1773710088739_fm2bf7ip.jpg",
            width: 1920,
            height: 1280,
            createdAt: "2026-03-17T01:14:51.726Z"
        }
    ],
    memberships: []
}