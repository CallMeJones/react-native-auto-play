import { NitroModules } from 'react-native-nitro-modules';
import { NitroColorUtil } from '../utils/NitroColor';
import { NitroActionUtil } from '../utils/NitroAction';
import { Template, } from './Template';
const HybridPlaceListMapTemplate = NitroModules.createHybridObject('PlaceListMapTemplate');
function convertPlace(place) {
    if (place == null) {
        return undefined;
    }
    const marker = place.marker;
    const color = marker?.color == null ? undefined : NitroColorUtil.convert(marker.color);
    return {
        latitude: place.latitude,
        longitude: place.longitude,
        markerLabel: marker?.label,
        markerColorLight: color?.lightColor,
        markerColorDark: color?.darkColor,
    };
}
function convertRow(template, row) {
    return {
        title: row.title,
        detailedText: row.detailedText,
        browsable: row.browsable,
        enabled: row.enabled ?? true,
        image: row.image,
        place: convertPlace(row.place),
        onPress: row.onPress == null ? undefined : () => row.onPress?.(template),
    };
}
/**
 * Android Auto place-list map.
 *
 * The host renders the map and the pins; CRUW only supplies places. There is
 * no map renderer, no surface callback and no location collection here, which
 * is what keeps this surface driver-safe (ADR 0025).
 *
 * @namespace Android
 */
export class PlaceListMapTemplate extends Template {
    template = this;
    constructor(config) {
        super(config);
        const { headerActions, rows, ...rest } = config;
        const nitroConfig = {
            ...rest,
            id: this.id,
            headerActions: NitroActionUtil.convert(this.template, headerActions),
            rows: (rows ?? []).map((row) => convertRow(this.template, row)),
        };
        HybridPlaceListMapTemplate.createPlaceListMapTemplate(nitroConfig);
    }
    updateItems(rows) {
        return HybridPlaceListMapTemplate.updatePlaceListMapTemplateItems(this.id, (rows ?? []).map((row) => convertRow(this.template, row)));
    }
}
