import p5 = require('p5');
import { p } from './index';

interface SpriteAnimation {
    images: p5.Image[];
    msPerFrame: number;
}

class RunningAnimation {
  private endOfAnimationCallbackCalled?: boolean;
  public animationStart: number;

  constructor(public name: string, public once: boolean = true, public endOfAnimationCallback?: () => void) {
    this.animationStart = p.millis();
  }

  notifyEndOfAnimation() {
    if (this.endOfAnimationCallback && !this.endOfAnimationCallbackCalled) {
      this.endOfAnimationCallback();
      this.endOfAnimationCallbackCalled = true;
    }
  }
}

export class AnimatedSprite {
    private readonly animations: { [key: string]: SpriteAnimation } = {};

    public currentAnimation?: RunningAnimation;
    private idleAnimation?: SpriteAnimation;
    private idleAnimationStart: number;
    private previousImage?: p5.Image;

    constructor(public width: number, public height: number) {}

    addAnimation(animationName: string, imageNames: string[], speed: number) {
        const images = imageNames.map((name) => p.loadImage(name));
        this.animations[animationName] = { images: images, msPerFrame: speed };
    }

    addAnimationWithNameBuilder(
        animationName: string,
        numberOfImages: number,
        speed: number,
        imageNameBuilder: (animation: string, index: number) => string
    ) {
        let images: string[];
        images = [];
        for (let i = 0; i <= numberOfImages; i++) {
            images.push(imageNameBuilder(animationName, i));
        }

        this.addAnimation(animationName, images, speed);
    }

    setIdleAnimation(animationName: string) {
      this.idleAnimation = this.animations[animationName];
      this.idleAnimationStart = p.millis();
    }

    clearIdleAnimation() {
      delete this.idleAnimation;
    }

    activateAnimation(animationName: string, once: boolean = false, endOfAnimationCallback?: () => void) {
      if (this.currentAnimation?.name === animationName && this.currentAnimation?.once == once) {
        return;
      }

      this.currentAnimation?.notifyEndOfAnimation();
      this.currentAnimation = new RunningAnimation(animationName, once, endOfAnimationCallback);
    }

    //Anmimation beenden
    clearAnimation() {
      if (this.currentAnimation && !this.currentAnimation.once) {
        const running = this.currentAnimation;
        delete this.currentAnimation;
        this.idleAnimationStart = p.millis();
        running.notifyEndOfAnimation();
      }
    }

    draw(paint: boolean = true) {
        let imageToShow: p5.Image;
        if (this.currentAnimation) {
          const anim = this.animations[this.currentAnimation.name];
          const totalFrames = Math.round((p.millis() - this.currentAnimation.animationStart) / anim.msPerFrame);
          if (this.currentAnimation.once && totalFrames > anim.images.length) {
            const running = this.currentAnimation;
            delete this.currentAnimation;
            this.idleAnimationStart = p.millis();
            running.notifyEndOfAnimation();
          } else {
            imageToShow = anim.images[totalFrames % anim.images.length];
          }
        }
        
        if (!imageToShow && this.idleAnimation) {
          const totalFrames = Math.round((p.millis() - this.idleAnimationStart) / this.idleAnimation.msPerFrame);
          imageToShow = this.idleAnimation.images[totalFrames % this.idleAnimation.images.length];
        }

        if (paint) {
          if (imageToShow || this.previousImage) {
            p.image(imageToShow ?? this.previousImage, -this.width / 2, 0, this.width, this.height);
            this.previousImage = imageToShow;
          }
        }
    }
}
