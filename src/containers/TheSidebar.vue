<template>
  <CSidebar fixed :minimize="minimize" :show.sync="show">
    <CSidebarBrand
      :imgFull="{ width: 118,  alt: 'Logo', src: '/img/brand/logo-white.png'}"
      :imgMinimized="{ width: 50, height: 50, alt: 'Logo', src: '/img/brand/logo-mb.png'}"
    />
    <!-- <SidebarHeader text="Web Content" :class="[ minimize ? 'd-none' : 'd-block' ]"/> -->
    <CRenderFunction flat :content-to-render="nav" />
    <CSidebarMinimizer class="d-md-down-none" @click.native="minimize = !minimize" />
  </CSidebar>
</template>

<script>
import nav from "./_nav";
import SidebarHeader from "@/components/SidebarHeader.vue";

export default {
  name: "TheSidebar",
  components: {
    SidebarHeader
  },
  data() {
    return {
      minimize: false,
      nav,
      show: "responsive"
    };
  },
  
  mounted: async function() {
    this.$root.$on("toggle-sidebar", () => {
      const sidebarOpened = this.show === true || this.show === "responsive";
      this.show = sidebarOpened ? false : "responsive";
    });
    this.$root.$on("toggle-sidebar-mobile", () => {
      const sidebarClosed = this.show === "responsive" || this.show === false;
      this.show = sidebarClosed ? true : "responsive";
    });

    await this.getPermissionList();
  },
  methods: {
    getPermissionList: async function() {
      let data = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/permission`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        this.nav[0]._children = await this.nav[0]._children.filter(x => {
          if (data.detail.permission.indexOf(x.id) != -1) {
            if (x.items) {
              x.items = x.items.filter(
                y => data.detail.permission.indexOf(y.id) != -1
              );
            }
            return x;
          }
        });
      }
    }
  }
};
</script>

