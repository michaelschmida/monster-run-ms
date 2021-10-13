import p5 = require('p5');
import { p } from './index';

export class Background {
  public readonly images: { [key: string]: p5.Image } = {};
  private image?: p5.Image;
  private currentImageName?: string;

  constructor() {
  }

  addImage(backgroundName: string, imageName: string) {
    this.images[backgroundName] = p.loadImage(imageName);
    if (!this.image) {
      this.activateImage(backgroundName);
    }
  }

  activateImage(backgroundName: string) {
    if (backgroundName == this.currentImageName) return;

    this.currentImageName = backgroundName;
    this.image = this.images[backgroundName];
  }

  get currentImage() {
    return this.image;
  }
}
