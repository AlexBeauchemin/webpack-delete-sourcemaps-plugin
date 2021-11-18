import type { Compiler, WebpackPluginInstance } from 'webpack';
export declare class DeleteSourceMapsPlugin implements WebpackPluginInstance {
    readonly isServer: boolean | null;
    constructor({ isServer }?: {
        isServer: boolean | null;
    });
    apply(compiler: Compiler): void;
}
