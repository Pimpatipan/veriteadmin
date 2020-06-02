import Vue from 'vue';
import VueI18n from 'vue-i18n';
import VueCookies from 'vue-cookies';

const messages = {
    'en': {
        login: 'Login',
        register: 'Register',
        search: 'Search',
    },
    'th': {
        login: 'เข้าสู่ระบบ',
        register: 'สมัครสมาชิก',
        search: 'ค้นหา',
    }
};

Vue.use(VueI18n);
Vue.use(VueCookies)

let language = VueCookies.get('back_office_language') || 'th'

export const i18n = new VueI18n({
    locale: language, // set locale
    fallbackLocale: language,
    messages, // set locale messages
})