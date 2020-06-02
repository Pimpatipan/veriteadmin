<template>
  <b-row class="mt-3">
    <b-col>
      <div>
        <button
          class="btn btn-secondary seo-btn"
          type="button"
          data-toggle="collapse"
          data-target="#collapseExample"
          aria-expanded="false"
          aria-controls="collapseExample"
        >SEO</button>
        <font-awesome-icon icon="sort-down" class="arrow-logo" />
      </div>
      <div class="collapse" id="collapseExample">
        <div class="card card-body">
          <div v-for="(item, index) in data" v-bind:key="index">
            <div v-bind:class="[ langActive == item.languageId ? '' : 'd-none' ]">
              <b-row>
                <b-col>
                  <InputText
                    class="mb-4"
                    textFloat="Meta Title"
                    placeholder="Meta Title"
                    type="text"
                    name="name"
                    v-model="item.metaTitle"
                    isRequired
                    :img="img"
                    :isValidate="isValidate.$each.$iter[index].metaTitle.$error"
                    :v="v.$each.$iter[index].metaTitle"
                  />
                </b-col>
              </b-row>
            </div>

            <div v-bind:class="[ langActive == item.languageId ? '' : 'd-none' ]">
              <b-row>
                <b-col>
                  <InputText
                    class="mb-4"
                    textFloat="Meta Keyword"
                    placeholder="Meta Keyword"
                    type="text"
                    name="name"
                    v-model="item.metaKeyword"
                    isRequired
                    :img="img"
                    :isValidate="isValidate.$each.$iter[index].metaKeyword.$error"
                    :v="v.$each.$iter[index].metaKeyword"
                  />
                </b-col>
              </b-row>
            </div>

            <div v-bind:class="[ langActive == item.languageId ? '' : 'd-none' ]">
              <b-row>
                <b-col>
                  <InputTextArea
                    class="mb-4"
                    textFloat="Meta Description"
                    placeholder="Meta Description"
                    type="text"
                    name="name"
                    v-model="item.metaDescription"
                    isRequired
                    :img="img"
                    :isValidate="isValidate.$each.$iter[index].metaDescription.$error"
                    :v="v.$each.$iter[index].metaDescription"
                  />
                </b-col>
              </b-row>
            </div>
          </div>
        </div>
      </div>
    </b-col>
  </b-row>
</template>

<script>
import InputText from "@/components/inputs/InputText";
import InputTextArea from "@/components/inputs/InputTextArea";

export default {
  components: {
    InputText,
    InputTextArea
  },
  props: {
    data: {
      required: false,
      type: Array
    },
    img: {
      required: false,
      type: String
    },
    langActive: {
      required: false,
      type: Number
    },
    isValidate: {
      required: false,
      type: Object
    },
    v: {
      required: false,
      type: Object
    }
  },
  methods: {
    onDataChange(event) {
      this.$emit("onDataChange", event.target.value);
    }
  }
};
</script>