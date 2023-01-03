import { Component, OnInit } from '@angular/core';
import { MediaSession } from '@jofr/capacitor-media-session';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'capacitormediasession';
  playbackStopped: boolean = true;
  audioElement: HTMLAudioElement;

  constructor () {
    // this.audioElement = new Audio()
    this.audioElement = document.querySelector('audio')!;
  }
    
  ngOnInit(): void {
    alert(1)
    this.actionHandlers()
    
    alert(2)
    this.init()
    
    alert(3)
    this.eventListeners()
    
    alert(4)
    setTimeout(() => {
      alert()
      this.audioElement.src = './assets/audio/song.mp3'
      this.audioElement.play()
    }, 2000);
  }

  actionHandlers() {
    MediaSession.setActionHandler({ action: 'play' }, () => {
      this.audioElement.play();
    });
    
    MediaSession.setActionHandler({ action: 'pause' }, () => {
      this.audioElement.pause();
    });
    
    MediaSession.setActionHandler({ action: 'seekto' }, (details) => {
      this.audioElement.currentTime = details.seekTime ?? 0;
    });
    
    MediaSession.setActionHandler({ action: 'seekforward' }, (details) => {
      const seekOffset = details.seekTime ?? 30;
      this.audioElement.currentTime = this.audioElement.currentTime + seekOffset;
    });
    
    MediaSession.setActionHandler({ action: 'seekbackward' }, (details) => {
      const seekOffset = details.seekTime ?? 30;
      this.audioElement.currentTime = this.audioElement.currentTime - 30;
    });
    
    MediaSession.setActionHandler({ action: 'stop' }, () => {
        this.playbackStopped = true;
        this.audioElement.pause();
    });  
  }

  init() {
    this.audioElement.addEventListener('play', () => {
      this.playbackStopped = false;
      this.updatePlaybackState();
  
      MediaSession.setMetadata({
          title: 'Prelude',
          artist: 'Jan Morgenstern',
          album: 'Big Buck Bunny',
          artwork: [
              { src: './assets/img/logo.png', type: 'image/png', sizes: '512x512' }
          ]
      });
    });
    this.audioElement.addEventListener('pause', this.updatePlaybackState);
  }

  eventListeners() {
    alert(22)
    this.audioElement.addEventListener('durationchange', () => this.updatePositionState())
    alert(23)
    this.audioElement.addEventListener('seeked', this.updatePositionState);
    alert(24)
    this.audioElement.addEventListener('ratechange', this.updatePositionState);
    alert(25)
    this.audioElement.addEventListener('play', this.updatePositionState);
    alert(26)
    this.audioElement.addEventListener('pause', this.updatePositionState);
    alert(27)
  }

  updatePositionState() {
    MediaSession.setPositionState({
      position: this.audioElement.currentTime,
      duration: this.audioElement.duration,
      playbackRate: this.audioElement.playbackRate
    });
  }

  updatePlaybackState() {
      const playbackState = this.playbackStopped ? 'none' : (this.audioElement.paused ? 'paused' : 'playing');
      MediaSession.setPlaybackState({
          playbackState: playbackState
      });
  }
}
