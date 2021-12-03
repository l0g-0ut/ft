import {Component, Input, OnInit} from "@angular/core";
import {ApiData} from "../../model/api-data";
import {EmlalockSessionServiceService} from "../../services/emlalock.session.service";
import {SelectedLanguage} from "../../model/selected-language";
import {faPlay, faStop} from "@fortawesome/free-solid-svg-icons";


const MIN = 60;
const HOUR = (60 * MIN);
const DAY = (24 * HOUR);
const WEEK = (7 * DAY);


@Component({
  selector: 'step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.css']
})
export class Step2Component implements OnInit {

  @Input() public apiData!: ApiData;
  @Input() public setup!: SelectedLanguage;

  intervalId: null | number = null;

  faPlaying = faPlay;
  faStopped = faStop;

  constructor(private service: EmlalockSessionServiceService) {
  }

  private say(text: string, replacements: {[val: string]: string} = {}) {
    let speech = text;
    Object.entries(replacements).forEach(
      ([key, value]) => {
        speech = speech.replace('{' + key + '}', value);
      }
    );
    const utterance = new SpeechSynthesisUtterance(speech);
    utterance.voice = this.setup.voice;
    speechSynthesis.speak(utterance);
  }

  tell(withGreeting: boolean = false) {
    this.service.getSessionInformation(this.apiData).subscribe((data) => {
      if (withGreeting) {
        this.say(this.setup.strings.greeting, {'user': data.user.username})
      }
      if (!data.chastitysession) {
        this.say(this.setup.strings.noSession);
      }
      else {
        if (data.chastitysession.enddate) {
          let rest = data.chastitysession.enddate - (+new Date() / 1000);
          let days = 0;
          let hours = 0;
          let minutes = 0;
          let seconds = 0;
          let weeks = Math.floor(rest / WEEK);
          rest = rest - (weeks * WEEK);
          if (rest > 0) {
            days = Math.floor(rest / DAY);
            rest = rest - (days * DAY);
          }
          if (rest > 0) {
            hours = Math.floor(rest / HOUR);
            rest = rest - (hours * HOUR);
          }
          if (rest > 0) {
            minutes = Math.floor(rest / MIN);
          }
          let retData = [];
          if (weeks > 0) {
            retData.push(weeks + ' ' + (weeks == 1 ? this.setup.strings.week : this.setup.strings.weeks));
          }
          if (days > 0) {
            retData.push(days + ' ' + (days == 1 ? this.setup.strings.day : this.setup.strings.days));
          }
          if (hours > 0) {
            retData.push(hours + ' ' + (hours == 1 ? this.setup.strings.hour : this.setup.strings.hours));
          }
          if (minutes > 0) {
            retData.push(minutes + ' ' + (minutes == 1 ? this.setup.strings.minute : this.setup.strings.minutes));
          }
          const timeText = retData.join(', ');
          this.say(this.setup.strings.time + ' - , ! , - ' + this.setup.strings.peep, {'time': timeText});
        }
        else {
          this.say(this.setup.strings.sorry);
        }
      }
    }, (error) => {
      this.say(this.setup.strings.error);
    });
  }

  stop() {
    if (this.intervalId === null) {
      return;
    }
    window.clearInterval(this.intervalId);
    this.intervalId = null;
  }

  start(restarted: boolean = false) {
    if (this.intervalId !== null && this.intervalId !== 0) {
      return;
    }
    if (restarted) {
      this.intervalId = 0;
      this.tell();
    }
    this.intervalId = window.setInterval(() => {
      this.tell();
    }, 25000);
  }

  ngOnInit(): void {
    this.intervalId = 0;
    this.tell(true);
    this.start();
  }

}
