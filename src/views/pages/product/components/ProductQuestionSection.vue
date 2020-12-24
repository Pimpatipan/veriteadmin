<template>
  <div>
    <form action>
      <b-row class="no-gutters bg-white-border">
        <b-col class="px-4 px-sm-5 py-4 mt-3">
          <b-row>
            <b-col sm="6"></b-col>
            <b-col sm="6" class="text-sm-right">
              <b-button v-b-toggle.sidebar-1 class="btn-filter">
                <font-awesome-icon
                  icon="filter"
                  title="filter-btn"
                  class="text-white mr-0 mr-sm-1"
                />
                <span class="d-none d-sm-inline">FILTER</span>
              </b-button>
            </b-col>
          </b-row>
          <b-sidebar
            id="sidebar-1"
            title="FILTER"
            backdrop
            shadow
            backdrop-variant="dark"
            right
            ref="filterSidebar"
          >
            <div class="px-3 py-2">
              <div>
                <p class="font-weight-bold mt-3 mb-2">Verify Status</p>
              </div>

              <div class="form-check mb-2">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value
                  id="all"
                  :checked="checkAll"
                  @click="checkAllVerifyStatus()"
                  v-model="selectAllVerifyCb"
                />
                <label class="form-check-label" for="all">All</label>
              </div>
              <div class="row">
                <div class="col-6">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      v-model="filterQuestion.verifyStatus"
                      type="checkbox"
                      value="1"
                      id="verify1"
                      @change="checkVerifyLength"
                    />
                    <label class="form-check-label" for="verify1">Verified</label>
                  </div>
                </div>
                <div class="col-6">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      v-model="filterQuestion.verifyStatus"
                      type="checkbox"
                      value="0"
                      id="verify2"
                      @change="checkVerifyLength"
                    />
                    <label class="form-check-label" for="verify2">Not Verified</label>
                  </div>
                </div>
              </div>

              <div>
                <p class="font-weight-bold mt-3 mb-2">Answer Status</p>
              </div>

              <div class="form-check mb-2">
                <input
                  class="form-check-input"
                  type="checkbox"
                  value
                  id="allAnswer"
                  :checked="checkAll"
                  @click="checkAllAnswerStatus()"
                  v-model="selectAllAnswerCb"
                />
                <label class="form-check-label" for="allAnswer">All</label>
              </div>
              <div class="row">
                <div class="col-6">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      v-model="filterQuestion.answerStatus"
                      type="checkbox"
                      value="1"
                      id="ans1"
                      @change="checkAnswerLength"
                    />
                    <label class="form-check-label" for="ans1">Answer</label>
                  </div>
                </div>
                <div class="col-6">
                  <div class="form-check">
                    <input
                      class="form-check-input"
                      v-model="filterQuestion.answerStatus"
                      type="checkbox"
                      value="0"
                      id="ans2"
                      @change="checkAnswerLength"
                    />
                    <label class="form-check-label" for="ans2">Wait for answer</label>
                  </div>
                </div>
              </div>

              <b-row class="no-gutters mt-3">
                <b-col>
                  <div class="mb-3">
                    <p class="font-weight-bold mb-2">Sort By</p>
                  </div>

                  <b-form-select
                    v-model="filterQuestion.sortByDateTime"
                    :options="optionsQuestion"
                    class="sortByDropdown"
                  ></b-form-select>
                </b-col>
              </b-row>

              <div class="text-center mt-5">
                <button
                  type="button"
                  class="btn bg-main-color text-white button"
                  @click="getQuestionDataByFilter()"
                >Submit</button>
              </div>
            </div>
          </b-sidebar>
          <div class="mt-4">
            <b-table
              striped
              responsive
              hover
              :items="questionitems"
              :fields="questionFields"
              :busy="isBusyQuestion"
              show-empty
              empty-text="No matching records found"
            >
              <template v-slot:cell(questionTime)="data">
                <span>{{ new Date(data.item.questionTime) | moment($formatDate) }}</span>
              </template>
              <template v-slot:cell(isVerify)="data">
                <div v-if="data.item.isVerify == true" class="text-success">Verified</div>
                <div v-else class="text-danger">Not Verified</div>
              </template>
              <template v-slot:cell(questionBy)="data">
                <div v-if="data.item.questionBy == ' '">-</div>
                <div v-else>{{data.item.questionBy}}</div>
              </template>
              <template v-slot:cell(isAnswer)="data">
                <div v-if="data.item.isAnswer == true" class="text-success">Answer</div>
                <div v-else class="text-warning">Wait for answer</div>
              </template>
              <template v-slot:cell(id)="data">
                <div class="d-flex justify-content-center">
                  <b-button
                    variant="link"
                    class="text-body text-underline"
                    @click="editQuestion(data.item.id)"
                  >View</b-button>
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
                v-model="filterQuestion.pageNo"
                :total-rows="rows"
                :per-page="filterQuestion.perPage"
                class="m-md-0"
                @change="paginationQuestion"
              ></b-pagination>
              <b-form-select
                @change="hanndleChangePerpageQuestion"
                v-model="filterQuestion.perPage"
                :options="pageOptions"
              ></b-form-select>
            </b-col>
          </b-row>

          <b-row class="mt-5">
            <b-col md="6">
              <b-button href="/product" class="btn-details-set">CANCEL</b-button>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </form>

    <b-modal
      id="questionModal"
      ref="questionModal"
      hide-header
      hide-footer
      no-close-on-backdrop
      centered
      body-class="p-4"
    >
      <div class="modal-header border-0 p-0">
        <button
          type="button"
          aria-label="Close"
          class="close"
          @click="$bvModal.hide('questionModal')"
        >×</button>
      </div>
      <div>
        <b-container class="p-0">
          <b-row>
            <b-col>
              <HeaderLine text="Question" />
              <p class="my-3 f-16">{{questionDetail.question}}</p>
              <InputTextArea
                class="mb-4"
                textFloat="Answer"
                placeholder="Answer"
                type="text"
                name="answer"
                isRequired
                v-model="answerVal"
              />

              <b-row>
                <b-col md="6">
                  <label class="font-weight-bold main-label f-14">
                    Verify Status
                    <span class="text-danger">*</span>
                  </label>
                  <div>
                    <b-form-checkbox
                      switch
                      v-model="questionDetail.isVerify"
                      class="radio-active"
                      size="lg"
                    >
                      <span
                        class="ml-2 main-label status-txt f-14"
                      >{{questionDetail.isVerify ? 'Verified' : 'Not Verified' }}</span>
                    </b-form-checkbox>
                  </div>
                </b-col>
                <b-col md="6"></b-col>
              </b-row>

              <div class="text-center mt-4">
                <b-button class="btn btn-main" :disabled="isDisable" @click="saveQuestion">Submit</b-button>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </b-modal>

    <ModalAlert
      v-if="modalAlertShow"
      :msg="msgModal"
      :img="imgModal"
      :isOpen="modalAlertShow"
      @close="modalAlertShow = false"
      @closeModal="handleCloseModal"
      :isSuccess="isSuccess"
    />
  </div>
</template>

<script>
import ModalAlert from "@/components/ModalAlert";
import * as moment from "moment/moment";
import HeaderLine from "@/components/HeaderLine";
import InputTextArea from "@/components/inputs/InputTextArea";

export default {
  name: "ProductQuestion",
  components: {
    ModalAlert,
    HeaderLine,
    InputTextArea
  },
  data() {
    return {
      id: this.$route.params.id,
      isDisable: false,
      isEdit: false,
      error: false,
      imgModal: null,
      msgModal: null,
      modalAlertShow: false,
      questionitems: [],
      answerVal: "",
      isBusyQuestion: false,
      isSuccess: false,
      checkAll: false,
      rows: 0,
      rowsQuestion: 0,
      selectAllVerifyCb: false,
      selectAllAnswerCb: false,
      pageOptions: [
        { value: 10, text: "10 / page" },
        { value: 30, text: "30 / page" },
        { value: 50, text: "50 / page" },
        { value: 100, text: "100 / page" }
      ],
      optionsQuestion: [
        { value: 0, text: "Oldest - Latest" },
        { value: 1, text: "Latest - Oldest" }
      ],
      sortByDefaultOptions: [
        { value: 0, text: "Please select an option" },
        { value: 1, text: "Sort Order" },
        { value: 2, text: "Created Time" }
      ],
      questionFields: [
        {
          key: "questionTime",
          label: "Date",
          class: "w-100px"
        },
        {
          key: "question",
          label: "Question",
          class: "w-200"
        },
        {
          key: "questionBy",
          label: "Question by",
          class: "w-100px"
        },
        {
          key: "isVerify",
          label: "Verify Status",
          class: "w-100px"
        },
        {
          key: "isAnswer",
          label: "Answer Status",
          class: "w-100px"
        },
        {
          key: "id",
          label: "Action"
        }
      ],
      filterQuestion: {
        perPage: 10,
        pageNo: 1,
        verifyStatus: [],
        answerStatus: [],
        sortByDateTime: 1
      },
      questionDetail: {
        id: 0,
        question: null,
        answer: null,
        questionBy: null,
        answerBy: null,
        questionTime: "0001-01-01T00:00:00",
        updatedTime: "0001-01-01T00:00:00",
        isVerify: false,
        isAnswer: false
      }
    };
  },
  created: async function() {
    if (this.id != 0) {
      await this.getQuestionData();
    }
  },
  methods: {
    moment: function() {
      return moment();
    },
    handleCloseModal: async function() {
      if (this.flag == 1) {
        window.location.href = "/product";
      } else {
        if (this.id > 0) {
          this.getQuestionData();
        } else {
          window.location.href = "/product";
        }
      }
    },
    getQuestionData: async function() {
      this.isBusyQuestion = true;
      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/product/questionList/${this.id}`,
        null,
        this.$headers,
        this.filterQuestion
      );

      if (data.result == 1) {
        this.questionitems = data.detail.dataList;
        this.rowsQuestion = data.detail.count;
        this.isBusyQuestion = false;
      }
    },
    editQuestion: async function(id) {
      let data = await this.$callApi(
        "get",
        `${this.$baseUrl}/api/product/question/${id}`,
        null,
        this.$headers,
        null
      );

      if (data.result == 1) {
        this.questionDetail = data.detail;
      }

      this.answerVal = this.questionDetail.answer;

      this.$refs["questionModal"].show();
    },
    saveQuestion: async function() {
      this.isDisable = true;
      let dataModal = {
        id: this.questionDetail.id,
        answer: this.answerVal,
        isVerify: this.questionDetail.isVerify,
        isAnswer: this.questionDetail.isAnswer
      };

      let data = await this.$callApi(
        "post",
        `${this.$baseUrl}/api/product/saveQuestion`,
        null,
        this.$headers,
        dataModal
      );

      if (data.result == 1) {
        this.isDisable = false;
        this.getQuestionData();
      }

      this.$refs["questionModal"].hide();
    },
    paginationQuestion(Page) {
      this.filterQuestion.pageNo = Page;
      this.getQuestionData();
    },
    hanndleChangePerpageQuestion(value) {
      this.filterQuestion.pageNo = 1;
      this.filterQuestion.perPage = value;
      this.getQuestionData();
    },
    getQuestionDataByFilter() {
      this.$refs.filterSidebar.hide(true);
      this.getQuestionData();
    },
    checkVerifyLength() {
      if (this.filterQuestion.verifyStatus.length == 2) {
        this.selectAllVerifyCb = true;
      } else {
        this.selectAllVerifyCb = false;
      }
    },
    checkAllVerifyStatus() {
      if (this.selectAllVerifyCb) {
        this.filterQuestion.verifyStatus = [];
      } else {
        this.filterQuestion.verifyStatus = [1, 0];
      }
    },
    checkAnswerLength() {
      if (this.filterQuestion.answerStatus.length == 2) {
        this.selectAllAnswerCb = true;
      } else {
        this.selectAllAnswerCb = false;
      }
    },
    checkAllAnswerStatus() {
      if (this.selectAllAnswerCb) {
        this.filterQuestion.answerStatus = [];
      } else {
        this.filterQuestion.answerStatus = [1, 0];
      }
    }
  }
};
</script>