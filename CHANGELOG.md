Changelog

## [4.0.1](https://github.com/Colonise/DataSource/compare/v4.0.0...v4.0.1) (2020-10-27)


### Bug Fixes

* Subject lost initial subscription call on subscribe ([1446eda](https://github.com/Colonise/DataSource/commit/1446eda069d28065821338b331635289d3cafda5))

# [4.0.0](https://github.com/Colonise/DataSource/compare/v3.3.0...v4.0.0) (2020-10-25)


### Features

* **SorterProcessor:** change direction to an enum ([f03d184](https://github.com/Colonise/DataSource/commit/f03d184f639a65be1e388ef64910c9e0a3acb604))


### BREAKING CHANGES

* **SorterProcessor:** change SorterProcessor direction to an enum

# [3.3.0](https://github.com/Colonise/DataSource/compare/v3.2.0...v3.3.0) (2020-10-23)


### Bug Fixes

* **build:** actually use correct property on id-denylist ([d508500](https://github.com/Colonise/DataSource/commit/d5085005eba0b8c60645b12037e302cf20710e77))
* **build:** check if id-denylist is defined ([5af2657](https://github.com/Colonise/DataSource/commit/5af2657d047c7c8af34ed9f61230deda1dcb550f))
* **build:** use correct id-denylist property ([1e483c3](https://github.com/Colonise/DataSource/commit/1e483c3dc4b6c41b08e6cbd70f8e3f32a376e960))


### Features

* add public .original property and .reprocess() method ([7554804](https://github.com/Colonise/DataSource/commit/7554804aa499aaf30e2b259bf2e0e35227fd3325)), closes [#97](https://github.com/Colonise/DataSource/issues/97) [#98](https://github.com/Colonise/DataSource/issues/98)

# [3.2.0](https://github.com/Colonise/DataSource/compare/v3.1.2...v3.2.0) (2020-10-20)


### Features

* **DebugProcessor:** add DebugProcessor ([e059b97](https://github.com/Colonise/DataSource/commit/e059b97c6c071cecf879c249546c9ccd8b9cc225)), closes [#99](https://github.com/Colonise/DataSource/issues/99)

## [3.1.1](https://github.com/Colonise/DataSource/compare/v3.1.0...v3.1.1) (2020-10-18)


### Bug Fixes

* install @colonise/config@3.10.10 ([02f1c76](https://github.com/Colonise/DataSource/commit/02f1c7693e4ec6f5f3d42bfb7fa47343c2d1bd05))
* update to @colonise/config@3.10.9 ([02d1c43](https://github.com/Colonise/DataSource/commit/02d1c43c2c2cd4740fbd3fd28a9dd67b4b65ea12))

## [3.0.1](https://github.com/Colonise/DataSource/compare/v3.0.0...v3.0.1) (2019-03-24)


### Bug Fixes

* **Config:** Update semantic-release and config ([15ec8d2](https://github.com/Colonise/DataSource/commit/15ec8d2))

# [3.0.0](https://github.com/Colonise/DataSource/compare/v2.0.0...v3.0.0) (2019-03-24)


### Bug Fixes

* Replace utils with @colonise/utilities ([0ddf1b9](https://github.com/Colonise/DataSource/commit/0ddf1b9))


### Features

* Update TypeScript to 3.3.1 ([943a672](https://github.com/Colonise/DataSource/commit/943a672))


### BREAKING CHANGES

* Update TypeScript and start using `unknown`

# [2.0.0](https://github.com/Colonise/DataSource/compare/v1.3.2...v2.0.0) (2018-10-28)


### Features

* upgrade TypeScript version to 3.1.3 ([a3785a5](https://github.com/Colonise/DataSource/commit/a3785a5))


### BREAKING CHANGES

* TypeScript version 2.7.2 changed to 3.1.3

# Changelog

## [1.3.2](https://github.com/Colonise/DataSource/compare/v1.3.1...v1.3.2) (2018-08-02)

### Bug Fixes

* **PagerProcessor:** empty array returned on page change ([17470c5](https://github.com/Colonise/DataSource/commit/17470c5)), closes [#29](https://github.com/Colonise/DataSource/issues/29)

## [1.3.2](https://github.com/Colonise/DataSource/compare/v1.3.1...v1.3.2) \(2018-08-02\)

### Bug Fixes

* **PagerProcessor:** empty array returned on page change \([17470c5](https://github.com/Colonise/DataSource/commit/17470c5)\), closes [#29](https://github.com/Colonise/DataSource/issues/29)

## [1.3.1](https://github.com/Colonise/DataSource/compare/v1.3.0...v1.3.1) \(2018-08-01\)

### Bug Fixes

* **ArrayDataSource:** expose array data source so it can be used publicly \([\#30](https://github.com/Colonise/DataSource/issues/30)\) \([c2251f5](https://github.com/Colonise/DataSource/commit/c2251f5)\)

## [1.3.0](https://github.com/Colonise/DataSource/compare/v1.2.0...v1.3.0) \(2018-07-31\)

### Features

* **ArrayDataSource:** add a new class `ArrayDataSource` \([a4b98e7](https://github.com/Colonise/DataSource/commit/a4b98e7)\), closes [\#24](https://github.com/Colonise/DataSource/issues/24)
