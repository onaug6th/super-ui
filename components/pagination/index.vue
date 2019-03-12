<template>
  <div>
    <template v-if="layoutHas('total')">
      <span class="total">{{'共' + config.total + '条'}}</span>
    </template>

    <template v-if="layoutHas('sizes')"></template>

    <ul class="pagination pagination-sm">
      <!-- 上一页按钮 -->
      <li :class="{'disabled': (config.page <= 1)}" @click="prevPage()">
        <a href="javascript:void(0)">{{ config.prevText }}</a>
      </li>
      <!-- 上一页按钮介绍 -->
      <!-- 第一页按钮 -->
      <li :class="{'active': config.page == 1}" @click="pageTo(1)" v-if="config.totalPages > 0">
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
        :class="{'active': config.page === item}"
        :key="index"
      >
        <a>{{ item }}</a>
      </li>
      <!-- 页码列表循环 -->
      <!-- 下五页按钮 -->
      <li v-if="config.showNextMore" class="more btn-quicknext" @click="pageTo(config.page + 5)">
        <a>...</a>
      </li>
      <!-- 下五页按钮 -->
      <!-- 最后一页按钮 -->
      <li
        class="number"
        :class="{'active': (config.page === config.totalPages)}"
        @click="pageTo(config.totalPages)"
        v-if="config.totalPages > 1"
      >
        <a>{{ config.totalPages }}</a>
      </li>
      <!-- 最后一页按钮 -->
      <!-- 下一页按钮 -->
      <li :class="{'disabled': (config.page == config.totalPages)}" @click="nextPage()">
        <a href="javascript:void(0)">{{ config.nextText }}</a>
      </li>
      <!-- 下一页按钮 -->
    </ul>

    <template v-if="layoutHas('jumper')">
      <span class="jumper">
        前往
        <input type="number" min="1" :max="config.totalPages" @change="jumpTo($event)">
        页
      </span>
    </template>
  </div>
</template>

<script>
export default {
  name: "SPagination",
  props: {
    config: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  created() {
    const cfg = this.config;
    const default_config =  {
        prevText: "前页",
        nextText: "后页",
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
        layout: ""
      }

    for(let i in default_config){
      !cfg[i] && (this.$set(cfg, i, default_config[i]));
    }

    cfg.totalPages = cfg.totalPages || Math.ceil(cfg.total / cfg.pageSize);
  },
  data() {
    return {};
  },
  watch: {
    currentPage() {
      this.$emit("pageChange", this.config.page, this.config);
    }
  },
  computed: {
    currentPage() {
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
    setConfig(attr){
      const that = this;
      const cfg = that.config;
      attr.forEach(item => {
        that[item] && (cfg[item] = that[item]);
      });
    },
    /**
     * 布局包括
     * @param {string} name 布局名称
     */
    layoutHas(name) {
      return this.config.layout && this.config.layout.includes(name);
    },
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
     * 下一页
     */
    nextPage() {
      if (this.config.page == this.config.totalPages) {
        return false;
      }
      this.config.page += 1;
    },
    /**
     * 跳转到
     * @param {Event} $event
     */
    jumpTo($event) {
      this.pageTo($event.target.value);
      $event.target.value = this.currentPage;
    },
    /**
     * 根据页码去指定页
     * @param {number} page 页码
     */
    pageTo(page) {
      const cfg = this.config;
      page = +page;
      if (page !== this.currentPage) {
        if (page > cfg.totalPages) {
          cfg.page = cfg.totalPages;
        } else if (page < 1) {
          cfg.page = 1;
        } else {
          cfg.page = page;
        }
      }
    },
    /**
     * 是否展示更多页码
     * @param {boolean} right
     * @param {boolean} left
     */
    setMoreBtn(right, left) {
      this.$set(this.config, "showPrevMore", right);
      this.$set(this.config, "showNextMore", left);
    },
    /**
     * 生成页码
     * @param {number} current 当前页
     * @param {number} count 总页数
     */
    makePagers(current, count) {
      const pagerCount = 7;

      //  如果总页数小于当前展示量
      if (count < pagerCount) {
        this.setMoreBtn(false, false);
        const target = this.pagerGenerator(2);
        target.length = count - 2 >= 0 ? count - 2 : 0;
        return target;
      }

      //  只展示左侧的更多按钮
      //  假设当前有十页，当选择到了第八页时。因为同一时间只有七条页码（count）出现，所以只展示左侧的更多按钮
      if (current + 2 >= count) {
        this.setMoreBtn(true, false);
        return this.pagerGenerator(count - 5);
      }
      //  只展示右侧的更多按钮
      //  假设当前有第十页，当选择第五页前。因为同一时间只有七条页码（count）出现，所以只展示右侧的更多按钮
      if (current - 2 <= 2) {
        this.setMoreBtn(false, true);
        return this.pagerGenerator(2);
      }
      //  两侧的更多按钮出现
      this.setMoreBtn(true, true);
      return this.pagerGenerator(current - 2);
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
