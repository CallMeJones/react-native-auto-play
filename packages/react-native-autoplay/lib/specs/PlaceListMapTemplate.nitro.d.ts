import type { HybridObject } from 'react-native-nitro-modules';
import type { NitroPlaceListMapTemplateConfig } from '../templates/PlaceListMapTemplate';
import type { NitroTemplateConfig } from './AutoPlay.nitro';
interface PlaceListMapTemplateConfig extends NitroTemplateConfig, NitroPlaceListMapTemplateConfig {
}
/**
 * Host-rendered place-list map, Android Auto only.
 *
 * The host draws the map and the pins; the app only supplies a `Place`
 * (location + marker) per row. That is why this template needs no surface
 * callback and no map renderer in the bundle, unlike MapTemplate.
 *
 * @namespace Android
 */
export interface PlaceListMapTemplate extends HybridObject<{
    android: 'kotlin';
}> {
    createPlaceListMapTemplate(config: PlaceListMapTemplateConfig): void;
    updatePlaceListMapTemplateItems(templateId: string, rows: NitroPlaceListMapTemplateConfig['rows']): Promise<void>;
}
export {};
