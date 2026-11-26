import { geoOrthographic } from "d3-geo";

export const routeRadiusRatio = 0.47;
const degreesPerRadian = 180 / Math.PI;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const wrapLongitude = (longitude) => ((longitude + 180) % 360 + 360) % 360 - 180;

export function createRouteProjection(view, size) {
    return geoOrthographic()
        .translate([size / 2, size / 2])
        .rotate([-view.center[0], -view.center[1]])
        .scale(size * routeRadiusRatio * view.zoom)
        .clipAngle(Math.asin(1 / view.zoom) * degreesPerRadian);
}

export function rotateRouteView(view, deltaLongitude, deltaLatitude) {
    return {
        ...view,
        center: [
            wrapLongitude(view.center[0] + deltaLongitude),
            clamp(view.center[1] + deltaLatitude, -86, 86),
        ],
    };
}

export function zoomRouteView(view, size, requestedZoom, anchor) {
    const zoom = clamp(requestedZoom, 1, 30);
    if (!Number.isFinite(zoom) || zoom === view.zoom) return view;

    const radius = size * routeRadiusRatio;
    const [x, y] = anchor ?? [size / 2, size / 2];
    const dx = x - size / 2;
    const dy = size / 2 - y;
    const distance = Math.hypot(dx, dy);
    if (!(distance > 0 && distance <= radius)) return { ...view, zoom };

    const [longitude, latitude] = createRouteProjection(view, size).invert(anchor);
    const latitudeRadians = latitude / degreesPerRadian;
    const projectedX = dx / (radius * zoom);
    const projectedY = dy / (radius * zoom);
    // Solve the north-up rotation that projects the same point at the new scale.
    // Keep the longitude on the same side of the camera to avoid jumps near the poles.
    const relativeLongitude = (longitude - view.center[0]) / degreesPerRadian;
    let offset = Math.asin(clamp(projectedX / Math.cos(latitudeRadians), -1, 1));
    if (Math.cos(relativeLongitude) < 0) offset = Math.PI - offset;

    const depth = Math.sqrt(Math.max(0, 1 - projectedX ** 2 - projectedY ** 2));
    const tilt = Math.atan2(Math.sin(latitudeRadians), Math.cos(latitudeRadians) * Math.cos(offset))
        - Math.atan2(projectedY, depth);
    return {
        ...view,
        zoom,
        center: [
            wrapLongitude(longitude - offset * degreesPerRadian),
            clamp(wrapLongitude(tilt * degreesPerRadian), -86, 86),
        ],
    };
}
