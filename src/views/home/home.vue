<template>
  <div>

    <h4>无配置的分页</h4>
    <s-pagination></s-pagination>

    <h4>配置数量的分页</h4>
    <s-pagination :config="{total: 50}"></s-pagination>

    <h4>配置了文案和数量的分页</h4>
    <s-pagination :config="{total: 50, prevText: `上一页`,nextText: `下一页`}"></s-pagination>

    <h4>满配置的分页</h4>
    <s-pagination
      :config="config.pagination"
    ></s-pagination>

    <h4>满配置但禁用的分页</h4>
    <s-pagination
      :config="config.pagination"
      :disabled="true"
    ></s-pagination>

    <h4>选择框</h4>
    <div style="width: 200px">
      <s-select :config="config.select"></s-select>
    </div>

    <h4>配置了默认值的选择框</h4>
    <div style="width: 200px">
      <s-select :config="{
          label: '选择您的性别',
          defaultKey: '1',
          list: [
            {
              key: '1',
              value: '男'
            },
            {
              key: '0',
              value: '0'
            },
            {
              key: '2',
              divider: true,
              value: '未知'
            }
          ]
        }"></s-select>
    </div>

    <h2>以下为需要按需引入组件</h2>
    
    <h4>下拉菜单</h4>
    <div style="width: 200px">
      <s-dropdown :config="config.dropdown" @selected="dropdownSelected"></s-dropdown>
    </div>

    <h4>表格</h4>
    <s-table :config="config.table"></s-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      config: {

        pagination:{
          prevText: `前页`,
          nextText: `后页`,
          page: 1,
          pageSize: 10,
          total: 100,
          layout: `total,sizes,jumper`
        },

        select: {
          label: "",
          defaultKey: "",
          list: [
            {
              key: "1",
              value: "男"
            },
            {
              key: "0",
              value: "女"
            },
            {
              key: "3",
              divider: true,
              value: "未知"
            }
          ]
        },

        dropdown: {
          label: "选择性别",
          isOpen: false,
          list: [
            {
              key: "1",
              value: "男"
            },
            {
              key: "0",
              value: "女"
            },
            {
              key: "3",
              divider: true,
              value: "未知"
            }
          ]
        },

        table: {
          checkbox: true,
          clickToSelect: true,
          data: [
            { id: 1, type: "类型1", tag: "标签1", title: "标题1", bgUrl: "www.hao123.com", show: "是", homeShow: "否", read: "0", like: "1", createdAt: "2018-01-01"}
          ],
          colOption: [
            {
              field: "id",
              label: "文章ID"
            },
            {
              field: "type",
              label: "文章所属类型",
              formatter: (field, tr) => {
                return tr[field];
              }
            },
            {
              field: "tag",
              label: "文章标签",
              formatter: (field, tr) => {
                return tr[field];
              }
            },
            {
              field: "title",
              label: "文章标题"
            },
            {
              field: "bgUrl",
              label: "背景图片",
              formatter: (field, tr) => {
                return `<div>${tr[field] ? "有" : ""}</div>`;
              }
            },
            {
              field: "show",
              label: "展示",
              formatter: (field, tr) => {
                return `<div>${+tr[field] ? "是" : "否"}</div>`;
              }
            },
            {
              field: "homeShow",
              label: "首页展示",
              formatter: (field, tr) => {
                return `<div>${+tr[field] ? "是" : "否"}</div>`;
              }
            },
            {
              field: "read",
              label: "阅读量"
            },
            {
              field: "like",
              label: "点赞"
            },
            {
              field: "createdAt",
              label: "时间"
            },
            {
              field: "operate",
              label: "操作",
              jsxRender: (h, params) => {
                return (
                  <div>
                    <button class="btn btn-primary" onClick={() => {}}>
                      编辑
                    </button>
                  </div>
                );
              }
            }
          ],
          pagination: {
            prevText: "前页",
            nextText: "后页",
            page: 1,
            pageSize: 10,
            totalPages: 0
          }
        }
      }
    };
  },
  mounted() {
    window.scrollBar = this.$refs.scrollBar;
  },
  methods: {
    dropdownSelected(key, obj) {
      alert(`你选中了` + obj.value);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
