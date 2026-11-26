/* eslint-disable react/prop-types */
import { useEffect, useMemo, useRef, useState } from "react";
import { geoCentroid, geoDistance, geoGraticule, geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";
import world from "world-atlas/countries-50m.json";
import GlobePlaceReadout from "./GlobePlaceReadout";
import { createRouteProjection, rotateRouteView, routeRadiusRatio, zoomRouteView } from "./routeGlobeView";

const land = feature(world, world.objects.land);
const borders = mesh(world, world.objects.countries, (a, b) => a !== b);
const countries = feature(world, world.objects.countries).features;
const worldGrid = geoGraticule()();
const localGrid = geoGraticule().step([2, 2])();
const degreesPerRadian = 180 / Math.PI;
const palette = {
    light: {
        water: "#fafbfc", land: "#ebedef", visited: "#cfdae5", border: "#ffffff",
        grid: "#a6b7c42b", outline: "#ccd5dd", route: "#5b82a5",
    },
    dark: {
        water: "#202730", land: "#353e4a", visited: "#495e74", border: "#738497",
        grid: "#98adc630", outline: "#59697a", route: "#a0c0db",
    },
};

function centerOnCities(cities) {
    if (!cities.length) return [10, 35];
    const coordinates = cities.map((city) => city.coordinates);
    const centroid = geoCentroid({ type: "MultiPoint", coordinates });
    return centroid.every(Number.isFinite) ? centroid : coordinates[0];
}

function localPoint(element, event) {
    const bounds = element.getBoundingClientRect();
    return [event.clientX - bounds.left, event.clientY - bounds.top];
}

const distanceBetween = ([x, y], [otherX, otherY]) => Math.hypot(x - otherX, y - otherY);
const midpoint = ([x, y], [otherX, otherY]) => [(x + otherX) / 2, (y + otherY) / 2];

function drawRoute(context, [x, y], [endX, endY]) {
    const dx = endX - x;
    const dy = endY - y;
    const length = Math.hypot(dx, dy);
    if (length < 0.75) return;

    const bend = Math.min(Math.max(length * 0.18, 2.4), 25) * (dx < 0 ? 1 : -1);
    const controlX = (x + endX) / 2 - dy / length * bend;
    const controlY = (y + endY) / 2 + dx / length * bend;
    context.beginPath();
    context.moveTo(x, y);
    context.quadraticCurveTo(controlX, controlY, endX, endY);
    context.stroke();

    context.save();
    // The tangent of a quadratic curve at its midpoint is parallel to the endpoints.
    context.translate((x + 2 * controlX + endX) / 4, (y + 2 * controlY + endY) / 4);
    context.rotate(Math.atan2(dy, dx));
    const arrowScale = Math.min(1, Math.max(0.42, length / 15));
    context.scale(arrowScale, arrowScale);
    context.beginPath();
    context.moveTo(3.5, 0);
    context.lineTo(-3, -2.5);
    context.lineTo(-3, 2.5);
    context.closePath();
    context.fill();
    context.restore();
}

function drawGlobe(canvas, size, radius, projection, view, data, theme) {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const pixels = Math.round(size * ratio);
    if (canvas.width !== pixels || canvas.height !== pixels) {
        canvas.width = pixels;
        canvas.height = pixels;
    }
    const context = canvas.getContext("2d");
    if (!context) return;

    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, size, size);
    const path = geoPath(projection, context);
    const colors = palette[theme];
    const center = size / 2;
    context.save();
    context.beginPath();
    context.arc(center, center, radius, 0, Math.PI * 2);
    context.clip();
    context.fillStyle = colors.water;
    context.fillRect(0, 0, size, size);

    for (const [geometry, fill] of [[land, colors.land], [data.highlights, colors.visited]]) {
        context.beginPath();
        path(geometry);
        context.fillStyle = fill;
        context.fill();
    }

    for (const [geometry, stroke, width] of [
        [borders, colors.border, 0.8],
        [view.zoom > 4 ? localGrid : worldGrid, colors.grid, 0.75],
    ]) {
        context.beginPath();
        path(geometry);
        context.strokeStyle = stroke;
        context.lineWidth = width;
        context.stroke();
    }

    context.fillStyle = colors.route;
    context.strokeStyle = colors.route;
    context.lineWidth = 1.25;
    for (const [origin, destination] of data.routes) {
        if (geoDistance(view.center, origin) < Math.PI / 2 && geoDistance(view.center, destination) < Math.PI / 2) {
            drawRoute(context, projection(origin), projection(destination));
        }
    }
    context.restore();

    context.beginPath();
    context.arc(center, center, radius, 0, Math.PI * 2);
    context.strokeStyle = colors.outline;
    context.lineWidth = 1;
    context.stroke();
}

function RouteGlobe({ darkMode, locations, routeStartByCountry, onLocationClick, onClearLocation, selectedLocation }) {
    const data = useMemo(() => {
        const cities = locations.map(({ lat, lng, ...location }) => ({ ...location, coordinates: [lng, lat] }));
        const byName = new Map(cities.map((city) => [city.location, city]));
        const visitedCountries = new Set(cities.map((city) => city.country));
        const routes = cities.flatMap((destination) => {
            const origin = byName.get(routeStartByCountry[destination.country]);
            if (!origin || origin === destination || origin.country !== destination.country) return [];
            return [[origin.coordinates, destination.coordinates]];
        });
        return {
            cities,
            routes,
            highlights: {
                type: "FeatureCollection",
                features: countries.filter((country) => visitedCountries.has(country.properties.name)),
            },
            world: { center: centerOnCities(cities), zoom: 1 },
        };
    }, [locations, routeStartByCountry]);

    const [view, setView] = useState(data.world);
    const [size, setSize] = useState(0);
    const [hoveredLocation, setHoveredLocation] = useState(null);
    const [focusedLocation, setFocusedLocation] = useState(null);
    const stage = useRef(null);
    const canvas = useRef(null);
    const pointers = useRef(new Map());
    const gesture = useRef(null);
    const radius = size * routeRadiusRatio;
    const theme = darkMode ? "dark" : "light";

    useEffect(() => {
        const observer = new ResizeObserver(([entry]) => {
            setSize(Math.round(entry.contentRect.width));
        });
        observer.observe(stage.current);
        return () => observer.disconnect();
    }, []);

    const projection = useMemo(() => createRouteProjection(view, size), [size, view]);
    const center = useMemo(() => [size / 2, size / 2], [size]);
    const visibleCities = useMemo(() => size ? data.cities.flatMap((city) => {
        if (geoDistance(view.center, city.coordinates) >= Math.PI / 2) return [];
        const position = projection(city.coordinates);
        return distanceBetween(position, center) < radius - 2 ? [{ ...city, position }] : [];
    }) : [], [center, data, projection, radius, size, view.center]);
    const previewedLocation = hoveredLocation ??
        (visibleCities.some((city) => city.location === focusedLocation) ? focusedLocation : null);

    useEffect(() => {
        if (size) drawGlobe(canvas.current, size, radius, projection, view, data, theme);
    }, [data, projection, radius, size, theme, view]);

    useEffect(() => {
        const element = stage.current;
        const zoomWithWheel = (event) => {
            if (!event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
            const anchor = localPoint(element, event);
            if (distanceBetween(anchor, center) >= radius) return;
            if (view.zoom === 1 && event.deltaY > 0 && !event.ctrlKey) return;

            event.preventDefault();
            const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? size : 1;
            const delta = Math.max(-400, Math.min(400, event.deltaY * unit));
            const factor = Math.exp(-delta * 0.002);
            setHoveredLocation(null);
            setView((current) => zoomRouteView(current, size, current.zoom * factor, anchor));
        };
        element.addEventListener("wheel", zoomWithWheel, { passive: false });
        return () => element.removeEventListener("wheel", zoomWithWheel);
    }, [center, radius, size, view.zoom]);

    // At world scale nearby markers can overlap. Pick the closest location to the pointer.
    const cityAt = (point) => {
        if (distanceBetween(point, center) >= radius) return null;
        let closest = null;
        let nearestDistance = 15;
        for (const city of visibleCities) {
            const distance = distanceBetween(point, city.position);
            if (distance < nearestDistance) {
                closest = city.location;
                nearestDistance = distance;
            }
        }
        return closest;
    };

    const startGesture = (currentView, moved) => {
        const [first, second] = pointers.current.values();
        if (!first) {
            gesture.current = null;
            return;
        }
        gesture.current = {
            view: currentView,
            latest: currentView,
            first,
            moved,
            pinch: second ? {
                distance: Math.max(1, distanceBetween(first, second)),
                anchor: midpoint(first, second),
            } : null,
        };
    };

    const handlePointerDown = (event) => {
        if (event.button !== 0 || pointers.current.size >= 2) return;
        const point = localPoint(event.currentTarget, event);
        if (distanceBetween(point, center) >= radius) return;
        pointers.current.set(event.pointerId, point);
        startGesture(gesture.current?.latest ?? view, pointers.current.size > 1);
        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (event) => {
        const point = localPoint(event.currentTarget, event);
        if (!pointers.current.has(event.pointerId)) {
            if (!gesture.current && event.pointerType !== "touch") setHoveredLocation(cityAt(point));
            return;
        }

        pointers.current.set(event.pointerId, point);
        const active = gesture.current;
        if (!active.moved && distanceBetween(point, active.first) < 4) return;
        active.moved = true;
        setHoveredLocation(null);

        if (active.pinch) {
            const [first, second] = pointers.current.values();
            const scale = distanceBetween(first, second) / active.pinch.distance;
            active.latest = zoomRouteView(active.view, size, active.view.zoom * scale, active.pinch.anchor);
        } else {
            const degreesPerPixel = degreesPerRadian / (radius * active.view.zoom);
            const longitudeScale = Math.max(0.2, Math.cos(active.view.center[1] / degreesPerRadian));
            active.latest = rotateRouteView(active.view,
                (active.first[0] - point[0]) * degreesPerPixel / longitudeScale,
                (point[1] - active.first[1]) * degreesPerPixel);
        }
        setView(active.latest);
    };

    const finishPointer = (event, select) => {
        if (!pointers.current.delete(event.pointerId)) return;
        const active = gesture.current;
        startGesture(active.latest, true);
        if (pointers.current.size) return;

        const location = select ? cityAt(localPoint(event.currentTarget, event)) : null;
        setHoveredLocation(event.pointerType === "touch" ? null : location);
        if (location && !active.moved) onLocationClick(location);
    };

    const handleKeyDown = (event) => {
        if (event.target !== event.currentTarget || event.ctrlKey || event.metaKey) return;
        const direction = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[event.key];
        if (direction) {
            event.preventDefault();
            setView((current) => rotateRouteView(current, direction[0] * 12 / current.zoom, direction[1] * 12 / current.zoom));
        } else if (event.key === "+" || event.key === "=" || event.key === "-") {
            event.preventDefault();
            setView((current) => zoomRouteView(current, size, current.zoom * (event.key === "-" ? 0.8 : 1.25)));
        }
    };

    return (
        <section className="footprints-route-map" data-theme={theme} aria-label="Routes globe">
            <div
                ref={stage}
                className="footprints-route-stage"
                data-overview={view.zoom < 4}
                data-hovering-city={Boolean(hoveredLocation)}
                role="group"
                aria-label="Drag or use arrow keys to rotate. Scroll, pinch, or use Plus and Minus to zoom."
                tabIndex={0}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={(event) => finishPointer(event, true)}
                onPointerCancel={(event) => finishPointer(event, false)}
                onLostPointerCapture={(event) => finishPointer(event, false)}
                onPointerLeave={() => setHoveredLocation(null)}
                onKeyDown={handleKeyDown}
            >
                <canvas ref={canvas} aria-hidden="true" />
                {visibleCities.map(({ location, hasPhotos, position: [left, top] }) => (
                    <button
                        key={location}
                        type="button"
                        className="footprints-route-dot"
                        style={{ left, top }}
                        data-previewed={previewedLocation === location}
                        aria-label={`${hasPhotos ? "Show photos from" : "Select"} ${location}`}
                        aria-pressed={selectedLocation === location}
                        onClick={() => onLocationClick(location)}
                        onFocus={() => setFocusedLocation(location)}
                        onBlur={() => setFocusedLocation(null)}
                    />
                ))}
            </div>
            <GlobePlaceReadout
                darkMode={darkMode}
                location={previewedLocation ?? selectedLocation}
                onClear={selectedLocation ? onClearLocation : undefined}
            />
        </section>
    );
}

export default RouteGlobe;
