import type { AutoImage, BaseMapTemplateConfig, CustomActionButtonAndroid, HeaderActionsAndroid, TextButton } from '..';
import type { AutoText } from '../types/Text';
import { type NitroAction } from '../utils/NitroAction';
import { type NitroImage } from '../utils/NitroImage';
import type { NitroBaseMapTemplateConfig, TemplateConfig } from './Template';
export interface NitroMessageTemplateConfig extends TemplateConfig {
    headerActions?: Array<NitroAction>;
    /**
     * @namespace Android title shown on header
     */
    title?: AutoText;
    message: AutoText;
    actions?: Array<NitroAction>;
    image?: NitroImage;
    mapConfig?: NitroBaseMapTemplateConfig;
}
export type MessageTemplateConfig = Omit<NitroMessageTemplateConfig, 'headerActions' | 'image' | 'mapConfig' | 'actions'> & {
    /**
     * action buttons, usually at the top right on Android
     * @namespace Android
     */
    headerActions?: HeaderActionsAndroid<MessageTemplate>;
    /**
     * image shown at the top of the message on Android
     * @namespace Android
     */
    image?: AutoImage;
    /**
     * If mapConfig is defined, it will use a MapWithContentTemplate with the current template. This results in a MessageTemplate with a map in background. No actions need to be specified, can be empty object.
     * @namespace Android
     */
    mapConfig?: BaseMapTemplateConfig<MessageTemplate>;
    /**
     * @namespace Android up to 2 buttons of type TextButton, TextAndImageButton or ImageButton
     * @namespace iOS - up to 3 buttons of type TextButton
     */
    actions?: {
        android?: [CustomActionButtonAndroid<MessageTemplate>] | [CustomActionButtonAndroid<MessageTemplate>, CustomActionButtonAndroid<MessageTemplate>];
        ios?: [TextButton<MessageTemplate>, TextButton<MessageTemplate>, TextButton<MessageTemplate>] | [TextButton<MessageTemplate>, TextButton<MessageTemplate>] | [TextButton<MessageTemplate>];
    };
};
/**
 * This template is always pushed on top and will stay on top until it is popped.
 * Other templates being pushed will end up below this one on the stack.
 * Pushing another MessageTemplate will pop the currently shown one.
 */
export declare class MessageTemplate {
    private template;
    id: string;
    constructor(config: MessageTemplateConfig);
    /**
     * push this template on the stack and show it to the user
     */
    push(): Promise<void>;
}
