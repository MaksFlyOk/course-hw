export interface SideMenuButton {
  readonly buttonTitle: string;
  readonly callback: () => void;
  readonly img: {
    readonly src: string;
    readonly alt: string;
  };
}
