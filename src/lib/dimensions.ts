import type { Dimensions } from "@/containers/ai-generation-flow/types";
import type { SpaceDimension, SpaceWithRelations } from "@/types/space";

/**
 * Normalize dimension value from various formats (string/number) to number | null
 */
function toDimensionNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return null;
    const parsed = Number(trimmed);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

/**
 * Extract dimensions from SpaceWithRelations, supporting multiple formats:
 * - dimensions[].widthM/depthM/heightM (from measure-room API)
 * - dimensions[].width/depth/height (legacy)
 * - Direct properties on space object
 */
export function extractSpaceDimensions(
  space: SpaceWithRelations | null,
): Dimensions {
  if (!space || typeof space !== "object") {
    return { width: null, depth: null, height: null };
  }

  // Try dimensions array first (from measure-room API)
  if (Array.isArray(space.dimensions) && space.dimensions.length > 0) {
    const dim = space.dimensions[0] as SpaceDimension;
    return {
      width: toDimensionNumber(dim.widthM),
      depth: toDimensionNumber(dim.depthM),
      height: toDimensionNumber(dim.heightM),
    };
  }

  // Fallback: check for nested dimension objects or direct properties
  const spaceRecord = space as unknown as Record<string, unknown>;
  const candidates = [
    spaceRecord.dimensions,
    spaceRecord.roomDimensions,
    spaceRecord.measurements,
    spaceRecord.roomMeasurement,
    spaceRecord.roomMeasurements,
    spaceRecord,
  ];

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== "object") continue;

    const source = Array.isArray(candidate)
      ? ((candidate[0] ?? {}) as Record<string, unknown>)
      : (candidate as Record<string, unknown>);

    // Try widthM/depthM/heightM first
    const widthM = toDimensionNumber(
      source.widthM ?? source.width ?? source.roomWidth ?? source.widthMeters,
    );
    const depthM = toDimensionNumber(
      source.depthM ??
        source.depth ??
        source.length ??
        source.roomDepth ??
        source.depthMeters ??
        source.lengthMeters,
    );
    const heightM = toDimensionNumber(
      source.heightM ??
        source.height ??
        source.roomHeight ??
        source.heightMeters,
    );

    if (widthM !== null || depthM !== null || heightM !== null) {
      return { width: widthM, depth: depthM, height: heightM };
    }
  }

  return { width: null, depth: null, height: null };
}
