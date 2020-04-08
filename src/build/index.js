'use strict';
Object.defineProperty(exports, '__esModule', { value: true });

const architect = require('@angular-devkit/architect');
const path = require('path');
const rxjs = require('rxjs');
const operators = require('rxjs/operators');
const fs = require('fs');

async function initialize(options, root) {
    const packager = (await Promise.resolve().then(() => require('ng-packagr'))).ngPackagr();
    packager.forProject(path.resolve(root, options.project));
    if (options.tsConfig) {
        packager.withTsConfig(path.resolve(root, options.tsConfig));
    }
    return packager;
}

function execute(options, context) {
    return rxjs.from(initialize(options, context.workspaceRoot)).pipe(
        operators.switchMap(packager =>
            options.watch
                ? packager.watch().pipe(operators.tap(e => rxjs.from(postBuild(options, context).then(r => e))))
                : packager.build().then(e => postBuild(options, context).then(r => e))
        ),
        operators.mapTo({ success: true })
    );
}
exports.execute = execute;
exports.default = architect.createBuilder(execute);

function postBuild(options, context) {
    var cfg = path.resolve(context.workspaceRoot, options.project, '..', 'post-build.js');
    if (fs.existsSync(cfg)) {
        var module = require(cfg);
        return module(options, context);
    }
    return Promise.resolve(null);
}
