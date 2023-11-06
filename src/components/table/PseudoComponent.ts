import type { DefineComponent, RendererElement, RendererNode, VNode, VNodeProps } from 'vue';

type NoUndefined<T> = T extends undefined ? never : T;

type Props =
  | (VNodeProps & {
      [key: string]: any;
    })
  | null;

// maybe this can be typed as `SetupContext`
export type Context = {
  props: any;
  attrs: any;
  slots: any;
  emit: any;
  expose: (exposed?: any) => void;
};

export type ComponentReturn = VNode<RendererNode, RendererElement, Props> & {
  __ctx?: Context;
};

export type PseudoComponent<
  T extends (...args: any[]) => ComponentReturn,
  PseudoReturnType extends ComponentReturn = ReturnType<T>,
  PseudoContext extends ComponentReturn['__ctx'] = PseudoReturnType['__ctx'],
  PseudoProps = NoUndefined<PseudoContext>['props'],
  PseudoExposed = Parameters<NoUndefined<PseudoContext>['expose']>[0]
> = DefineComponent<PseudoProps, PseudoExposed>;
