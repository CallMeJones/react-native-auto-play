import type { Section } from '../templates/ListTemplate';
import type { AutoText } from '../types/Text';
import { type NitroImage } from './NitroImage';
type NitroSectionType = 'default' | 'radio';
export type NitroRow = {
    title: AutoText;
    detailedText?: AutoText;
    browsable?: boolean;
    enabled: boolean;
    image?: NitroImage;
    checked?: boolean;
    onPress?: (checked?: boolean) => void;
    selected?: boolean;
};
export type NitroSection = {
    title?: string;
    items: Array<NitroRow>;
    type: NitroSectionType;
};
export declare const NitroSectionUtil: {
    convert: <T>(template: T, sections?: Section<T>) => Array<NitroSection> | undefined;
};
export {};
