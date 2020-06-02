<template>
  <div class="position-relative mb-4">
    <div :class="['text-editor-custom', { error: isValidate }]">
      <label>
        {{textFloat}}
        <span v-if="isRequired" class="text-danger">*</span>
      </label>
      <froala @input="onDataChange" :tag="'textarea'" :config="config" :value="value"></froala>
    </div>
    <img :src="img" alt="logo-lang" v-if="img" class="logo-lang" />
    <div v-if="v && v.$error">
      <span class="text-error" v-if="v.required == false">This field can’t be empty</span>
    </div>
  </div>
</template>

<script>
import VueFroala from "vue-froala-wysiwyg";
// `new FroalaEditor('your_selector', {key: "ACTIVATION_KEY''})`
import axios from "axios";
import { async } from "q";

export default {
  name: "text-editor",
  components: { VueFroala },
  props: {
    textFloat: {
      required: true,
      type: String
    },
    placeholder: {
      required: true,
      type: String
    },
    required: {
      required: false,
      type: Boolean
    },
    isRequired: {
      required: false,
      type: Boolean
    },
    pattern: {
      required: false,
      type: String
    },
    detail: {
      required: false,
      type: String
    },
    name: {
      required: false,
      type: String
    },
    value: {
      required: false,
      type: String
    },
    isDisplay: {
      required: false,
      type: Boolean
    },
    rows: {
      required: false,
      type: Number
    },
    isValidate: {
      required: false,
      type: Boolean
    },
    maxLength: {
      required: false,
      type: Number
    },
    img: {
      required: false,
      type: String
    },
    v: {
      required: false,
      type: Object
    }
  },
  data() {
    return {
      config: {
        key:
          "UBB7jD6G4H5I3B2C10aIVLEABVAYFKc1Ce1MYGD1c1NYVMiB3B9B6A5C2C4D3H3G3H3==",
        // apiKey: 'SDB17hC8C4F4A3F3D3gxrmztdakH3fiD-17D2E2F2C1E4F1B2B8D7C7==',
        events: {
          "image.inserted": async $img => {
            var xhr = new XMLHttpRequest();
            xhr.responseType = "blob";
            xhr.onload = async () => {
              var recoveredBlob = xhr.response;
              var reader = new FileReader();
              reader.onload = async () => {
                var blobAsDataUrl = reader.result;
                var body = {
                  base64: blobAsDataUrl
                };
                let data = await this.$callApi(
                  "post",
                  `${this.$baseUrl}/api/image/WYSIWYG/save`,
                  null,
                  this.$headers,
                  body
                );
                $img[0].src = data.url + "#!";
              };
              var image = await reader.readAsDataURL(recoveredBlob);
            };
            xhr.open("GET", $img[0].src);
            xhr.send();
            //  xhr.abort();
          }
        },
        charCounterCount: true,
        toolbarInline: false,
        showOnMobile: true,
        heightMin: 400,
        fileUpload: false,
        imageUpload: true,
        imageDefaultAlign: null,
        imageDefaultDisplay: null,
        codeMirror: true,
        useClasses: false,
        imageMaxSize: 5 * 1024 * 1024,
        imageAllowedTypes: ["jpeg", "jpg", "png"],
        toolbarButtons: {
          moreText: {
            buttons: [
              "bold",
              "italic",
              "underline",
              "strikeThrough",
              "subscript",
              "superscript",
              "fontFamily",
              "fontSize",
              "textColor",
              "backgroundColor",
              "inlineClass",
              "inlineStyle",
              "clearFormatting"
            ]
          },
          moreParagraph: {
            buttons: [
              "alignLeft",
              "alignCenter",
              "alignRight",
              "formatOLSimple",
              "alignRight",
              "alignJustify",
              "formatOL",
              "formatUL",
              "paragraphFormat",
              "paragraphStyle",
              "lineHeight",
              "outdent",
              "indent",
              "quote"
            ]
          },
          moreRich: {
            buttons: [
              "insertLink",
              "insertImage",
              "insertVideo",
              "insertTable",
              "emoticons",
              "fontAwesome",
              "specialCharacters",
              "embedly",
              // "insertFile",
              "insertHR"
            ]
          },
          moreMisc: {
            buttons: [
              "undo",
              "redo",
              "fullscreen",
              // "print",
              // "getPDF",
              // "spellChecker",
              "selectAll",
              "html",
              "help"
            ],
            align: "right",
            buttonsVisible: 2
          }
        },
        fontFamily: {
          "Arial,Helvetica,sans-serif": "Arial",
          "Georgia,serif": "Georgia",
          "Impact,Charcoal,sans-serif": "Impact",
          "Tahoma,Geneva,sans-serif": "Tahoma",
          "'Times New Roman',Times,serif": "Times New Roman",
          "Verdana,Geneva,sans-serif": "Verdana",
          "Kanit-Bold": "Kanit Bold",
          "Kanit-SemiBold": "Kanit SemiBold",
          "Kanit-Medium": "Kanit Medium",
          "Kanit-Regular": "Kanit Regular",
          "Kanit-Light": "Kanit Light",
          "Kanit-Thin": "Kanit Thin"
        },
        videoUpload: false,
        tableCellStyles: {
          class1: "Class 1",
          class2: "Class 2",
          imageCenter: "Class 3"
        },
        tableStyles: {
          test: "Test"
        }
      }
    };
  },
  methods: {
    onDataChange(val) {
      this.$emit("onDataChange", val);
    }
  }
};
</script>

<style scoped>
.text-editor-custom {
  color: #16274a;
  font-size: 16px;
  margin-bottom: 2px;
  font-weight: bold;
}
.text-editor-custom.error {
  border: 2px solid red !important;
}
.text-error {
  color: red;
}
</style>