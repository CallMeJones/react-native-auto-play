import { NitroImageUtil } from './NitroImage';
const validateRadioItems = (type, items) => {
    if (__DEV__ &&
        type === 'radio' &&
        (items.filter((item) => item.selected).length > 1 || items.every((item) => !item.selected))) {
        throw new Error('radio lists must have one selected item');
    }
};
const convert = (template, sections) => {
    if (sections == null) {
        return undefined;
    }
    if (Array.isArray(sections)) {
        return sections.map((section) => {
            const { title, type } = section;
            const items = section.items.map((item) => convertRow(template, item));
            validateRadioItems(type, items);
            return {
                items,
                type,
                title,
            };
        });
    }
    const items = sections.items.map((item) => convertRow(template, item));
    validateRadioItems(sections.type, items);
    return [
        {
            items,
            type: sections.type,
        },
    ];
};
const convertRow = (template, item) => {
    const { title, type, enabled = true, image } = item;
    const detailedText = 'detailedText' in item ? item.detailedText : undefined;
    const selected = type === 'radio' ? (item.selected ?? false) : undefined;
    const onTogglePress = item.type === 'toggle' ? item.onPress : undefined;
    const onRowPress = item.type !== 'text' && item.type !== 'toggle' ? item.onPress : undefined;
    const onPress = item.type === 'text'
        ? undefined
        : (checked) => {
            if (onTogglePress != null && checked != null) {
                onTogglePress(template, checked);
                return;
            }
            if (onRowPress != null) {
                onRowPress(template);
            }
        };
    return {
        browsable: type === 'default' ? item.browsable : undefined,
        detailedText,
        enabled,
        image: NitroImageUtil.convert(image),
        title,
        checked: type === 'toggle' ? item.checked : undefined,
        onPress,
        selected,
    };
};
export const NitroSectionUtil = { convert };
