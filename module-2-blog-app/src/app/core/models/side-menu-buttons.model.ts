export interface ISideMenuButton {
  readonly buttonTitle: string;
  readonly callback: () => void;
  readonly img: {
    readonly src: string;
    readonly alt: string;
  };
}
