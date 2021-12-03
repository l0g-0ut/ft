import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {ApiData} from "../../model/api-data";
import {faInfoCircle, faPlayCircle} from "@fortawesome/free-solid-svg-icons";
import {LanguageData, LanguageService} from "../../services/language.service";
import {SelectedLanguage} from "../../model/selected-language";

@Component({
  selector: 'step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.css']
})
export class Step1Component implements OnInit {

  userPattern = '^[a-z0-9]{14,20}$'
  keyPattern = '^[a-z0-9]{10,16}$'

  faInfo = faInfoCircle;
  faPlay = faPlayCircle;

  @Input() public apiData!: ApiData;
  @Output() callback = new EventEmitter<SelectedLanguage>();

  apiUserValidated: boolean | null = null;
  apiKeyValidated: boolean | null = null;

  error: string | null = null;
  availableSetups: SelectedLanguage[] = [];
  defaultLanguage: string | null = null;
  languageData: LanguageData | null = null;

  loadingElement: string | null = null;

  validateUser() {
    this.apiUserValidated = this.apiData.apiUser.match(this.userPattern) !== null;
  }

  validateKey() {
    this.apiKeyValidated = this.apiData.apiKey.match(this.keyPattern) !== null;
  }

  validate() {
    this.validateUser();
    this.validateKey();
    return (this.apiUserValidated && this.apiKeyValidated);
  }

  submit(selectedLanguage: SelectedLanguage) {
    if (this.validate()) {
      this.callback.emit(selectedLanguage);
    }
  }

  constructor(private service: LanguageService) {
  }

  getAvailableVoices(): Promise<SpeechSynthesisVoice[]> {
    const synth = window.speechSynthesis;
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
          if (synth.getVoices().length !== 0) {
            resolve(synth.getVoices());
            clearInterval(interval);
          }
        }, 10);
      }
    )
  }

  playTest(setup: SelectedLanguage) {
    const utterance = new SpeechSynthesisUtterance(setup.strings.hello + ' – – – ' + setup.strings.test + ' – – – ' + setup.strings.peep);
    utterance.voice = setup.voice;
    window.speechSynthesis.speak(utterance);
  }

  ngOnInit() {
    this.loadingElement = 'Loading supported languages...';
    this.service.getLanguageData().subscribe((lang) => {
      this.defaultLanguage = lang.defaultLanguage;
      this.languageData = lang.languages;
      this.loadingElement = 'Loading supported voices...';
      this.getAvailableVoices().then((voices) => {
        this.loadingElement = 'Matching languages and voices...';
        const supportedLanguageCodes = Object.keys(lang.languages);
        voices.forEach((voice) => {
          if (voice.localService) {
            if (supportedLanguageCodes.indexOf(voice.lang) >= 0) {
              this.availableSetups.push(new SelectedLanguage(lang.languages[voice.lang], voice));
            }
          }
        });
        this.loadingElement = null;
      });
    }, (error) => {
      this.error = 'Unable to load language data. Please try again later!';
    });
  }

}
