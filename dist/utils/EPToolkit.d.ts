/// <reference types="node" />
type IOptions = {
    beep: boolean;
    cut: boolean;
    tailingLine: boolean;
    encoding: string;
};
export declare function exchange_text(text: string, options: IOptions): Buffer;
export declare function exchange_image(imagePath: string, threshold: number): Promise<Buffer>;
export {};
