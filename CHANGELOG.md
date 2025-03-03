# 3.1.1 (2019-06-26)

- Fixed the search component to handle searches with no applied value. [#34](https://github.com/blackbaud/skyux-lookup/pull/34)

# 3.1.0 (2019-06-07)

- Added the ability to trigger responsive styles based on a parent component. [#21](https://github.com/blackbaud/skyux-lookup/pull/21)
- Fixed the search component to trim whitespace when search text is entered. [#31](https://github.com/blackbaud/skyux-lookup/pull/31) (Thanks @Blackbaud-JackMcElhinney)

# 3.0.3 (2019-05-28)

- Fixed the search component to use the correct visual styles when focused. [#27](https://github.com/blackbaud/skyux-lookup/pull/27)

# 3.0.2 (2019-05-17)

- Fixed the autocomplete component to emit a `selectionChange` event when the input is cleared. [#22](https://github.com/blackbaud/skyux-lookup/issues/22)
- Fixed the autocomplete component to properly represent Angular form control statuses (dirty, pristine, etc.). [#20](https://github.com/blackbaud/skyux-lookup/issues/20)

# 3.0.1 (2019-02-11)

- Removed a reference to the deprecated `AnimationTransitionEvent` in favor of `AnimationEvent`. This allows the library to compile against later versions of Angular that have removed the deprecated type. [#13](https://github.com/blackbaud/skyux-lookup/pull/13)

# 3.0.0 (2019-01-11)

- Major version release.

# 3.0.0-rc.5 (2018-11-19)

- Updated peer dependencies to support Angular versions greater than `4.3.6`. [#9](https://github.com/blackbaud/skyux-lookup/pull/9)

# 3.0.0-rc.4 (2018-11-14)

- Added the `debounceTime` input to the autocomplete component. [#8](https://github.com/blackbaud/skyux-lookup/pull/8)

# 3.0.0-rc.3 (2018-11-12)

- Fixed the autocomplete component to properly position the dropdown when inside a vertical tab form. [#2](https://github.com/blackbaud/skyux-lookup/pull/2)

# 3.0.0-rc.2 (2018-11-08)

- Added support for `@skyux/i18n@3.3.0`, which addresses some internationalization issues. [#5](https://github.com/blackbaud/skyux-lookup/pull/5)

# 3.0.0-rc.1 (2018-10-18)

- Added support for `@skyux/i18n@3.2.0`. [#3](https://github.com/blackbaud/skyux-lookup/pull/3)

# 3.0.0-rc.0 (2018-10-09)

- Initial release candidate.

# 3.0.0-alpha.0 (2018-10-08)

- Initial alpha release.
