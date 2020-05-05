<template>
  <div role="presentation" class="dropdown open" v-clickoutside="clickoutside">
    <a class="dropdown-toggle" role="button" @click="toggleMenu(true)">
      {{config.label}}
      <span class="caret"></span>
    </a>
    <ul class="dropdown-menu" v-show="config.isOpen">
      <li v-for="(item, index) in config.list" :key="index" @click="selectItem(item)">
        <div v-if="item.divider" role="separator" class="divider"></div>
        <a :data-index="index">{{item.value}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
import Clickoutside from '@/utils/clickoutside';

export default {
  name: "SDropdown",
  props: {
    config: {
      type: Object,
      required: false,
      default() {
        return {
          label: "下拉框",
          value: "",
          isOpen: false,
          list: []
        };
      }
    }
  },
  directives: { Clickoutside },
  data() {
    return {};
  },
  computed: {},
  methods: {
    /**
     * 切换打开菜单
     * @param {string} type 类型
     */
    toggleMenu(type) {
      this.config.isOpen = type;
    },
    /**
     * 选中某一行
     * @param {object} item 当前行对象
     */
    selectItem(item) {
      this.$emit("selected", item.key, item);
      this.toggleMenu(false);
    },
    /**
     * 点击了绑定元素以外时的回调事件
     */
    clickoutside(){
      this.toggleMenu(false);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./dropdown.scss";
</style>
