<template>
  <div>
    <table class="table table-bordered table-hover">
      <!-- 表格头部 -->
      <thead>
        <tr>
          <th v-if="config.checkbox">
            <input type="checkbox" @click="selectAll()" v-model="isCheckedAll">
          </th>

          <th v-for="(th, index) in config.colOption" :key="index" :data-field="th.field">
            <template>{{ th.label }}</template>
          </th>
        </tr>
      </thead>
      <!-- 表格头部 -->
      <!-- 表格内容 -->
      <tbody>
        <!--
                    tr = {
                        id : "",
                        name : "",
                        createAt : "",
                        updateAt : ""
                    }
        -->
        <tr
          v-for="(tr, trIndex) in config.data"
          :key="trIndex"
          :data-index="trIndex"
          @click="singleSelect($event, tr)"
        >
          <td v-if="config.checkbox">
            <input type="checkbox" v-model="tr.isChecked" data-checkbox="true">
          </td>

          <template v-for="(td ,tdIndex) in config.colOption">
            <td :key="tdIndex">
              <!-- jsx渲染 -->
              <template v-if="config.colOption[tdIndex]['jsxRender']">
                <jsxDom
                  :row="tr"
                  :jsxRender="config.colOption[tdIndex]['jsxRender']"
                  :index="tdIndex"
                ></jsxDom>
              </template>

              <!-- html模板渲染 -->
              <template v-else-if="config.colOption[tdIndex].formatter">
                <div
                  v-html="config.colOption[tdIndex].formatter(config.colOption[tdIndex]['field'], tr)"
                ></div>
              </template>

              <template v-else>{{ tr[config.colOption[tdIndex]['field']] }}</template>
            </td>
          </template>
        </tr>

        <tr v-if="!config.data || config.data.length == 0">
          <td class="text-center" :colspan="countAllCol">暂无数据</td>
        </tr>
      </tbody>
      <!-- 表格内容 -->
    </table>

    <template v-if="config.pagination">
      <pagination :config="config.pagination" @pageChange="pageChange"></pagination>
    </template>
  </div>
</template>


<script>
import pagination from "../pagination";

export default {
  name: "superTable",
  props: {
    config: {
      type: Object,
      required: true,
      default: {
        colOption: [],
        data: []
      }
    }
  },
  components: {
    pagination,
    jsxDom: {
      functional: true,
      props: {
        row: Object,
        jsxRender: Function,
        index: Number
      },
      /**
       * @param {fn} createElement 创建jsx
       * @param {object} context 上下文作用域
       */
      render: (createElement, context) => {
        const params = {
          row: context.props.row,
          index: context.props.index
        };
        return context.props.jsxRender(createElement, params);
      }
    }
  },
  data() {
    return {
      isCheckedAll: false,
      checkedData: []
    };
  },
  computed: {
    //  计算全部列的数量
    countAllCol() {
      const config = this.config;
      if (!config.colOption) {
        return config.checkbox ? 1 : 0;
      } else {
        return config.colOption.length + (config.checkbox ? 1 : 0);
      }
    }
  },
  watch: {
    checkedData() {
      this.judegeNeedToSelectAll();
    }
  },
  methods: {
    /**
     * 查找该字段是否允许展示
     * @param { string } fieldName 字段名
     */
    canMapField(fieldName) {
      const answer = this.config.colOption.filter((item, index) => {
        if (item.field == fieldName) {
          return item;
        }
      });

      return answer.length > 0 ? true : false;
    },
    /**
     * 选择全部
     */
    selectAll() {
      this.config.data.forEach((item, index) => {
        item.isChecked = !this.isCheckedAll;
      });

      this.isCheckedAll = !this.isCheckedAll;
      this.recordCheckedData();
    },
    /**
     * 单个选择
     * @param {event} e 事件对象
     * @param {object} tr 行对象
     */
    singleSelect(e, tr) {
      const target = e.target;
      const targetName = target.tagName;

      //  单选按钮点击
      if (
        targetName == "INPUT" &&
        target.type == "checkbox" &&
        target.dataset["checkbox"]
      ) {
        this.$set(tr, "isChecked", !tr.isChecked);
      }
      //  行点击
      else if (targetName == "TD") {
        this.config.clickToSelect && this.$set(tr, "isChecked", !tr.isChecked);
      }
      this.recordCheckedData();
    },
    //  判断是否全选
    judegeNeedToSelectAll() {
      let answer = true;
      this.config.data.forEach((item, index) => {
        if (!item.isChecked) {
          answer = false;
        }
      });
      answer ? (this.isCheckedAll = true) : (this.isCheckedAll = false);
    },
    /**
     * 记录选中的数据
     */
    recordCheckedData() {
      this.checkedData = [];
      this.config.data.forEach((item, index) => {
        if (item.isChecked) {
          this.checkedData.push(item);
        }
      });
      this.$emit("checked", this.checkedData);
    },
    pageChange() {
      this.$emit("pageChange", this.config.pagination);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./index.scss";
</style>
