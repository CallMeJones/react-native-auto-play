import type { AutoText } from '../types/Text';
import { type NitroAction } from '../utils/NitroAction';
import { type GridButton, type NitroGridButton } from '../utils/NitroGrid';
import type { BaseMapTemplateConfig } from './MapTemplate';
import { type HeaderActions, type NitroBaseMapTemplateConfig, Template, type TemplateConfig } from './Template';
export interface NitroGridTemplateConfig extends TemplateConfig {
    headerActions?: Array<NitroAction>;
    title: AutoText;
    buttons: Array<NitroGridButton>;
    mapConfig?: NitroBaseMapTemplateConfig;
}
export type GridTemplateConfig = Omit<NitroGridTemplateConfig, 'headerActions' | 'buttons' | 'mapConfig'> & {
    /**
     * action buttons, usually at the the top right on Android and a top bar on iOS
     */
    headerActions?: HeaderActions<GridTemplate>;
    buttons: Array<GridButton<GridTemplate>>;
    /**
     * If mapConfig is defined, it will use a MapWithContentTemplate with the current template. This results in a GridTemplate with a map in background. No actions need to be specified, can be empty object.
     * @namespace Android
     */
    mapConfig?: BaseMapTemplateConfig<GridTemplate>;
};
export declare class GridTemplate extends Template<GridTemplateConfig, HeaderActions<GridTemplate>> {
    private template;
    constructor(config: GridTemplateConfig);
    updateGrid(buttons: Array<GridButton<GridTemplate>>): Promise<void>;
}
