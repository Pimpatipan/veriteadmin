<template>
  <div>
    <form class="form-box">
      <b-container class="container-box">
        <b-row class="no-gutters">
          <b-col>
            <h1 class="font-weight-bold text-uppercase">Product Details</h1>
          </b-col>
        </b-row>

        <b-tabs class="mt-2 product-tabs">
          <b-tab title="Product Details" active>
            <ProductDetailsSection />
          </b-tab>
          <b-tab title="Thumbnail">
            <ProductThumbnailSection />
          </b-tab>
          <b-tab title="Advance Pricing">
            <ProductAdvancePricingSection />
          </b-tab>
          <b-tab title="Stock">
            <ProductStock />
          </b-tab>
          <b-tab title="Question">
            <ProductQuestionSection />
          </b-tab>
          <b-tab title="Expert Review">
            <ProductExpertReviewSection />
          </b-tab>
          <b-tab title="User Review">
            <ProductUserReviewSection />
          </b-tab>
        </b-tabs>
      </b-container>
    </form>
  </div>
</template>

<script>
import ProductDetailsSection from "./components/ProductDetailsSection";
import ProductThumbnailSection from "./components/ProductThumbnailSection";
import ProductAdvancePricingSection from "./components/ProductAdvancePricingSection";
import ProductStock from "./components/ProductStockSection";
import ProductQuestionSection from "./components/ProductQuestionSection";
import ProductExpertReviewSection from "./components/ProductExpertReviewSection";
import ProductUserReviewSection from "./components/ProductUserReviewSection";

export default {
  name: "ProductDetails",
  components: {
    ProductDetailsSection,
    ProductThumbnailSection,
    ProductAdvancePricingSection,
    ProductStock,
    ProductQuestionSection,
    ProductExpertReviewSection,
    ProductUserReviewSection
  }
};
</script>