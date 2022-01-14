import type { Compiler, WebpackPluginInstance } from 'webpack';
interface ConstructorProps {
    isServer: boolean | null;
    keepServerSourcemaps: boolean | null;
}
export declare class DeleteSourceMapsPlugin implements WebpackPluginInstance {
    readonly isServer: boolean | null;
    readonly keepServerSourcemaps: boolean | null;
    constructor({ isServer, keepServerSourcemaps }?: ConstructorProps);
    apply(compiler: Compiler): void;
}
export {};
