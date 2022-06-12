module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  snapshotSerializers: ['jest-serializer-vue'],
  collectCoverageFrom: ['src/**/*.{js,vue}'],
  coveragePathIgnorePatterns: ['src/index.js']
}
