import { Component, OnInit } from '@angular/core';
import { MediaSession } from '@jofr/capacitor-media-session';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'mediasession';
  audioElement: HTMLAudioElement | null
  playbackStopped: boolean

  constructor() {
    this.audioElement = document.querySelector('audio');
    this.playbackStopped = true;
  }

  ngOnInit(): void {


const updatePositionState = () => {
  MediaSession.setPositionState({
      position: this.audioElement?.currentTime ?? 0,
      duration: this.audioElement?.duration ?? 0,
      playbackRate: this.audioElement?.playbackRate ?? 0
  });
}

this.audioElement?.addEventListener('durationchange', updatePositionState);
this.audioElement?.addEventListener('seeked', updatePositionState);
this.audioElement?.addEventListener('ratechange', updatePositionState);
this.audioElement?.addEventListener('play', updatePositionState);
this.audioElement?.addEventListener('pause', updatePositionState);

const updatePlaybackState = () => {
  const playbackState = this.playbackStopped ? 'none' : (this.audioElement?.paused ? 'paused' : 'playing');
  MediaSession.setPlaybackState({
      playbackState: playbackState
  });
}

this.audioElement?.addEventListener('play', () => {
  this.playbackStopped = false;
  updatePlaybackState();

  MediaSession.setMetadata({
      title: 'Prelude',
      artist: 'Jan Morgenstern',
      album: 'Big Buck Bunny',
      artwork: [
          { src: './assets/imgs/logo.png', type: 'image/png', sizes: '512x512' }
      ]
  });
});
this.audioElement?.addEventListener('pause', updatePlaybackState);


MediaSession.setActionHandler({ action: 'play' }, () => {
  this.audioElement?.play();
});

MediaSession.setActionHandler({ action: 'pause' }, () => {
  this.audioElement?.pause();
});

MediaSession.setActionHandler({ action: 'seekto' }, (details) => {
  if (this.audioElement != null) {
    this.audioElement.currentTime = details.seekTime ?? 0;
  }
});

MediaSession.setActionHandler({ action: 'seekforward' }, (details: any) => {
  const seekOffset = details.seekOffset ?? 30;
  if (this.audioElement != null) {
  this.audioElement.currentTime = this.audioElement?.currentTime + seekOffset;
  }
});

MediaSession.setActionHandler({ action: 'seekbackward' }, (details: any) => {
  const seekOffset = details.seekOffset ?? 30;
  if (this.audioElement != null) {
  this.audioElement.currentTime = this.audioElement?.currentTime - 30;
  }
});

MediaSession.setActionHandler({ action: 'stop' }, () => {
  this.playbackStopped = true;
  this.audioElement?.pause();
});
  }
}
