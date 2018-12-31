import i18next from 'i18next';
import Backend from 'i18next-xhr-backend';
import LngDetector from 'i18next-browser-languagedetector';
import { reactI18nextModule } from 'react-i18next';


const options = {
  // order and from where user language should be detected
  order: ['htmlTag'],
  htmlTag: document.getElementById('react-language')	
}
i18next
  .use(Backend)	
  .use(LngDetector)
  .init({
    detection: options
  })
  .use(reactI18nextModule)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    fallbackLng: 'en',
    debug: false,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    // special options for react-i18next
    // learn more: https://react.i18next.com/components/i18next-instance
    react: {
      wait: false
    }
  });

export default i18next;