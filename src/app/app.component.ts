import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MediaSession } from '@jofr/capacitor-media-session';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements AfterViewInit {
  title = 'capacitormediasession';
  playbackStopped: boolean = true;

  @ViewChild('player') playerRef!: ElementRef<HTMLAudioElement>;

  get audioElement(): HTMLAudioElement {
    return this.playerRef.nativeElement;
  } 

  constructor () {}

  ngAfterViewInit(): void {
    // this.audioElement = new Audio()
    // this.audioElement = document.querySelector('audio')!;
    setTimeout(() => {
      
      console.log('this.audioElement: ', this.audioElement)
      this.actionHandlers()
      
      this.init()
      
      this.eventListeners()
      
      setTimeout(() => {
        this.audioElement.src = './assets/audio/song.mp3'
        this.audioElement.play()
      }, 2000);
    }, 3000);
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
    this.audioElement.addEventListener('durationchange', () => this.updatePositionState())
    this.audioElement.addEventListener('seeked', this.updatePositionState);
    this.audioElement.addEventListener('ratechange', this.updatePositionState);
    this.audioElement.addEventListener('play', this.updatePositionState);
    this.audioElement.addEventListener('pause', this.updatePositionState);
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
