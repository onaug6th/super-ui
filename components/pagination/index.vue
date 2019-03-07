<template>
  <div>
    <ul class="pagination pagination-sm no-margin pull-right" :class="config.className">
      <!-- 上一页按钮 -->
      <li :class="{ 'disabled' : (config.page <= 1)}" @click="prevPage()">
        <a href="javascript:void(0)">{{ config.prevText }}</a>
      </li>
      <!-- 上一页按钮介绍 -->
      <!-- 第一页按钮 -->
      <li :class="{ 'active' : config.page == 1 }" @click="pageTo(1)" v-if="config.totalPages > 0">
        <a>1</a>
      </li>
      <!-- 第一页按钮 -->
      <!-- 上五页按钮 -->
      <li v-if="config.showPrevMore" @click="pageTo(config.page - 5)">
        <a>...</a>
      </li>
      <!-- 上五页按钮 -->
      <!-- 页码列表循环 -->
      <li
        class="number"
        v-for="(item, index) in pageList"
        @click="pageTo(item)"
        :class="{ 'active' : config.page === item }"
        :key="index"
      >
        <a>{{ item }}</a>
      </li>
      <!-- 页码列表循环 -->
      <!-- 下五页按钮 -->
      <li class="more btn-quicknext" v-if="config.showNextMore" @click="pageTo(config.page + 5)">
        <a>...</a>
      </li>
      <!-- 下五页按钮 -->
      <!-- 最后一页按钮 -->
      <li
        class="number"
        :class="{ 'active' : (config.page === config.totalPages)}"
        @click="pageTo(config.totalPages)"
        v-if="config.totalPages > 1"
      >
        <a>{{ config.totalPages }}</a>
      </li>
      <!-- 最后一页按钮 -->
      <!-- 下一页按钮 -->
      <li :class="{ 'disabled' : (config.page == config.totalPages)}" @click="nextPage()">
        <a href="javascript:void(0)">{{ config.nextText }}</a>
      </li>
      <!-- 下一页按钮 -->
    </ul>
  </div>
</template>

<script>
export default {
  name: "pagination",
  props: {
    config: {
      type: Object,
      required: true
    }
  },
  mounted() {},
  data() {
    return {};
  },
  watch: {
    page() {
      this.$emit("pageChange", this.config.page, this.config);
    }
  },
  computed: {
    page() {
      return this.config.page;
    },
    pageList() {
      if (!this.config.totalPages) {
        return [];
      }
      const pageList = this.makePagers(
        this.config.page,
        this.config.totalPages
      );
      return pageList;
    }
  },
  methods: {
    /**
     * 上一页
     */
    prevPage() {
      if (this.config.page <= 1) {
        return false;
      }
      this.config.page -= 1;
    },
    /**
     * 根据页码去指定页
     * @param {number} page 页码
     */
    pageTo(page) {
      if (page !== this.page) {
        this.config.page = page;
      }
    },
    /**
     * 下一页
     */
    nextPage() {
      if (this.config.page == this.config.totalPages) {
        return false;
      }
      this.config.page += 1;
    },
    /**
     * 生成页码
     * @param {number} current 当前页
     * @param {number} count 总页数
     */
    makePagers(current, count) {
      const pagerCount = 7;
      if (count < pagerCount) {
        // this.setMoreBtn(false, false);
        const target = this.pagerGenerator(2);
        target.length = count - 2 >= 0 ? count - 2 : 0;
        return target;
      }

      const max = current + 2;
      const min = current - 2;

      if (max >= count) {
        // this.setMoreBtn(true, false);
        return this.pagerGenerator(count - 5);
      }
      if (min <= 2) {
        // this.setMoreBtn(false, true);
        return this.pagerGenerator(2);
      }
      // this.setMoreBtn(true, true)
      return this.pagerGenerator(min);
    },
    /**
     * 生成页码
     * @param {number} minValue
     */
    pagerGenerator(minValue) {
      //  new Array，实例化一个空数组。fill遍历全部值为空，map返回最小值加1，共五条数据。
      return new Array(5).fill("").map((v, i) => minValue + i);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
