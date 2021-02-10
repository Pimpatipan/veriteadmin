<template>
  <div>
    <button
      type="button"
      class="btn btn-main button mb-2 btn-cat"
      @click="createRootCategory"
    >Create Root Category</button>
    <button
      type="button"
      class="btn btn-main button btn-cat"
      @click="createSubCategory"
    >Create Subcategory</button>

    <div>
      <template v-for="(item2, key2) in items" class>
        <div :key="`lv2-${key2}`">
          <div class="text-left">
            <div class="pl-lv2">
              <div :class="{ menuactive: isActive(item2.id) }">
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
                <span
                  @click="getCategoryData(item2.id,item2.id)"
                  v-if="item2.enabled == true"
                >{{item2.name}} ({{item2.productCount}})</span>
                <span
                  @click="getCategoryData(item2.id,item2.id)"
                  v-else
                  class="text-secondary"
                >{{item2.name}} ({{item2.productCount}})</span>
              </div>
            </div>
          </div>
        </div>
        <template v-for="(item3, key3) in item2.categoryList">
          <div :key="`lv2-${key2}-lv3-${key3}`" v-if="parentList.indexOf(item2.id) > -1">
            <div class="text-left my-2 pl-lv3">
              <div :class="{ menuactive: isActive(item3.id) }" class="pl-lv3-box">
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
                <span @click="getCategoryData(item3.id,item3.id)" v-if="item3.enabled == true">
                  <font-awesome-icon
                    :icon="['fas', 'circle']"
                    class="circle"
                    v-if="item3.categoryList.length == 0"
                  />
                  {{item3.name}} ({{item3.productCount}})
                </span>
                <span @click="getCategoryData(item3.id,item3.id)" v-else class="text-secondary">
                  <font-awesome-icon
                    :icon="['fas', 'circle']"
                    class="circle"
                    v-if="item3.categoryList.length == 0"
                  />
                  {{item3.name}} ({{item3.productCount}})
                </span>
              </div>
            </div>
          </div>

          <template v-for="(item4, key4) in item3.categoryList">
            <div
              :key="`lv2-${key2}-lv3-${key3}-lv3-${key4}`"
              v-if="parentList.indexOf(item3.id) > -1"
            >
              <div class="text-left my-2 pl-lv3">
                <div :class="{ menuactive: isActive(item4.id) }" class="pl-lv4-box">
                  <span @click="getCategoryData(item4.id,item3.id)" v-if="item4.enabled == true">
                    <font-awesome-icon :icon="['fas', 'circle']" class="circle" />
                    {{item4.name}} ({{item4.productCount}})
                  </span>
                  <span @click="getCategoryData(item4.id,item3.id)" v-else class="text-secondary">
                    <font-awesome-icon :icon="['fas', 'circle']" class="circle" />
                    {{item4.name}} ({{item4.productCount}})
                  </span>
                </div>
              </div>
            </div>
          </template>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import InputTextArea from "@/components/inputs/InputTextArea";

export default {
  components: {
    InputTextArea
  },
  props: {
    items: {
      required: true,
      type: Object | Array
    },
    activeItem: {
      required: false,
      type: Number
    },
    parentList: {
      required: true,
      type: Object | Array
    }
  },
  methods: {
    createRootCategory() {
      this.$emit("handleSetRootCategoryData");
    },
    createSubCategory() {
      this.$emit("handleSetSubCategoryData",this.activeItem);
    },
    isActive: function(menuItem) {
      return this.activeItem == menuItem;
    },
    addParent(ref) {
      this.parentList.push(ref);
    },
    deleteParent(ref) {
      var index = this.parentList.indexOf(ref);
      if (index !== -1) this.parentList.splice(index, 1);
    },
    getCategoryData(id,parentid) {
      this.$emit("handleGetCategoryData", id, parentid);
    }
  }
};
</script>

<style scoped>
.pl-lv2 {
  padding-top: 15px;
  color: #0d1730;
  font-size: 16px;
}

.pl-lv2 span {
  cursor: pointer;
}

.pl-lv3 span {
  margin-top: 10px;
  margin-bottom: 10px;
  color: #0d1730;
  font-size: 16px;
  cursor: pointer;
}

.pl-lv3-box,
.pl-lv3-box .menuactive {
  padding-left: 10% !important;
}

.pl-lv4-box,
.pl-lv4-box .menuactive {
  padding-left: 20% !important;
}

.btn-cat {
  width: 100%;
}

.menuactive {
  font-weight: bold;
  background-color: #321fdb;
  padding: 3px 0;
  color: #fff;
}

.menuactive span {
  color: #fff;
}

.circle {
  width: 5px;
}

.view-txt {
  position: absolute;
  right: 0;
  top: 0;
  text-decoration: underline;
  color: #707070;
  z-index: 1;
}
</style>