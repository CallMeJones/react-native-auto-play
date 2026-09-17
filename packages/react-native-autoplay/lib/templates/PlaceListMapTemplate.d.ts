import type { AutoText } from '../types/Text';
import type { ThemedColor } from '../utils/NitroColor';
import { type NitroAction } from '../utils/NitroAction';
import type { NitroImage } from '../utils/NitroImage';
import { type HeaderActions, Template, type TemplateConfig } from './Template';
/**
 * A pin on the host-drawn map.
 *
 * `label` is at most three characters (the host enforces this) and is what the
 * host draws inside the pin. `color` applies to the pin and to the list row.
 */
export type AutoPlaceMarker = {
    label?: string;
    color?: ThemedColor | string;
};
/**
 * A point of interest to show on both the map and the list.
 *
 * Coordinates are required: the host draws the map itself, so it needs the
 * position. Do not put exact member positions here without a live consent
 * frame behind them (ADR 0017).
 */
export type AutoPlace = {
    latitude: number;
    longitude: number;
    marker?: AutoPlaceMarker;
};
export type NitroPlaceRow<T> = {
    title: AutoText;
    /**
     * Up to two lines. The host rejects non-browsable rows that carry no
     * distance span, so keep rows browsable unless a distance is supplied.
     */
    detailedText?: AutoText;
    /**
     * Adds a chevron and makes the row selectable. Required for rows without a
     * distance span.
     */
    browsable?: boolean;
    enabled?: boolean;
    image?: NitroImage;
    /**
     * When set, the host draws a marker for this row on the map.
     */
    place?: AutoPlace;
    onPress?: (template: T) => void;
};
export interface NitroAutoPlace {
    latitude: number;
    longitude: number;
    markerLabel?: string;
    markerColorLight?: number;
    markerColorDark?: number;
}
export interface NitroPlaceRowConfig {
    title: AutoText;
    detailedText?: AutoText;
    browsable?: boolean;
    enabled: boolean;
    image?: NitroImage;
    place?: NitroAutoPlace;
    onPress?: () => void;
}
export interface NitroPlaceListMapTemplateConfig extends TemplateConfig {
    headerActions?: Array<NitroAction>;
    title: AutoText;
    rows: Array<NitroPlaceRowConfig>;
}
export type PlaceListMapTemplateConfig = Omit<NitroPlaceListMapTemplateConfig, 'headerActions' | 'rows'> & {
    headerActions?: HeaderActions<PlaceListMapTemplate>;
    rows?: Array<NitroPlaceRow<PlaceListMapTemplate>>;
};
/**
 * Android Auto place-list map.
 *
 * The host renders the map and the pins; CRUW only supplies places. There is
 * no map renderer, no surface callback and no location collection here, which
 * is what keeps this surface driver-safe (ADR 0025).
 *
 * @namespace Android
 */
export declare class PlaceListMapTemplate extends Template<PlaceListMapTemplateConfig, HeaderActions<PlaceListMapTemplate>> {
    private template;
    constructor(config: PlaceListMapTemplateConfig);
    updateItems(rows?: Array<NitroPlaceRow<PlaceListMapTemplate>>): Promise<void>;
}
