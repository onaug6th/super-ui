import { on, off } from "../utils/index";

const BAR_MAP = {
    vertical: {
        offset: 'offsetHeight',
        scroll: 'scrollTop',
        scrollSize: 'scrollHeight',
        size: 'height',
        key: 'vertical',
        axis: 'Y',
        client: 'clientY',
        direction: 'top'
    },
    horizontal: {
        offset: 'offsetWidth',
        scroll: 'scrollLeft',
        scrollSize: 'scrollWidth',
        size: 'width',
        key: 'horizontal',
        axis: 'X',
        client: 'clientX',
        direction: 'left'
    }
};

function renderThumbStyle({ move, size, bar }) {
    const style = {};
    const translate = `translate${bar.axis}(${move}%)`;

    style[bar.size] = size;
    style.transform = translate;
    style.msTransform = translate;
    style.webkitTransform = translate;

    return style;
};

/* istanbul ignore next */
export default {
    name: 'Bar',

    props: {
        //  垂直滚动条
        vertical: Boolean,
        size: String,
        move: Number
    },

    computed: {
        bar() {
            return BAR_MAP[this.vertical ? 'vertical' : 'horizontal'];
        },

        wrap() {
            return this.$parent.wrap;
        }
    },

    render(h) {
        const { size, move, bar } = this;

        return (
            <div
                class={['el-scrollbar__bar', 'is-' + bar.key]}
                onMousedown={this.clickTrackHandler} >
                <div
                    ref="thumb"
                    class="el-scrollbar__thumb"
                    onMousedown={this.clickThumbHandler}
                    style={renderThumbStyle({ size, move, bar })}>
                </div>
            </div>
        );
    },

    methods: {
        //  按下滚动条
        clickThumbHandler(e) {
            // prevent click event of right button
            if (e.ctrlKey || e.button === 2) {
                return;
            }
            this.startDrag(e);
            this[this.bar.axis] = (e.currentTarget[this.bar.offset] - (e[this.bar.client] - e.currentTarget.getBoundingClientRect()[this.bar.direction]));
        },
        //  按下滚动条区域的某一个位置进行快速定位
        clickTrackHandler(e) {
            const offset = Math.abs(e.target.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]);
            const thumbHalf = (this.$refs.thumb[this.bar.offset] / 2);
            const thumbPositionPercentage = ((offset - thumbHalf) * 100 / this.$el[this.bar.offset]);
            //  设置外壳的 scrollHeight 或 scrollWidth的新值。达到滚动的效果
            this.wrap[this.bar.scroll] = (thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100);
        },
        //  开始滚动
        startDrag(e) {
            //  停止后续的相同事件函数执行
            e.stopImmediatePropagation();
            
            this.cursorDown = true;
            //  监听鼠标移动事件
            on(document, 'mousemove', this.mouseMoveDocumentHandler);
            //  监听鼠标松开事件
            on(document, 'mouseup', this.mouseUpDocumentHandler);
            document.onselectstart = () => false;
        },
        //  按下滚动条，并且鼠标移动时
        mouseMoveDocumentHandler(e) {
            if (this.cursorDown === false) return;
            const prevPage = this[this.bar.axis];

            if (!prevPage) return;

            const offset = ((this.$el.getBoundingClientRect()[this.bar.direction] - e[this.bar.client]) * -1);
            const thumbClickPosition = (this.$refs.thumb[this.bar.offset] - prevPage);
            const thumbPositionPercentage = ((offset - thumbClickPosition) * 100 / this.$el[this.bar.offset]);

            this.wrap[this.bar.scroll] = (thumbPositionPercentage * this.wrap[this.bar.scrollSize] / 100);
        },
        //  按下滚动条，并且鼠标松开
        mouseUpDocumentHandler(e) {
            this.cursorDown = false;
            this[this.bar.axis] = 0;
            off(document, 'mousemove', this.mouseMoveDocumentHandler);
            document.onselectstart = null;
        }
    },

    destroyed() {
        off(document, 'mouseup', this.mouseUpDocumentHandler);
    }
};
