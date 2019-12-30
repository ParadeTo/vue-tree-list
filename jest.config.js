module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  snapshotSerializers: ['jest-serializer-vue'],
  collectCoverageFrom: ['src/**/*.{js,vue}'],
  coveragePathIgnorePatterns: ['src/index.js']
}
