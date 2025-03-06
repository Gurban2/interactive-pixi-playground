declare module '@pixi/react' {
  import { Container as PixiContainer, Graphics as PixiGraphics } from 'pixi.js';
  import { FunctionComponent } from 'react';
  import type { FederatedPointerEvent } from '@pixi/events';

 
  export interface StageProps {
    width: number;
    height: number;
    options?: {
      backgroundColor?: number;
      eventMode?: 'none' | 'passive' | 'auto' | 'static' | 'dynamic';
      eventFeatures?: {
        move?: boolean;
        click?: boolean;
        wheel?: boolean;
      };
      antialias?: boolean;
    };
    onpointermove?: (event: FederatedPointerEvent) => void;
    onpointerdown?: (event: FederatedPointerEvent) => void;
    children?: React.ReactNode;
  }

  // Определение свойств для компонента Container
  export interface ContainerProps {
    interactive?: boolean;
    eventMode?: 'none' | 'passive' | 'auto' | 'static' | 'dynamic';
    cursor?: string;
    pointermove?: (event: FederatedPointerEvent) => void;
    pointerdown?: (event: FederatedPointerEvent) => void;
    children?: React.ReactNode;
  }

  // Определение свойств для компонента Graphics
  export interface GraphicsProps {
    draw: (graphics: any) => void;
    eventMode?: 'none' | 'passive' | 'auto' | 'static' | 'dynamic';
    pointermove?: (event: FederatedPointerEvent) => void;
    pointerdown?: (event: FederatedPointerEvent) => void;
    pointerover?: (event: FederatedPointerEvent) => void;
    pointerout?: (event: FederatedPointerEvent) => void;
  }

  // Экспорт компонентов
  export const Stage: FunctionComponent<StageProps>;
  export const Container: FunctionComponent<ContainerProps>;
  export const Graphics: FunctionComponent<GraphicsProps>;
}
