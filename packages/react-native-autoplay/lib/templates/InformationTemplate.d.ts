import type { CustomActionButtonAndroid, TextButton } from '../types/Button';
import type { AutoText } from '../types/Text';
import { type NitroAction } from '../utils/NitroAction';
import { type NitroSection } from '../utils/NitroSection';
import type { TextRow } from './ListTemplate';
import type { BaseMapTemplateConfig } from './MapTemplate';
import { type HeaderActions, type NitroBaseMapTemplateConfig, Template, type TemplateConfig } from './Template';
export interface NitroInformationTemplateConfig extends TemplateConfig {
    headerActions?: Array<NitroAction>;
    title: AutoText;
    section: NitroSection;
    actions?: Array<NitroAction>;
    mapConfig?: NitroBaseMapTemplateConfig;
}
export type InformationItems = [TextRow] | [TextRow, TextRow] | [TextRow, TextRow, TextRow] | [TextRow, TextRow, TextRow, TextRow];
export type InformationTemplateConfig = Omit<NitroInformationTemplateConfig, 'headerActions' | 'section' | 'mapConfig' | 'actions'> & {
    /**
     * action buttons, usually at the the top right on Android and a top bar on iOS
     */
    headerActions?: HeaderActions<InformationTemplate>;
    /**
     * @namespace Android this is a PaneTemplate with a list of rows. Each row can have a title with up to 2 rows and a detailedText with up to 4 rows, either as a single string that is automatically wrapped or a string with line breaks. However if the text is too long it might be broken into multiple rows and then truncated, if more than 4 rows are required due to wrapping.
     * @namespace iOS this is an InformationTemplate, ⚠️ the row image is NOT supported
     */
    items?: InformationItems;
    /**
     * If mapConfig is defined, it will use a MapWithContentTemplate with the current template. This results in a PaneTemplate with a map in background. No actions need to be specified, can be empty object.
     * @namespace Android
     */
    mapConfig?: BaseMapTemplateConfig<InformationTemplate>;
    /**
     * @namespace Android up to 2 buttons of type TextButton, TextAndImageButton or ImageButton
     * @namespace iOS - up to 3 buttons of type TextButton
     */
    actions?: {
        android?: [CustomActionButtonAndroid<InformationTemplate>] | [
            CustomActionButtonAndroid<InformationTemplate>,
            CustomActionButtonAndroid<InformationTemplate>
        ];
        ios?: [
            TextButton<InformationTemplate>,
            TextButton<InformationTemplate>,
            TextButton<InformationTemplate>
        ] | [TextButton<InformationTemplate>, TextButton<InformationTemplate>] | [TextButton<InformationTemplate>];
    };
};
export declare class InformationTemplate extends Template<InformationTemplateConfig, HeaderActions<InformationTemplate>> {
    private template;
    constructor(config: InformationTemplateConfig);
    updateItems(items?: InformationItems): Promise<void>;
    private getSection;
}
