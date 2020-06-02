<template>
  <CContainer class="min-vh-100">
    <CRow class="w-100 no-gutters">
      <CCol sm="6" class="text-center text-sm-left">
        <h1 class="mr-sm-4">PRESS MANAGEMENT</h1>
      </CCol>
      <CCol sm="6" class="text-center text-sm-right"></CCol>
    </CRow>
    <b-row>
      <b-col class="mt-4">
        <TextEditor
          textFloat="Description"
          :rows="30"
          :img="imageLogoLang"
          placeholder="Type something..."
          isRequired
        />
      </b-col>
    </b-row>
  </CContainer>
</template>

<script>
import TextEditor from "@/components/inputs/TextEditor";

export default {
  name: "Index",
  components: {
    TextEditor
  },
  data() {
    return {
      fields: [
        {
          key: "code",
          label: "Thumbnail"
        },
        {
          key: "name",
          label: "Press Name"
        },
        {
          key: "shortdesc",
          label: "Short Description"
        },
        {
          key: "branchTypeName",
          label: "Update Date"
        },
        {
          key: "sectionName",
          label: "Status"
        },
        {
          key: "statusString",
          label: "Action"
        }
      ],
      items: [],
      isBusy: false,
      rows: 0,
      filter: {
        Status: [],
        BranchTypeId: [],
        SectionId: [],
        Page: 1,
        Length: 10,
        Search: ""
      },
      pageOptions: [
        { value: 10, text: "10 / page" },
        { value: 30, text: "30 / page" },
        { value: 50, text: "50 / page" },
        { value: 100, text: "100 / page" }
      ]
    };
  }
};
</script>