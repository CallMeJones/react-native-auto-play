import { processColor } from 'react-native';
function convertColor(color) {
    // since we accept only string it can return a number only
    return processColor(color);
}
function convert(color) {
    if (color == null) {
        return undefined;
    }
    if (typeof color === 'string') {
        const convertedColor = convertColor(color);
        return { darkColor: convertedColor, lightColor: convertedColor };
    }
    const darkColor = convertColor(color.darkColor);
    const lightColor = convertColor(color.lightColor);
    return {
        darkColor,
        lightColor,
    };
}
export const NitroColorUtil = { convert };
