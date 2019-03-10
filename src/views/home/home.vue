<template>
  <div>
    <s-pagination :config="config.pagination"></s-pagination>
    <s-select :config="config.select"></s-select>
    <s-dropdown :config="config.dropdown" @selected="dropdownSelected"></s-dropdown>
    <s-table :config="config.table"></s-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      config: {
        pagination: {
          prevText: "前页",
          nextText: "后页",
          page: 1,
          pageSize: 10,
          total: 100,
          layout: "total,sizes,jumper"
        },

        select: {
          label: "",
          value: "",
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
              label: "时间",
              formatter: (field, tr) => {
                return `<div>${tr[field].split(" ")[0]}</div>`;
              }
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
          data: [],
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
  methods: {
    dropdownSelected(key, obj) {
      alert(`你选中了` + obj.value);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
