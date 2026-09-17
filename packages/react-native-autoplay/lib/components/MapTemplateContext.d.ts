import type React from 'react';
import type { MapTemplate } from '..';
export declare const MapTemplateContext: React.Context<MapTemplate | null>;
export declare function MapTemplateProvider({ children, mapTemplate, }: {
    children: React.ReactNode;
    mapTemplate: MapTemplate;
}): React.JSX.Element;
