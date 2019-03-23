<template>
  <div>
    <template v-if="layoutHas('total')">
      <span class="total">{{'共' + privateConfig.total + '条'}}</span>
    </template>

    <template v-if="layoutHas('sizes')">
      <div class="sizes">
        <s-pselect :config="{
          list: size4KeyValue()
        }"></s-pselect>
      </div>
    </template>

    <ul class="pagination pagination-sm" :class="{'disabled': disabled}">
      <!-- 上一页按钮 -->
      <li :class="{'disabled': (isFirstPage || !privateConfig.total)}" @click="prevPage()">
        <a>{{ privateConfig.prevText }}</a>
      </li>
      <!-- 上一页按钮介绍 -->
      <!-- 第一页按钮 -->
      <li :class="{'active': isFirstPage}" @click="pageTo(1)" v-if="privateConfig.totalPages > 0">
        <a>1</a>
      </li>
      <!-- 第一页按钮 -->
      <!-- 上五页按钮 -->
      <li v-if="privateConfig.showPrevMore" @click="pageTo(currentPage - 5)">
        <a>...</a>
      </li>
      <!-- 上五页按钮 -->
      <!-- 页码列表循环 -->
      <li
        class="number"
        v-for="(item, index) in pageList"
        @click="pageTo(item)"
        :class="{'active': currentPage === item}"
        :key="index"
      >
        <a>{{ item }}</a>
      </li>
      <!-- 页码列表循环 -->
      <!-- 下五页按钮 -->
      <li v-if="privateConfig.showNextMore" @click="pageTo(currentPage + 5)">
        <a>...</a>
      </li>
      <!-- 下五页按钮 -->
      <!-- 最后一页按钮 -->
      <li
        class="number"
        :class="{'active': isLastPage}"
        @click="pageTo(privateConfig.totalPages)"
        v-if="privateConfig.totalPages > 1"
      >
        <a>{{ privateConfig.totalPages }}</a>
      </li>
      <!-- 最后一页按钮 -->
      <!-- 下一页按钮 -->
      <li :class="{'disabled': (isLastPage || !privateConfig.total)}" @click="nextPage()">
        <a>{{ privateConfig.nextText }}</a>
      </li>
      <!-- 下一页按钮 -->
    </ul>

    <template v-if="layoutHas('jumper')">
      <span class="jumper" :class="{'disabled': disabled}">
        前往
        <input :disabled="disabled" ref="jumpInput" type="number" min="1" :max="privateConfig.totalPages" @change="jumpTo($event)" :value="privateConfig.page">
        页
      </span>
    </template>
  </div>
</template>

<script>
export default {
  name: "SPagination",
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    config: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  components: {
    SPselect: () => import('../select')
  },
  created() {
    const cfg = this.privateConfig;
    const default_config =  {
      prevText: "前页",
      nextText: "后页",
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 0,
      sizes: [10, 20, 30, 40, 50, 100],
      layout: ""
    }
    
    for(let i in default_config){
      !cfg[i] && (this.$set(cfg, i, default_config[i]));
    }

    cfg.totalPages = cfg.totalPages || Math.ceil(cfg.total / cfg.pageSize);
  },
  data() {
    return {
      privateConfig: this.config
    };
  },
  watch: {
    currentPage() {
      this.layoutHas("jumper") && (this.$refs["jumpInput"].value = this.privateConfig.page);
      this.$emit("pageChange", this.privateConfig.page, this.privateConfig);
    },
    "privateConfig.total"() {
      this.updateTotalPages();
    },
    "privateConfig.pageSize"() {
      this.updateTotalPages();
    }
  },
  computed: {
    isFirstPage() {
      return this.currentPage == 1;
    },
    isLastPage() {
      return this.currentPage == this.privateConfig.totalPages;
    },
    currentPage() {
      return this.privateConfig.page;
    },
    pageList() {
      if (!this.privateConfig.totalPages) {
        return [];
      }
      const pageList = this.makePagers(
        this.privateConfig.page,
        this.privateConfig.totalPages
      );
      return pageList;
    }
  },
  methods: {
    size4KeyValue() {
      return this.privateConfig.sizes.map(item =>{
        return {
          key: item,
          value: `${item}条/页`
        }
      });
    },
    updateTotalPages() {
      const cfg = this.privateConfig;
      cfg.totalPages = Math.ceil(cfg.total / cfg.pageSize);
    },
    /**
     * 布局包括
     * @param {string} name 布局名称
     */
    layoutHas(name) {
      return this.privateConfig.layout && this.privateConfig.layout.includes(name);
    },
    /**
     * 上一页
     */
    prevPage() {
      if (this.isFirstPage) {
        return false;
      }
      this.pageTo(this.privateConfig.page - 1);
    },
    /**
     * 下一页
     */
    nextPage() {
      if (this.isLastPage) {
        return false;
      }
      this.pageTo(this.privateConfig.page + 1);
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
      if(this.disabled) {
        return false;
      }
      const cfg = this.privateConfig;
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
      this.$set(this.privateConfig, "showPrevMore", right);
      this.$set(this.privateConfig, "showNextMore", left);
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
