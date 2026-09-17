import { NitroModules } from 'react-native-nitro-modules';
import type { PlaceListMapTemplate as NitroPlaceListMapTemplate } from '../specs/PlaceListMapTemplate.nitro';
import type { AutoText } from '../types/Text';
import type { ThemedColor } from '../utils/NitroColor';
import { NitroColorUtil } from '../utils/NitroColor';
import { type NitroAction, NitroActionUtil } from '../utils/NitroAction';
import type { AutoImage } from '../types/Image';
import { NitroImageUtil, type NitroImage } from '../utils/NitroImage';
import {
  type HeaderActions,
  type NitroTemplateConfig,
  Template,
  type TemplateConfig,
} from './Template';

const HybridPlaceListMapTemplate =
  NitroModules.createHybridObject<NitroPlaceListMapTemplate>('PlaceListMapTemplate');

/**
 * A pin on the host-drawn map.
 *
 * `label` is at most three characters (the host enforces this) and is what the
 * host draws inside the pin. `color` applies to the pin and to the list row.
 *
 * `icon` replaces the host's pin face with an app-supplied bitmap, which is how
 * a POI app gets its own marker art onto a host-rendered map. The host scales it
 * down to fit a 72 x 72 dp box preserving aspect ratio, so supply art at roughly
 * that size (144 px at 2x) with transparent padding. AndroidX forbids combining
 * `icon` with `color` — `setColor` throws when the marker icon type is
 * `TYPE_IMAGE` — so when `icon` is set, `color` is ignored and `label` is not
 * drawn either, because an icon always takes precedence over a label.
 */
export type AutoPlaceMarker = {
  label?: string;
  color?: ThemedColor | string;
  icon?: AutoImage;
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
  markerImage?: NitroImage;
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

export type PlaceListMapTemplateConfig = Omit<
  NitroPlaceListMapTemplateConfig,
  'headerActions' | 'rows'
> & {
  headerActions?: HeaderActions<PlaceListMapTemplate>;
  rows?: Array<NitroPlaceRow<PlaceListMapTemplate>>;
};

function convertPlace(place?: AutoPlace): NitroAutoPlace | undefined {
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
    markerImage: marker?.icon == null ? undefined : NitroImageUtil.convert(marker.icon),
  };
}

function convertRow<T>(
  template: T,
  row: NitroPlaceRow<T>
): NitroPlaceRowConfig {
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
export class PlaceListMapTemplate extends Template<
  PlaceListMapTemplateConfig,
  HeaderActions<PlaceListMapTemplate>
> {
  private template = this;

  constructor(config: PlaceListMapTemplateConfig) {
    super(config);

    const { headerActions, rows, ...rest } = config;

    const nitroConfig: NitroPlaceListMapTemplateConfig & NitroTemplateConfig = {
      ...rest,
      id: this.id,
      headerActions: NitroActionUtil.convert(this.template, headerActions),
      rows: (rows ?? []).map((row) => convertRow(this.template, row)),
    };

    HybridPlaceListMapTemplate.createPlaceListMapTemplate(nitroConfig);
  }

  public updateItems(rows?: Array<NitroPlaceRow<PlaceListMapTemplate>>) {
    return HybridPlaceListMapTemplate.updatePlaceListMapTemplateItems(
      this.id,
      (rows ?? []).map((row) => convertRow(this.template, row))
    );
  }
}
