<template>
  <div>
    <b-container class="container-box">
      <b-row class="no-gutters">
        <b-col>
          <h1 class="font-weight-bold text-uppercase">Shipping Details</h1>
        </b-col>
      </b-row>

      <b-tabs class="mt-2 product-tabs" >
        <b-tab title="Shipping Information" active>
          <b-row class="no-gutters bg-white-border">
            <b-col class="px-4 px-sm-5 py-4">
              <ShippingInfo />
            </b-col>
          </b-row>
        </b-tab>
        <b-tab title="Shipping Rate">
          <b-row class="no-gutters bg-white-border">
            <b-col class="px-4 px-sm-5 py-4">
              <ShippingRate />
            </b-col>
          </b-row>
        </b-tab>
      </b-tabs>
    </b-container>
  </div>
</template>

<script>
import ShippingInfo from "./components/ShippingInfoSection";
import ShippingRate from "./components/ShippingRateSection";

export default {
  name: "ShippingDetails",
  components: {
    ShippingInfo,
    ShippingRate
  }
};
</script>