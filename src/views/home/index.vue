<template>
  <div>
    <pagination :config="config.pagination"/>
    <superTable :config="config.table"></superTable>
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
          totalPages: 5
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
                    <button
                      class="btn btn-primary"
                      onClick={() => {

                      }}
                    >
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
  }
};
</script>

<style lang="scss" scoped>
</style>
