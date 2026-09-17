import { AppRegistry, Platform } from 'react-native';
const createTaskProvider = (hybridAutoPlay) => () => () => new Promise((resolve) => {
    const remove = hybridAutoPlay.addListener('didDisconnect', () => {
        resolve();
        remove();
    });
});
const registerHeadlessTask = (hybridAutoPlay) => {
    if (Platform.OS !== 'android') {
        return;
    }
    AppRegistry.registerHeadlessTask('AndroidAutoHeadlessJsTask', createTaskProvider(hybridAutoPlay));
};
export default { registerHeadlessTask };
