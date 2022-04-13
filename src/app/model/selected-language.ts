import {LanguageSetup} from "../services/language.service";

export class SelectedLanguage {

  constructor(public strings: LanguageSetup, public voice: SpeechSynthesisVoice, public isDefault: boolean = false) {}

}
