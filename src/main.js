import Vue from 'vue'
import App from './App'
import router from './router'
import CoreuiVue from '@coreui/vue'
import "./main.css";
import { iconsSet as icons } from './assets/icons/icons.js'
import { callApi } from "./api/apiUtility";
import { i18n } from "./plugins/i18n";
import VueCookies from "vue-cookies";
import Vuelidate from "vuelidate";
import VueMoment from 'vue-moment';
import vueNumeralFilterInstaller from 'vue-numeral-filter';
const moment = require('moment')
import BootstrapVue from "bootstrap-vue";
// import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "babel-polyfill";
import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faStore,
    faUser,
    faBullhorn,
    faSearch,
    faFileUpload,
    faFilter,
    faSortDown,
    faPencilAlt,
    faTrashAlt,
    faTimesCircle,
    faFileDownload,
    faEye,
    faBarcode,
    faPlus,
    faMinus,
    faStar,
    faChevronLeft,
    faChevronRight,
    faHome,
    faBuilding,
    faHotel,
    faCircle,
    faArrowRight,
    faClipboard,
    faBox,
    faHandHoldingUsd,
    faEllipsisV,
    faFileInvoice,
    faCheck,
    faTimes,

} from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarFar } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { Datetime } from 'vue-datetime'
import 'vue-datetime/dist/vue-datetime.css'
import "@/../node_modules/slick-carousel/slick/slick.css";
import "@/../node_modules/slick-carousel/slick/slick-theme.css";
import VueFroala from 'vue-froala-wysiwyg'
require('froala-editor/js/froala_editor.pkgd.min.js')
require('froala-editor/css/froala_editor.pkgd.min.css')
require('froala-editor/css/froala_style.min.css')
const req = require.context('froala-editor/js/plugins/', false, /\.(js)$/i);
req.keys().map(key => {
    require(`froala-editor/js/plugins/${key.toString().slice(2)}`)
});
Vue.config.devtools = true
Vue.config.performance = true
Vue.use(CoreuiVue)
Vue.use(vueNumeralFilterInstaller, { locale: 'en-gb' });
Vue.use(VueCookies)
Vue.use(BootstrapVue)
Vue.use(Vuelidate)
Vue.use(VueFroala, {
    config: {
        key: "UBB7jD6G4H5I3B2C10aIVLEABVAYFKc1Ce1MYGD1c1NYVMiB3B9B6A5C2C4D3H3G3H3=="
    }
})
Vue.use(VueMoment, {
    moment
});
Vue.component('datetime', Datetime);

Vue.prototype.$language = VueCookies.isKey("back_office_language") ? VueCookies.get("back_office_language") : 'th';
Vue.prototype.$callApi = callApi;
//Vue.prototype.$baseUrl = "https://api-admin-veritedev.dosetech.co";
Vue.prototype.$baseUrl = "https://api-admin.verite.co.th";
Vue.prototype.$formatDate = "DD MMM YYYY";
Vue.prototype.$formatDateTime = "DD MMM YYYY HH:mm";
Vue.prototype.$formatTime = "HH:mm";
// Vue.prototype.$headers = {
//     "API-KEY": "EC0mmErCeAp1KeY",
//     "Content-Type": "application/json",
//     culture: Vue.prototype.$language,
//     token: VueCookies.isKey("back_office_token") ? `Bearer ${VueCookies.get('back_office_token')}` : "null"
// }

Vue.prototype.$headers = {
    Authorization: VueCookies.isKey("back_office_token") ? `Bearer ${VueCookies.get('back_office_token')}` : "null"
}

Vue.component('font-awesome-icon', FontAwesomeIcon)
library.add(faStore, faUser, faBullhorn, faSearch, faFilter, faFileUpload, faSortDown, faPencilAlt, faTrashAlt, faTimesCircle, faFileDownload, faEye, faBarcode, faPlus, faMinus, faStar, faStarFar, faChevronLeft,
    faChevronRight, faHome, faBuilding, faHotel, faCircle, faArrowRight, faClipboard, faBox, faHandHoldingUsd, faEllipsisV, faFileInvoice, faCheck,
    faTimes);

let globalData = new Vue({
    data: {
        $languages: [],
    }
});

Vue.mixin({
    computed: {
        $languages: {
            get: function () { return globalData.$data.$languages },
            set: function (languages) { globalData.$data.$languages = languages; }
        }
    }
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!VueCookies.get("back_office_token")) {
            next({
                path: "/login",
            })
        } else {
            next()
        }
    } else {
        next()
    }
})

new Vue({
    el: '#app',
    i18n,
    router,
    icons,
    template: '<App/>',
    components: {
        App
    },
})