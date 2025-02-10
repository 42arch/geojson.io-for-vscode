/// <reference types="vite/client" />

interface VsCodeApi {
  postMessage: (message: { type: string; data: string }) => void
}

declare const vscode: VsCodeApi
declare module '@mapbox/mapbox-gl-draw-static-mode'
