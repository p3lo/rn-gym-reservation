module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [['nativewind/babel'], ['module:react-native-dotenv'], 'react-native-reanimated/plugin'],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
    },
  };
};
