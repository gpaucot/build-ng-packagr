# Angular Build Architect for ng-packagr

This is a modified version of the official build-ng-packagr builder to include a post-processing.

## Configuration
The post-build.js file must be in the same folder as ng-package.json
Example to copy all scss files to output:
```js
// The postBuild function MUST return a promise.

const { copyAssets } = require('@angular-devkit/build-angular/src/utils/copy-assets');
const path = require('path');

module.exports = async function postBuild(options, context) {
    let metadata = await context.getProjectMetadata(context.target.project);
    await copyAssets(
        [
            {
                glob: '**/*.scss',
                ignore: ['**/demo/*', '**/demo/**/*'],
                input: metadata.sourceRoot,
                output: '',
            },
        ],
        [path.resolve(context.workspaceRoot, 'dist', context.target.project)],
        context.workspaceRoot
    );
};
```


## v9.0.2
- Compatibility from v9 and up

## v9.0.1
- post-build.js support

