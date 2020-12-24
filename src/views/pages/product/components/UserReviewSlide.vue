<template>
  <div>
    <div :class="[{ 'px-3' : images.length>3 }, 'panel-images']">
      <button
        type="button"
        class="btn-slick-custom prev"
        v-if="images.length > 3 && currentSlide > 0"
      >
        <font-awesome-icon icon="chevron-left" @click="prev" />
      </button>
      <button
        type="button"
        class="btn-slick-custom next"
        v-if="images.length > 3 && currentSlide < images.length-1"
      >
        <font-awesome-icon icon="chevron-right" @click="next" />
      </button>
      <slick ref="slick" v-bind:options="slickOptions" v-if="images.length">
        <div v-for="(item, key) in images" v-bind:key="key" class="meow">
          <div
            v-bind:class="[ {active: currentSlide == key}, 'product-img' ]"
            @click="slickGoTo(key)"
            v-bind:style="{ backgroundImage: 'url(' + item.path + ')' }"
          ></div>
        </div>
      </slick>
    </div>
  </div>
</template>

<script>
import Slick from "vue-slick";

export default {
  name: "image-product",
  components: {
    Slick
  },
  props: {
    images: {
      required: true,
      type: Array
    }
  },
  data() {
    return {
      slickOptions: {
        arrows: false,
        infinite: false,
        slidesToShow: 4,
        dots: false,
        initialSlide: 0,
        draggable: false,
        responsive: [
          {
            breakpoint: 768,
            settings: {
              //slidesToShow: 4
              // centerMode: true,
              // variableWidth: true
            }
          }
        ]
      },
      image: this.images[0].imageUrl,
      currentSlide: 0
    };
  },
  methods: {
    next() {
      this.$refs.slick.next();
      this.currentSlide++;
      this.setMainImage(this.currentSlide);
    },
    prev() {
      this.$refs.slick.prev();
      this.currentSlide--;
      this.setMainImage(this.currentSlide);
    },
    reInit() {
      this.$nextTick(() => {
        this.$refs.slick.reSlick();
      });
    },
    slickGoTo(index) {
      this.$refs.slick.goTo(index);
      this.currentSlide = index;
      this.setMainImage(this.currentSlide);
    },
    setMainImage(index) {
      this.image = this.images[index].imageUrl;
      // this.reInit();
    }
  },
  created: function() {
    setTimeout(() => {
      this.reInit();
    }, 1000);
  }
};
</script>

<style scoped>
.product-img-main,
.product-img {
  width: 100%;
  padding-bottom: 100%;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  /* padding: 35px;
  background-origin: content-box, padding-box; */
}
.product-img-main {
  padding-bottom: 100%;
}
.product-img {
  border: 2px dashed grey;
  cursor: pointer;
  /* opacity: 0.3; */
}
.meow {
  padding: 2%;
}
.panel-product-img-main {
  width: 100%;
  padding-bottom: 0%;
}
.panel-images {
  margin-top: 25px;
  position: relative;
}
.btn-slick-custom {
  padding: 0 !important;
  position: absolute;
  top: 30%;
  background-color: unset !important;
  border: 0 !important;
  color: #c9b67e !important;
  font-size: 20px;
  cursor: pointer !important;
  z-index: 10;
}
.btn-slick-custom.prev {
  left: 0px;
}
.btn-slick-custom.next {
  right: 0px;
}
.product-img.active {
  opacity: 1;
}
::v-deep .slick-track {
  margin-left: 0;
}
</style>
