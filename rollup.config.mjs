import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import path from "node:path";
import url from "node:url";
import alias from '@rollup/plugin-alias';

const isWatching = !!process.env.ROLLUP_WATCH;
const sdPlugin = "uno.overlays.v2.sdPlugin";
//@type {import('rollup').RollupOptions}

const config = [{
    input: "src/plugin/plugin.ts",
    output: {
        file: `${sdPlugin}/bin/plugin.js`,
				format: "cjs",
        sourcemap: isWatching,
        sourcemapPathTransform: (relativeSourcePath, sourcemapPath) => {
            return url.pathToFileURL(path.resolve(path.dirname(sourcemapPath), relativeSourcePath)).href;
        }
    },
    plugins: [
        {
            name: "watch-externals",
            buildStart: function () {
                this.addWatchFile(`${sdPlugin}/manifest.json`);
            },
        },
        typescript({
            mapRoot: isWatching ? "./" : undefined,
						tsconfig: "tsconfig.json",
        }),
        nodeResolve({
            browser: false,
            exportConditions: ["node"],
            preferBuiltins: true
        }),
        commonjs({
					transformMixedEsModules: true,
            include: ['node_modules/**'],
				}),
        !isWatching && terser(),
        {
            name: "emit-module-package-file",
            generateBundle() {
                this.emitFile({ fileName: "package.json", source: JSON.stringify({ type: "module" }, null, 2), type: "asset" });
            }
        }
    ]
}, {
    input: `src/ui/pi.ts`,
    output: {
        file: `${sdPlugin}/ui/pi.js`,
        sourcemap: isWatching,
        sourcemapPathTransform: (relativeSourcePath, sourcemapPath) => {
            return url.pathToFileURL(path.resolve(path.dirname(sourcemapPath), relativeSourcePath)).href;
        },
				
    },
		// treeshake: {
		// 	moduleSideEffects: false,
		// 	propertyReadSideEffects: false,
		// 	// More conservative tree-shaking
		// 	unknownGlobalSideEffects: false
		// },
    plugins: [
        typescript({
            mapRoot: isWatching ? "./" : undefined,
            tsconfig: `src/ui/tsconfig.json`,
        }),
        nodeResolve({
            browser: true,
            exportConditions: ["browser"],
            preferBuiltins: true
        }),
        commonjs(),
        !isWatching && terser(),
    ],
}];

export default config;
