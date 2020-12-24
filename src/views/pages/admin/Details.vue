<template>
  <div>
    <form class="form-box">
      <b-container class="container-box">
        <b-row class="no-gutters">
          <b-col>
            <h1 class="font-weight-bold text-uppercase">Admin Details</h1>
          </b-col>
        </b-row>
        <b-row class="no-gutters bg-white-border mt-4 position-relative">
          <b-col class="px-4 px-sm-5 py-4 vh-100" v-if="isLoadingData">
            <img src="/img/loading.svg" class="loading" alt="loading" />
          </b-col>
          <b-col class="px-4 px-sm-5 py-4" v-else>
            <b-row>
              <b-col md="6">
                <InputText
                  textFloat="Name"
                  placeholder="Name"
                  type="text"
                  name="name"
                  isRequired
                  v-model="admin.userProfile.firstname"
                  :v="$v.admin.userProfile.firstname"
                  :isValidate="$v.admin.userProfile.firstname.$error"
                />
              </b-col>
              <b-col md="6">
                <InputText
                  textFloat="Lastname"
                  placeholder="Lastname"
                  type="text"
                  name="lastname"
                  isRequired
                  v-model="admin.userProfile.lastname"
                  :v="$v.admin.userProfile.lastname"
                  :isValidate="$v.admin.userProfile.lastname.$error"
                />
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <span :class="[ 'verified-txt', verifiedColor ]">{{verifiedTxt}}</span>
                <InputText
                  textFloat="Email"
                  placeholder="Name"
                  type="text"
                  name="email"
                  isRequired
                  v-model="admin.userProfile.email"
                  :v="$v.admin.userProfile.email"
                  :isValidate="$v.admin.userProfile.email.$error"
                />
              </b-col>
              <b-col md="6">
                <InputText
                  textFloat="Telephone No."
                  placeholder="Telephone No."
                  type="text"
                  name="telno"
                  v-model="admin.userProfile.telephone"
                  @onKeypress="isNumber($event)"
                />
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <InputText
                  textFloat="Password"
                  placeholder="Password"
                  type="password"
                  name="name"
                  isRequired
                  v-model="admin.userProfile.password"
                  :isValidate="$v.admin.userProfile.password.$error"
                  :v="$v.admin.userProfile.password"
                />
              </b-col>
              <b-col md="6">
                <InputText
                  textFloat="Confirm Password"
                  placeholder="Confirm Password"
                  type="password"
                  name="lastname"
                  isRequired
                  v-model="admin.userProfile.confirmPassword"
                  :isValidate="$v.admin.userProfile.confirmPassword.$error"
                  :v="$v.admin.userProfile.confirmPassword"
                />
              </b-col>
            </b-row>

            <b-row>
              <b-col md="6">
                <label class="font-weight-bold main-label">
                  Display Status
                  <span class="text-danger">*</span>
                </label>
                <div>
                  <b-form-checkbox
                    switch
                    v-model="admin.userProfile.enabled"
                    class="radio-active"
                    size="lg"
                  >
                    <span
                      class="ml-2 main-label"
                    >{{admin.userProfile.enabled ? 'Active' : 'Inactive' }}</span>
                  </b-form-checkbox>
                </div>
              </b-col>
            </b-row>

            <b-row class="mt-3">
              <b-col>
                <label class="font-weight-bold main-label mb-2">Permission</label>
                <span
                  class="text-secondary text-underline pl-3 pointer"
                  @click="showPermission = true"
                  v-if="!showPermission"
                >Edit</span>
                <div>
                  <div v-if="isAll">All</div>
                  <div v-else>
                    <p v-for="(item, key) in newMenus[0]" :key="key" class="mb-2 font-weight-bold">
                      {{item.name}}
                      <template v-if="item.subMenu.length != 0">
                        <span class="nobreak font-weight-normal">
                          (
                          <span>{{comma(item.subMenu)}}</span>
                          )
                        </span>
                      </template>
                    </p>
                  </div>

                  <p
                    class="text-danger"
                    v-if="$v.admin.permission.$error"
                  >Please select at least one permission</p>
                </div>
              </b-col>
            </b-row>

            <div v-if="showPermission">
              <HeaderLine text="Permission" class="mt-4" />

              <div class="store-type-box mb-4">
                <b-row>
                  <b-col md="6">
                    <div>
                      <div class="parent-cat">
                        <b-form-checkbox
                          size="lg"
                          class="mb-1 mt-2"
                          v-model="isAll"
                          @change="handleSelectAll"
                        >
                          <span>All</span>
                        </b-form-checkbox>
                      </div>
                      <div>
                        <template v-for="(item2, key2) in menus">
                          <div :key="`lv2-${key2}`">
                            <div class="text-left my-3">
                              <div class="pl-lv2">
                                <div class="parent-cat">
                                  <b-form-checkbox
                                    size="lg"
                                    :value="item2.id"
                                    v-model="admin.permission"
                                    @change="addSubMenuList(item2.subMenu,item2.id,key2)"
                                  >
                                    <span>{{item2.name}}</span>
                                    <span class="text-secondary pl-2">{{item2.description}}</span>
                                  </b-form-checkbox>
                                </div>
                              </div>
                            </div>
                          </div>
                          <template v-for="(item3, key3) in item2.subMenu">
                            <div :key="`lv2-${key2}-lv3-${key3}`">
                              <div class="text-left my-3 pl-lv3">
                                <div class="ml-4">
                                  <div class="parent-cat">
                                    <b-form-checkbox
                                      size="lg"
                                      class="mt-1 ml-1"
                                      v-bind:key="key3"
                                      :value="item3.id"
                                      v-model="admin.permission"
                                      @change="checkSubMenuChecked(key2,item3.id,item2.id,key3)"
                                    >
                                      <span>{{item3.name}}</span>
                                      <span class="text-secondary pl-2">{{item3.description}}</span>
                                    </b-form-checkbox>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </template>
                        </template>
                      </div>
                    </div>
                    <!-- <p
                v-if="$v.admin.permission.$error"
                class="text-danger"
                    >Please select at least one category</p>-->
                  </b-col>
                </b-row>
              </div>

              <div>
                <button
                  type="button"
                  class="btn btn-success btn-details-set text-uppercase"
                  @click="showPermission = false"
                >Save</button>
              </div>
            </div>

            <b-row class="mt-5">
              <b-col md="6">
                <b-button href="/admin" class="btn-details-set" :disabled="isDisable">CANCEL</b-button>
              </b-col>
              <b-col md="6" class="text-sm-right">
                <button
                  type="button"
                  class="btn btn-success btn-details-set ml-md-2 text-uppercase"
                  @click="checkForm(0)"
                  :disabled="isDisable"
                >Save</button>
                <button
                  type="button"
                  class="btn btn-success btn-details-set ml-md-2 text-uppercase"
                  @click="checkForm(1)"
                  :disabled="isDisable"
                >Save & Exit</button>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
    </form>
    <ModalAlert
      v-if="modalAlertShows"
      :msg="msgModals"
      :img="imgModals"
      :isOpen="modalAlertShows"
      @close="modalAlertShows = false"
      @closeModal="handleCloseModal"
      :isSuccess="isSuccess"
    />
  </div>
</template>

<script>
import InputText from "@/components/inputs/InputText";
import {
  required,
  numeric,
  minValue,
  requiredIf,
  minLength,
  sameAs
} from "vuelidate/lib/validators";
import ModalAlert from "@/components/ModalAlert";
import Vue from "vue";
import HeaderLine from "@/components/HeaderLine";

export default {
  name: "AdminDetails",
  components: {
    InputText,
    ModalAlert,
    HeaderLine
  },
  data() {
    return {
      id: this.$route.params.id,
      existId: "",
      items: [],
      menus: [],
      newMenus: [],
      originalMenusName: [],
      menusOrigianl: [],
      parentList: [],
      msgModals: null,
      imgModals: null,
      modalAlertShows: false,
      isLoadingData: false,
      isSuccess: false,
      isError: false,
      isReset: false,
      isEdit: false,
      isAll: false,
      showPermission: false,
      verifiedColor: "",
      verifiedTxt: "",
      rows: 0,
      indexMain: 0,
      indexSub: 0,
      flag: 0,
      admin: {
        userProfile: {
          userGUID: null,
          firstname: null,
          lastname: null,
          email: null,
          telephone: null,
          isVerified: false,
          password: null,
          confirmPassword: null,
          enabled: false
        },
        permission: [],
        nameMenu: []
      },
      isDisable: false,
      isBusy: false,
      pageOptions: [
        { value: 10, text: "10 / page" },
        { value: 30, text: "30 / page" },
        { value: 50, text: "50 / page" },
        { value: 100, text: "100 / page" }
      ]
    };
  },
  validations: {
    admin: {
      userProfile: {
        firstname: { required },
        lastname: { required },
        email: { required },
        password: {
          required: requiredIf(function() {
            return this.id == 0;
          }),
          minLength: minLength(6)
        },
        confirmPassword: {
          required: requiredIf(function() {
            return this.id == 0;
          }),
          minLength: minLength(6),
          sameAsPassword: sameAs("password")
        }
      },
      permission: {
          required: requiredIf(function() {

            return this.admin.permission.length == 0;
          })
        }
    }
  },
  mounted: async function() {
    await this.getData();
    await this.getListMenu();
  },
  methods: {
     isNumber: function(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    comma(array) {
      let str = "";
      for (let i = 0; i < array.length; i++) {
        str += array[i].name + " , ";
      }
      str = str.replace(/,\s*$/, "");
      return str;
    },
    addParent(ref) {
      this.parentList.push(ref);
    },
    deleteParent(ref) {
      var index = this.parentList.indexOf(ref);
      if (index !== -1) this.parentList.splice(index, 1);
    },
    handleSelectAll(value) {
      if (value == true) {
        this.admin.permission = this.menusOrigianl;
        this.newMenus[0].splice(0, this.newMenus[0].length);
        for (const data of this.originalMenusName[0]) {
          const mainMenuClone = JSON.parse(JSON.stringify(data));
          this.newMenus[0].push(mainMenuClone);
        }
        this.isAll = true;
      } else {
        this.newMenus[0].splice(0, this.newMenus[0].length);
        this.admin.permission = [];
      }
    },
    addSubMenuList: async function(sublist, id, index) {
      this.indexMain = index;
      var indexRemove, indexRemoveName;
      let menus = this.menus;

      this.$nextTick(async index => {
        if (this.admin.permission.indexOf(id) != -1) {
          for (const data of sublist) {
            if (this.admin.permission.indexOf(data.id) == -1) {
              this.admin.permission.push(data.id);
            }
          }

          var main = menus.find(x => x.id == id);
          const mainMenuClone = JSON.parse(JSON.stringify(main));

          this.newMenus[0].push(mainMenuClone);
        } else {
          for (const data of sublist) {
            indexRemove = this.admin.permission.indexOf(data.id);
            this.admin.permission.splice(indexRemove, 1);
          }

          var indexMain = this.newMenus[0]
            .map(function(x) {
              return x.id;
            })
            .indexOf(id);

          this.newMenus[0].splice(indexMain, 1);
        }

        if (this.admin.permission.length == this.menusOrigianl.length) {
          this.isAll = true;
        } else {
          this.isAll = false;
        }
      });
    },
    checkSubMenuChecked: function(index, subId, mainId, indexSub) {
      let arrayFlag = false;
      let sublistMenu = this.menus[index].subMenu;
      let menus = this.menus;

      Vue.nextTick(async () => {
        if (this.admin.permission.indexOf(mainId) == -1) {
          this.admin.permission.push(mainId);
        }

        if (this.admin.permission.indexOf(subId) == -1) {
          var indexmain = this.admin.permission.indexOf(mainId);
          //this.admin.permission.splice(indexmain,1);
          var indexMainInNewMenu = this.newMenus[0]
            .map(function(x) {
              return x.id;
            })
            .indexOf(mainId);

          var indexSubmenuInNewMenu = this.newMenus[0][
            indexMainInNewMenu
          ].subMenu
            .map(function(x) {
              return x.id;
            })
            .indexOf(subId);

          this.newMenus[0][indexMainInNewMenu].subMenu.splice(
            indexSubmenuInNewMenu,
            1
          );
        } else {
          if (this.newMenus[0].indexOf(index) == -1) {
            if (this.newMenus[0].find(x => x.id == mainId) == null) {
              var main = menus.find(x => x.id == mainId);
              const clone = JSON.parse(JSON.stringify(main));

              this.newMenus[0].push(clone);

              var indexMainInNewMenu = this.newMenus[0]
                .map(function(x) {
                  return x.id;
                })
                .indexOf(mainId);
              this.newMenus[0][indexMainInNewMenu].subMenu = [];
            }
          }

          var main = menus.find(x => x.id == mainId);
          var submenu = main.subMenu.find(x => x.id == subId);
          var indexMainInNewMenu = this.newMenus[0]
            .map(function(x) {
              return x.id;
            })
            .indexOf(mainId);
          if (
            this.newMenus[0][indexMainInNewMenu].subMenu.find(
              x => x.id == subId
            ) == null
          ) {
            this.newMenus[0][indexMainInNewMenu].subMenu.push(submenu);
          }
        }

        for (let j = 0; j < this.admin.permission.length; j++) {
          for (let i = 0; i < sublistMenu.length; i++) {
            if (this.admin.permission[j] == sublistMenu[i].id) {
              arrayFlag = true;
            }
          }
        }
        if (!arrayFlag) {
          var index = this.admin.permission.indexOf(mainId);
          this.admin.permission.splice(index, mainId);

          // ถ้าไม่มี submenu ให้ลบ mainmenu ทิ้งในส่วน display
          var indexMainInNewMenu = this.newMenus[0]
            .map(function(x) {
              return x.id;
            })
            .indexOf(mainId);
          this.newMenus[0].splice(indexMainInNewMenu, 1);
        }
        var listSubmenuId = sublistMenu.map(a => a.id);
        // let IsSubSet = listSubmenuId.every(val =>
        //   this.admin.permission.includes(val)
        // );
        // if (IsSubSet) {
        //   this.admin.permission.push(mainId);
        // }

        if (this.admin.permission.length == this.menusOrigianl.length) {
          this.isAll = true;
        } else {
          this.isAll = false;
        }
      });
    },
    getListMenu: async function() {
      let data = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/admin/menuHierarchy`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        var a = [];
        this.menus = data.detail.mainMenu;
        this.originalMenusName.push(data.detail.mainMenu);

        for (const data of this.menus) {
          this.menusOrigianl.push(data.id);
          if (data.subMenu.length != 0) {
            for (const sub of data.subMenu) {
              this.menusOrigianl.push(sub.id);
            }
          }
        }

        if (this.admin.permission.length == this.menusOrigianl.length)
          this.isAll = true;
        else this.isAll = false;
      }
    },
    getData: async function() {
      this.isLoadingData = true;
      let data = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/admin/${this.id}`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        this.admin = data.detail;
        this.showPermission = false;
        this.newMenus.push(data.detail.nameMenu);

        this.isLoadingData = false;
        this.$v.admin.userProfile.$reset();

        if (this.admin.userProfile.isVerified == true) {
          this.verifiedColor = "text-success";
          this.verifiedTxt = "Verified";
        } else {
          this.verifiedColor = "text-danger";
          this.verifiedTxt = "Not Verified";
        }
      }
      //}
    },
    checkForm: async function(flag) {
      this.$v.admin.$touch();

      if (this.$v.admin.$error) {
        return;
      }

      this.modalAlertShows = false;
      this.flag = flag;

      this.submit();
    },
    submit: async function() {
      this.isDisable = true;

      if (this.id == 0) {
        this.admin.userProfile.userGUID == null;
      } 

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/admin/save`,
        null,
        this.$headers,
        this.admin
      );

      this.modalAlertShows = true;
      if (data.result == 1) {
        this.imgModals = "/img/icon-check-green.png";
        this.msgModals = data.message;
        this.isSuccess = true;
        this.existId = data.detail.id;
      } else {
        this.imgModals = "/img/icon-unsuccess.png";
        this.msgModals = data.detail[0];
        this.isSuccess = false;
      }

      this.isDisable = false;
    },
    handleCloseModal: function() {
      if (this.flag == 1) {
        window.location.href = "/admin";
      } else {
        if (this.id != 0) {
          this.getData();
        } else {
          this.admin.userProfile.userGUID = this.existId;
          this.id = this.existId;
          this.$router.push({ path: `/admin/details/${this.existId}` })
        }
      }
    }
  }
};
</script>

<style scoped>
.verified-txt {
  position: absolute;
  right: 15px;
  top: 3px;
}

.store-type-box {
  /* border: 1px solid #bcbcbc; */
  height: 300px;
  overflow-y: auto;
  overflow-x: hidden;
}

.parent-cat {
  display: inline-block;
  position: relative;
  top: 5px;
  margin-left: 10px;
}
</style>