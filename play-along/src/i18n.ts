import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const RESSOURCES = {
  en: {
    translation: {
      langName: "English",
      language: "Language",
      helpTitle: "Help",
      settingsTitle: "Settings",
      instrumentKey: "Instrument Key",
      clef: "Clef",
      bassClef: "Bass",
      trebleClef: "Treble",
      allScores: "All Scores",
      name: "Name",
      artist: "Artist",
      search: "Search",
      submit: "Submit",
      fullName: "Full Name",
      email: "Email Address",
      message: "Message",
      contact: "Contact",
      contactTxt:
        "If you have any questions, need assistance, or want to provide us with helpful feedback, please don't hesitate to use the following contact form.",
      intro:
        "Welcome to our sheet music website! We are pleased to offer a wide variety of sheet music for a variety of musical styles and instruments. Our website features interactive sheet music that is synced with corresponding music videos, allowing you to play along with the video as you practice.",
    },
  },
  es: {
    translation: {
      langName: "Español",
      language: "Lenguaje",
      helpTitle: "Ayuda",
      settingsTitle: "Ajustes",
      instrumentKey: "Clave",
      clef: "Clave",
      bassClef: "Fa",
      trebleClef: "Sol",
      allScores: "Todas",
      name: "Nombre",
      artist: "Artista",
      search: "Búsqueda",
      submit: "Enviar",
      fullName: "Nombre",
      email: "Dirección de correo electrónico",
      message: "Mensaje",
      contact: "Contacto",
      contactTxt:
        "Si tiene alguna pregunta, necesita ayuda o desea brindarnos comentarios útiles, no dude en utilizar el siguiente formulario de contacto.",
      intro:
        "¡Bienvenido a nuestro sitio web de partituras! Nos complace ofrecer una amplia variedad de partituras para una variedad de estilos e instrumentos musicales. Nuestro sitio web presenta partituras interactivas que se sincronizan con los videos musicales correspondientes, lo que le permite reproducir el video mientras practica.",
    },
  },
  de: {
    translation: {
      langName: "Deutsch",
      language: "Sprache",
      helpTitle: "Hilfe",
      settingsTitle: "Einstellungen",
      instrumentKey: "Clave",
      clef: "Schlüssel",
      bassClef: "Bass",
      trebleClef: "Violin",
      allScores: "Alle Lieder",
      name: "Name",
      artist: "Künstler",
      search: "Suche",
      submit: "Absenden",
      fullName: "Vor- und Nachname",
      email: "Email Addresse",
      message: "Nachricht",
      contact: "Kontakt",
      contactTxt:
        "Wenn Sie Fragen haben, Hilfe benötigen oder uns hilfreiches Feedback geben möchten, nutzen Sie bitte das folgende Kontaktformular.",
      intro:
        "Willkommen auf unserer Noten-Website! Wir freuen uns, eine große Auswahl an Noten für verschiedene Musikstile und Instrumente anbieten zu können. Auf unserer Website finden Sie interaktive Noten, die mit entsprechenden Musikvideos synchronisiert sind, so dass Sie beim Üben zum Video mitspielen können.",
    },
  },
};
type LangKey = keyof typeof RESSOURCES;

export const LANGUAGES = Object.keys(RESSOURCES) as LangKey[];
const langKey = "lang";

/** Returns the currently selected language from local storage. */
const getLangCode = () => {
  const ret = localStorage.getItem(langKey);
  return ret ? ret : LANGUAGES[0];
};

export const getSelectorInfo = (t: any) => {
  const langMap: { [key: string]: string } = {};
  LANGUAGES.forEach((langCode) => {
    langMap[langCode] = RESSOURCES[langCode].translation.langName;
  });
  return {
    getLangCode,
    key: langKey,
    map: langMap,
  };
};

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  lng: getLangCode(),
  interpolation: {
    escapeValue: false,
  },
  resources: RESSOURCES,
});

export default i18n;
