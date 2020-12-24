import axios from 'axios'
import VueCookies from 'vue-cookies'

export async function callApi(method, url, parameter = null, header = null, body = null) {
    return await axios({
            method,
            headers: header == null ? {} : header,
            data: body == null ? {} : body,
            url,
            params: parameter == null ? {} : parameter
        })
        .then(function(response) {
            let data = response.data
                // if (VueCookies.get('back_office_token')) {
                //   VueCookies.remove("back_office_token");
                //   // VueCookies.remove("shortProfile");
                //  
                //   window.location.href = "/";
                // }

            return data;
        })
        .catch(error => {
            if (error.response.status === 401) {
                VueCookies.remove("back_office_token");
                window.location.href = "/";
            }
        })
}