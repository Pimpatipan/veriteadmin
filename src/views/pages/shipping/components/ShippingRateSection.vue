<template>
  <div>
    <div class="text-right mt-3">
      <b-button class="btn-main mb-3" @click="addShippingRate">Add</b-button>
    </div>

    <div>
      <b-table
        striped
        responsive
        hover
        :items="items"
        :fields="fields"
        :busy="isBusy"
        show-empty
        empty-text="No matching records found"
      >
        <template v-slot:cell(minimum)="data">
          <div>
            <p class="m-0">{{ data.item.minimum | numeral('0,0.00') }}</p>
          </div>
        </template>
        <template v-slot:cell(cost)="data">
          <div>
            <p class="m-0">{{ data.item.cost | numeral('0,0.00') }}</p>
          </div>
        </template>
        <template v-slot:cell(id)="data">
          <div class="d-flex justify-content-center">
            <b-button
              variant="link"
              class="text-warning px-1 py-0"
              @click="editShippingRate(data.item.id)"
            >
              <font-awesome-icon icon="pencil-alt" title="Edit" />
            </b-button>
            <b-button
              variant="link"
              class="text-danger px-1 py-0"
              @click="deleteData(data.item.id)"
            >
              <font-awesome-icon icon="trash-alt" title="Delete" />
            </b-button>
          </div>
        </template>
        <template v-slot:table-busy>
          <div class="text-center text-black my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong class="ml-2">Loading...</strong>
          </div>
        </template>
      </b-table>
    </div>
    <b-row>
      <b-col class="form-inline justify-content-center justify-content-md-between">
        <b-pagination
          v-model="filter.pageNo"
          :total-rows="rows"
          :per-page="filter.perPage"
          class="m-md-0"
          @change="pagination"
        ></b-pagination>
        <b-form-select
          @change="hanndleChangePerpage"
          v-model="filter.perPage"
          :options="pageOptions"
        ></b-form-select>
      </b-col>
    </b-row>

    <b-modal
      id="addShippingRate"
      ref="addShippingRate"
      hide-header
      hide-footer
      no-close-on-backdrop
      centered
      body-class="p-4"
    >
      <div class="modal-header border-0 px-0 pt-0">
        <h3 class="font-weight-bold">Add Shipping Rate</h3>
        <button
          type="button"
          aria-label="Close"
          class="close"
          @click="$bvModal.hide('addShippingRate')"
        >×</button>
      </div>
      <form class="form-box">
        <div>
          <b-container class="p-0">
            <b-row>
              <b-col>
                <InputText
                  textFloat="Minimum Price (Price/Weight)"
                  placeholder="Minimum Price"
                  type="text"
                  name="minprice"
                  :isValidate="$v.modalData.minimum.$error"
                  :v="$v.modalData.minimum"
                  v-model="modalData.minimum"
                />

                <InputText
                  textFloat="Shipping Cost"
                  placeholder="Shipping Cost"
                  type="text"
                  name="shippingcost"
                  :isValidate="$v.modalData.cost.$error"
                  :v="$v.modalData.cost"
                  v-model="modalData.cost"
                />
              </b-col>
            </b-row>
          </b-container>
        </div>
        <div class="text-center mt-3">
          <b-button
            class="btn btn-main"
            type="button"
            :disabled="isDisable"
            @click="saveShippingRate"
          >Submit</b-button>
        </div>
      </form>
    </b-modal>
    <b-modal
      id="modalFail"
      ref="modalFail"
      hide-header
      hide-footer
      no-close-on-backdrop
      centered
      body-class="p-4"
    >
      <div class="modal-header border-0 px-0 pt-0">
        <button type="button" aria-label="Close" class="close" @click="$bvModal.hide('modalFail')">×</button>
      </div>
      <div>
        <b-container class="p-0">
          <b-row>
            <b-col>
              <div class="text-center">
                <img src="/img/icon-unsuccess.png" alt="fail" class="mb-3" />
                <h1 class="text-msg mt-3 font-weight-bold">Please create shipping before proceeding</h1>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </b-modal>
  </div>
</template>

<script>
import InputText from "@/components/inputs/InputText";
import { required } from "vuelidate/lib/validators";

export default {
  name: "ShippingRateDetails",
  components: {
    InputText
  },
  data() {
    return {
      id: this.$route.params.id,
      items: [],
      isDisable: false,
      fields: [
        {
          key: "minimum",
          label: "Minimum Price (Grand Total)",
          class: "w-100px"
        },
        {
          key: "cost",
          label: "Shipping Cost"
        },
        {
          key: "id",
          label: "Action"
        }
      ],
      filter: {
        perPage: 10,
        pageNo: 1
      },
      pageOptions: [
        { value: 10, text: "10 / page" },
        { value: 30, text: "30 / page" },
        { value: 50, text: "50 / page" },
        { value: 100, text: "100 / page" }
      ],
      isBusy: false,
      rows: 0,
      modalData: {
        id: 0,
        shippingTypeId: 0,
        minimum: 0,
        cost: 0
      }
    };
  },
  validations: {
    modalData: {
      minimum: { required },
      cost: { required }
    }
  },
  created: async function() {
    await this.getDatas();
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
    pagination(Page) {
      this.filter.pageNo = Page;
      this.getDatas();
    },
    addShippingRate() {
      if (this.id == 0) {
        this.$refs["modalFail"].show();
        return;
      }

      this.modalData.id = 0;
      this.modalData.shippingTypeId = 0;
      this.modalData.minimum = 0;
      this.modalData.cost = 0;
      this.$refs["addShippingRate"].show();
    },
    editShippingRate: async function(id) {
      let data = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/shipping/shippingRate/${id}`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        this.modalData.id = data.detail.id;
        this.modalData.shippingTypeId = data.detail.shippingTypeId;
        this.modalData.minimum = data.detail.minimum;
        this.modalData.cost = data.detail.cost;
      }

      this.$refs["addShippingRate"].show();
    },
    saveShippingRate: async function() {
      this.$v.modalData.$touch();
      if (this.$v.modalData.$error) {
        return;
      }
      this.modalData.shippingTypeId = this.id;

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/shipping/saveShippingRate`,
        null,
        this.$headers,
        this.modalData
      );

      if (data.result == 1) {
        this.getDatas();
      }

      this.$refs["addShippingRate"].hide();
    },
    hanndleChangePerpage(value) {
      this.filter.pageNo = 1;
      this.filter.perPage = value;
      this.getDatas();
    },
    getDatas: async function() {
      this.isBusy = true;

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/shipping/shippingRateList/${this.id}`,
        null,
        this.$headers,
        this.filter
      );

      if (data.result == 1) {
        this.items = data.detail.dataList;
        this.rows = data.detail.count;
        this.isBusy = false;
      }
    },
    deleteData: async function(id) {
      if (confirm("Are you sure you want to delete this data?") == true) {
        let data = await this.$callApi(
          "delete",
          `${this.$baseUrl}/api/shipping/removeShippingRate/${id}`,
          null,
          this.$headers,
          null
        );

        if (data.result == 1) {
          this.getDatas();
        }
      }
    }
  }
};
</script>