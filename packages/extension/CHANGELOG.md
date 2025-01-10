## invert-if [3.2.1](https://github.com/1nVitr0/plugin-vscode-invert-if/compare/invert-if@3.2.0...invert-if@3.2.1) (2025-01-10)


### Bug Fixes

* **extension:** enable markdown support ([bf6e9ff](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/bf6e9ff8af9ac8b6574f73a85c198822bf72bf83))
* **extension:** use disposables instead of unregister functions ([8ec46b5](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/8ec46b5cd298b574f9c91cb427def82bbb689c75))

# invert-if [3.2.0](https://github.com/1nVitr0/plugin-vscode-invert-if/compare/invert-if@3.1.1...invert-if@3.2.0) (2025-01-10)


### Bug Fixes

* **extension:** activate on markdown ([512f576](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/512f57616908667c41ee141b3981c5c4ed7a89b8))


### Features

* **extension:** load extension only if needed ([ff28e16](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/ff28e16589658c4178886fbe19e3ae898fd6ed26))

## invert-if [3.1.1](https://github.com/1nVitr0/plugin-vscode-invert-if/compare/invert-if@3.1.0...invert-if@3.1.1) (2025-01-09)


### Bug Fixes

* **extension:** register code action provider for in-built languages ([ad64623](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/ad64623113be3c44f49f8357ded71aa41eb9a675))


### Performance Improvements

* skip registering for empty code action provider ([ecf73ce](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/ecf73cef8b3ed8836b0d995cc6d912b49552b892))

# invert-if [3.1.0](https://github.com/1nVitr0/plugin-vscode-invert-if/compare/invert-if@3.0.4...invert-if@3.1.0) (2025-01-06)


### Bug Fixes

* **extension:** use correct range for code action ([71043da](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/71043dafaad82d81959bfbf66f94e00f2ebe49a9))


### Features

* **extension:** change activation to onStartupFinished ([e901987](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/e901987f9a6c1c699024098709eb3f6b2c22815b))
* **extension:** support document context in code action provider ([928ad02](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/928ad02237175334de5059d02f2e5fc80822118d))

## invert-if [3.0.4](https://github.com/1nVitr0/plugin-vscode-invert-if/compare/invert-if@3.0.3...invert-if@3.0.4) (2025-01-05)


### Bug Fixes

* update API version to v2.0.3 ([f0a6d31](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/f0a6d31456e87f3b811d85a921386cf285593f14))

## invert-if [3.0.3](https://github.com/1nVitr0/plugin-vscode-invert-if/compare/invert-if@3.0.2...invert-if@3.0.3) (2025-01-03)


### Bug Fixes

* **extension:** update badges ([b26e077](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/b26e0772942baeb59094adfa6996c88f33165e7c))

## invert-if [3.0.2](https://github.com/1nVitr0/plugin-vscode-invert-if/compare/invert-if@3.0.1...invert-if@3.0.2) (2025-01-03)


### Bug Fixes

* **extension:** implement registering embedded language providers ([81e1d60](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/81e1d605317ea9d08c81d8b1f3c01aebda09ae41))

## invert-if [3.0.1](https://github.com/1nVitr0/plugin-vscode-invert-if/compare/invert-if@3.0.0...invert-if@3.0.1) (2025-01-03)


### Bug Fixes

* **api:** include link to github pages documentation in contributing guidelines ([4bfcbc5](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/4bfcbc5479718aa79deffd16cb430a8cc247d458))
* **extension:** remove preview tag ([5eec8d5](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/5eec8d5204b13b7c4f56cc29887c20005f1143b7))

# invert-if [3.0.0](https://github.com/1nVitr0/plugin-vscode-invert-if/compare/invert-if@2.2.1...invert-if@3.0.0) (2025-01-03)


### Bug Fixes

* **extension:** fix command syntax ([569edcd](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/569edcdd1e67e08a8cea18a219be094b4f307ffb))
* **extension:** upgrade dependencies ([ff40ef1](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/ff40ef104e09f26a9b23bb96401345ec36144456))
* **extension:** use range conversion helpers from api ([10ce7cc](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/10ce7cc32bfec75f0225692f974f889618b81242))


* feat(extension)!: add support for embedded language sections ([3a0ac8b](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/3a0ac8b4dd2f5bbae3b60d03748c677e3a027fb3))


### BREAKING CHANGES

* ranges are now relative to embedding context if applicable

## invert-if [2.2.1](https://github.com/1nVitr0/plugin-vscode-invert-if/compare/invert-if@2.2.0...invert-if@2.2.1) (2024-02-17)


### Bug Fixes

* trigger rerelease for github ([d1fc1ab](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/d1fc1ab2a154825d0101a94f04fa8ac12f9d17a4))

# invert-if [2.2.0](https://github.com/1nVitr0/plugin-vscode-invert-if/compare/invert-if@2.1.4...invert-if@2.2.0) (2024-02-17)


### Features

* **lang-js:** support typescript-jsx ([dc2088b](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/dc2088bd3f63fe20ec0881c8b473e0a9915f6d6b))

# invert-if [2.2.0](https://github.com/1nVitr0/plugin-vscode-invert-if/compare/invert-if@2.1.4...invert-if@2.2.0) (2024-02-17)


### Features

* **lang-js:** support typescript-jsx ([dc2088b](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/dc2088bd3f63fe20ec0881c8b473e0a9915f6d6b))

# invert-if [2.2.0](https://github.com/1nVitr0/plugin-vscode-invert-if/compare/invert-if@2.1.4...invert-if@2.2.0) (2024-02-17)


### Features

* **lang-js:** support typescript-jsx ([dc2088b](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/dc2088bd3f63fe20ec0881c8b473e0a9915f6d6b))

# invert-if [2.2.0](https://github.com/1nVitr0/plugin-vscode-invert-if/compare/invert-if@2.1.4...invert-if@2.2.0) (2024-02-17)


### Features

* **lang-js:** support typescript-jsx ([dc2088b](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/dc2088bd3f63fe20ec0881c8b473e0a9915f6d6b))

## invert-if [2.1.4](https://github.com/1nVitr0/plugin-vscode-invert-if/compare/invert-if@2.1.3...invert-if@2.1.4) (2022-10-12)


### Bug Fixes

* fix regression for inverting multiple selections ([a6b4d1e](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/a6b4d1ec004cdcb9a3282542a64f890847c5fc1f))

## invert-if [2.1.3](https://github.com/1nVitr0/plugin-vscode-invert-if/compare/invert-if@2.1.2...invert-if@2.1.3) (2022-10-12)


### Bug Fixes

* provide code actions for initial providers ([9d02db6](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/9d02db6677336b234554b44c147651e0f8809f2b))

## invert-if [2.1.2](https://github.com/1nVitr0/plugin-vscode-invert-if/compare/invert-if@2.1.1...invert-if@2.1.2) (2022-10-12)


### Bug Fixes

* dEAVCBRQLJEKNAGSÖLKARMNQ ÖK53QAEFNSDVAÖKWBÖK ([cff0132](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/cff01323e38915827d3aaef0999ae1762fd87aff))
* **extension:** export api in activation function ([8f08a83](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/8f08a8316ba616232de933ec63703487e7d6c0a2))
* **extension:** fix compilation ([e9c8f78](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/e9c8f7808bfd1ec7107c8f2f119f4cab9bcdc5fb))
* **extension:** respect available languages for code actions ([01103d2](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/01103d287c1e3506daa9fde3e51617f351d81628))
* **extension:** respect available languages for code actions ([65792b0](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/65792b0f2651544e77b0592d39476cc6bdd7496e))

## invert-if [2.1.2](https://github.com/1nVitr0/plugin-vscode-invert-if/compare/invert-if@2.1.1...invert-if@2.1.2) (2022-10-09)


### Bug Fixes

* dEAVCBRQLJEKNAGSÖLKARMNQ ÖK53QAEFNSDVAÖKWBÖK ([cff0132](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/cff01323e38915827d3aaef0999ae1762fd87aff))
* **extension:** export api in activation function ([8f08a83](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/8f08a8316ba616232de933ec63703487e7d6c0a2))
* **extension:** respect available languages for code actions ([01103d2](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/01103d287c1e3506daa9fde3e51617f351d81628))
* **extension:** respect available languages for code actions ([65792b0](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/65792b0f2651544e77b0592d39476cc6bdd7496e))

## invert-if [2.1.2](https://github.com/1nVitr0/plugin-vscode-invert-if/compare/invert-if@2.1.1...invert-if@2.1.2) (2022-10-09)


### Bug Fixes

* **extension:** export api in activation function ([8f08a83](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/8f08a8316ba616232de933ec63703487e7d6c0a2))
* **extension:** respect available languages for code actions ([01103d2](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/01103d287c1e3506daa9fde3e51617f351d81628))
* **extension:** respect available languages for code actions ([65792b0](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/65792b0f2651544e77b0592d39476cc6bdd7496e))

## invert-if [2.1.2](https://github.com/1nVitr0/plugin-vscode-invert-if/compare/invert-if@2.1.1...invert-if@2.1.2) (2022-10-09)


### Bug Fixes

* **extension:** export api in activation function ([8f08a83](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/8f08a8316ba616232de933ec63703487e7d6c0a2))
* **extension:** respect available languages for code actions ([01103d2](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/01103d287c1e3506daa9fde3e51617f351d81628))
* **extension:** respect available languages for code actions ([65792b0](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/65792b0f2651544e77b0592d39476cc6bdd7496e))

## invert-if [2.1.2](https://github.com/1nVitr0/plugin-vscode-invert-if/compare/invert-if@2.1.1...invert-if@2.1.2) (2022-10-09)


### Bug Fixes

* **extension:** export api in activation function ([8f08a83](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/8f08a8316ba616232de933ec63703487e7d6c0a2))
* **extension:** respect available languages for code actions ([01103d2](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/01103d287c1e3506daa9fde3e51617f351d81628))
* **extension:** respect available languages for code actions ([65792b0](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/65792b0f2651544e77b0592d39476cc6bdd7496e))

## invert-if [2.1.1](https://github.com/1nVitr0/plugin-vscode-invert-if/compare/invert-if@2.1.0...invert-if@2.1.1) (2022-10-09)


### Bug Fixes

* **extension:** export api in activation function ([bd537aa](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/bd537aaa9b3a826a3be328afb191406302dafe98))

# invert-if [2.1.0](https://github.com/1nVitr0/plugin-vscode-invert-if/compare/invert-if@2.0.4...invert-if@2.1.0) (2022-10-08)


### Bug Fixes

* **extension:** fix imports ([5f92942](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/5f9294289eb992d4a5f2af376034913ddde71780))
* **extension:** make extension always active to allow plugin registration ([5ce9db7](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/5ce9db78b4362eca502554602cf617339b8a4116))


### Features

* **extension:** add Code Action / Refactoring provider ([903f9b2](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/903f9b22314a4ecf7f653886b30a782549531d14))
* **extension:** edits are now synchronous ([58496d2](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/58496d298a3630995eb95b6cd75645589da25313))

# invert-if [2.1.0](https://github.com/1nVitr0/plugin-vscode-invert-if/compare/invert-if@2.0.4...invert-if@2.1.0) (2022-10-08)


### Bug Fixes

* **extension:** make extension always active to allow plugin registration ([5ce9db7](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/5ce9db78b4362eca502554602cf617339b8a4116))


### Features

* **extension:** add Code Action / Refactoring provider ([903f9b2](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/903f9b22314a4ecf7f653886b30a782549531d14))
* **extension:** edits are now synchronous ([58496d2](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/58496d298a3630995eb95b6cd75645589da25313))

# invert-if [2.1.0](https://github.com/1nVitr0/plugin-vscode-invert-if/compare/invert-if@2.0.4...invert-if@2.1.0) (2022-10-08)


### Bug Fixes

* **extension:** make extension always active to allow plugin registration ([5ce9db7](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/5ce9db78b4362eca502554602cf617339b8a4116))


### Features

* **extension:** add Code Action / Refactoring provider ([903f9b2](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/903f9b22314a4ecf7f653886b30a782549531d14))
* **extension:** edits are now synchronous ([58496d2](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/58496d298a3630995eb95b6cd75645589da25313))

## invert-if [2.0.4](https://github.com/1nVitr0/plugin-vscode-invert-if/compare/invert-if@2.0.3...invert-if@2.0.4) (2022-10-06)


### Bug Fixes

* **extension:** log plugin registrations to console ([7347b41](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/7347b41887ef195a6bb8b241b39d4f1806bdc820))

## invert-if [2.0.3](https://github.com/1nVitr0/plugin-vscode-invert-if/compare/invert-if@2.0.2...invert-if@2.0.3) (2022-10-05)


### Bug Fixes

* **main:** implement simplified plugin API ([061f359](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/061f359f68d22710d44124f211730ed5206292a2))

## invert-if [2.0.3](https://github.com/1nVitr0/plugin-vscode-invert-if/compare/invert-if@2.0.2...invert-if@2.0.3) (2022-10-05)


### Bug Fixes

* **main:** implement simplified plugin API ([061f359](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/061f359f68d22710d44124f211730ed5206292a2))


# invert-if [2.0.2](https://github.com/1nVitr0/plugin-vscode-invert-if/compare/invert-if@v2.0.1...invert-if@2.0.2) (2022-10-05)


### Bug Fixes

* update changelog after manual releases ([478bfbf](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/478bfbf64492f27d95812753f79f1541d949afb5))

# invert-if 2.0.1 (2022-10-04)


### Bug Fixes

* **main:** fix contributing spelling ([7629f41](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/7629f4180804d6ee1ebff6b6bbe8c3b9960168da))
* **main:** update documentation ([818b1cd](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/818b1cd439b8afb7e5c87f7f51d10d570acb1790))

# [2.0.0](https://github.com/1nVitr0/plugin-vscode-invert-if/releases/tag/main_v2.0.0) (2022-10-03)


### Features

* standardized API for language connectors ([e9e940c](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/e9e940c44995f23745d9ecf27cad735cd57c8aef))
* implement new standardized API ([cb3fcce](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/cb3fcceb7bf742bd1d0962fbb5424f6365acf244))
* ts and js language connector as separate module ([fe04ef9](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/fe04ef95be0015c00387f46d67139627452434f5))


# [1.0.0](https://github.com/1nVitr0/plugin-vscode-invert-if/releases/tag/main_sv1.0.0) (2021-09-25)


### Bug Fixes

* condition extraction now extracts all conditions ([f37bbbd](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/f37bbbd44a5030b22358108efa94fdf28fff1a30))
* fix all current test errors ([f2353b6](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/f2353b6b5ff26caebca219b5dc513f27c40532d3))


### Features

* add basic condition inversion ([9f6f7f1](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/9f6f7f104ae0e4bdb3022030bb9ea7120e954325))
* add condition inversion ([d6e4def](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/d6e4def179ca15d5de215f97cf880259df2ba0ab))
* add initial tests ([f211048](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/f211048dfca8317af8e0e8b5bbcacd14c352ee36))
* add invertIf.invertIfElse command ([4367dd7](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/4367dd7273c6cc6d261e9d00307fd7d84f547077))
* add nyc coverage output for extension tests ([5b8919f](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/5b8919f80883590ab5b6cd45affd1b89849f309e))
* bootstrap plugin files ([03f9991](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/03f99915857a626e652859a7d76b5783d6e87d6a))
* implement basic if-else inversion ([8b4a2cb](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/8b4a2cb60b1b73618a2c3159b8dd09f7aa3f2673))
* implement condition inversion ([9a5e78c](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/9a5e78c560f33755879d8987d0742ccbed736524))
* implement guard clause command ([0e37e26](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/0e37e26638f59e8f1f292934c0317d090e627803))
* implement GuardService ([4599e87](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/4599e87de37beb8e89e53211f20d71effe191c72))
* implement if block extraction ([3aaa04a](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/3aaa04a314cb3c7314dadfd3e541cd6f4dcc6dca))
* implement invert condition command ([be34f61](https://github.com/1nVitr0/plugin-vscode-invert-if/commit/be34f61f664f00063244f1b0e0d6c84a3c32d691))
