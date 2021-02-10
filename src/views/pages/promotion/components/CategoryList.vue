<template>
  <div>
    <template v-for="(item2, key2) in items">
      <div :key="`lv2-${key2}`">
        <div class="text-left my-3">
          <div class="pl-lv2">
            <b-button
              variant="toggle-tree"
              v-if="parentList.indexOf(item2.id) < 0 && item2.categoryList.length > 0"
              @click="addParent(item2.id)"
              ref="expandAll"
              class="mr-2"
            >
              <font-awesome-icon icon="plus" />
            </b-button>
            <b-button
              variant="toggle-tree"
              class="mr-2"
              v-if="parentList.indexOf(item2.id) >= 0 && item2.categoryList.length > 0"
              @click="deleteParent(item2.id)"
            >
              <font-awesome-icon icon="minus" />
            </b-button>
            <div class="parent-cat">
              <b-form-checkbox
                size="lg"
                :value="item2.id"
                @change="addRootCategory(item2.id,item2.name,section)"
                v-model="categorySelectedList"
              >
                <span v-if="item2.enabled == true">{{item2.name}} ({{item2.productCount}})</span>
                <span v-else class="text-secondary">{{item2.name}} ({{item2.productCount}})</span>
              </b-form-checkbox>
            </div>
          </div>
        </div>
      </div>
      <template v-for="(item3, key3) in item2.categoryList">
        <div :key="`lv2-${key2}-lv3-${key3}`" v-if="parentList.indexOf(item2.id) > -1">
          <div class="text-left my-3 pl-lv3">
            <div class="ml-4">
              <b-button
                variant="toggle-tree"
                v-if="parentList.indexOf(item3.id) < 0 && item3.categoryList.length > 0"
                @click="addParent(item3.id)"
                ref="expandAll"
              >
                <font-awesome-icon icon="plus" />
              </b-button>
              <b-button
                variant="toggle-tree"
                v-if="parentList.indexOf(item3.id) >= 0 && item3.categoryList.length > 0"
                @click="deleteParent(item3.id)"
              >
                <font-awesome-icon icon="minus" />
              </b-button>

              <div class="parent-cat">
                <b-form-checkbox
                  size="lg"
                  class="mt-1 ml-1"
                  v-bind:key="key3"
                  :value="item3.id"
                  v-model="categorySelectedList"
                  @change="(val) => addCategory(item3.name,key2,item2.id,item2.name, val)"
                >
                  <span v-if="item3.enabled == true">{{item3.name}} ({{item3.productCount}})</span>
                  <span v-else class="text-secondary">{{item3.name}} ({{item3.productCount}})</span>
                </b-form-checkbox>
              </div>
            </div>
          </div>
        </div>

        <template v-for="(item4, key4) in item3.categoryList">
          <div
            :key="`lv2-${key2}-lv3-${key3}-lv4-${key4}`"
            v-if="parentList.indexOf(item3.id) > -1"
          >
            <div class="text-left my-3 pl-lv4">
              <b-form-checkbox
                size="lg"
                class="mt-4 pl-lv4-cb"
                v-bind:key="key4"
                :value="item4.id"
                v-model="categorySelectedList"
                @change="addCategoryLevel2(key2,key3,item2.id,item3.id,item2.name,item3.name,item4.name)"
              >
                <span v-if="item4.enabled == true">{{item4.name}} ({{item4.productCount}})</span>
                <span v-else class="text-secondary">{{item4.name}} ({{item4.productCount}})</span>
              </b-form-checkbox>
            </div>
          </div>
        </template>
      </template>
    </template>
  </div>
</template>

<script>
import InputTextArea from "@/components/inputs/InputTextArea";
import Vue from "vue";

export default {
  components: {
    InputTextArea
  },
  props: {
    items: {
      required: true,
      type: Object | Array
    },
    parentList: {
      required: true,
      type: Object | Array
    },
    section: {
      required: false,
      type: String
    },
    dataList: {
      required: true,
      type: Object | Array
    },
  },
  data(){
      return {
          categorySelectedList : this.dataList
      }
  },
  methods: {
    addParent(ref) {
      this.parentList.push(ref);
    },
    deleteParent(ref) {
      var index = this.parentList.indexOf(ref);
      if (index !== -1) this.parentList.splice(index, 1);
    },
    addRootCategory: async function (id,name) {
      Vue.nextTick(async () => {
        this.$emit("handleAddRootCategory", id, name, this.section,this.categorySelectedList);
      });
    },
    addCategory: async function(name, indexRoot, mainId, rootname, data) {
      Vue.nextTick(async () => {
          this.$emit("handleAddCategory", name, indexRoot, mainId, rootname, this.section,this.categorySelectedList);
      });
    },
    addCategoryLevel2(indexRoot,indexMain,rootId,mainId,rootCatName,mainCatName,subCatName) {
       Vue.nextTick(async () => {
        this.$emit("handleAddCategoryLevel2", indexRoot,indexMain,rootId,mainId,rootCatName,mainCatName,subCatName,this.section,this.categorySelectedList);
       });
    },
  }
};
</script>

<style scoped>
.parent-cat {
  display: inline-block;
  position: relative;
  top: 5px;
  margin-left: 10px;
}

.pl-lv4-cb {
  margin-left: 55px;
}
</style>