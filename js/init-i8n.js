const DEFAULT_LANG = 'en';

function getLanguage() {
    const subdomains = window.location.hostname.split(".");
    return subdomains.length >= 2 ? subdomains[0] : DEFAULT_LANG;
}

i18next.use(i18nextHttpBackend).init({
    lng: getLanguage(),
    fallbackLng: DEFAULT_LANG,
    preload: [getLanguage()],
    ns: ['translation'],
    defaultNS: 'translation',
    debug:true,
    nsSeparator: false,
    keySeparator: false,
    backend:{
        loadPath: './locales/{{lng}}/{{ns}}.json',
    }
}, function(err, t) {
    jqueryI18next.init(i18next, $);
    $('body').localize();
});
