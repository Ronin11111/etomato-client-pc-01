<template>
  <div class="goods-sku">
    <dl v-for="item in goods.specs" :key="item.id">
      <dt>{{ item.name }}</dt>
      <dd>
        <template v-for="obj in item.values" :key="obj.name">
          <img @click="changeItem(item,obj)" :class="{selected:obj.selected,disabled:obj.disabled}" v-if="obj.picture" :src="obj.picture" :title="obj.name"/>
          <span @click="changeItem(item,obj)" :class="{selected:obj.selected,disabled:obj.disabled}" v-else>{{ obj.name }}</span>
        </template>
      </dd>
    </dl>
  </div>
</template>
<script>
import getPowerSet from '@/vender/power-set'

// 1.得到路径字典的函数
const getpathMap = (skus) => {
  const pathMap = {}
  skus.forEach(sku => {
    // 1.筛选skus中的有效数据
    if (sku.inventory > 0) {
    // 2.取出skus中数据组合
      const specsAttr = sku.specs.map(item => item.valueName)
      // 3.依据数据得到所有的子级集合
      const specialAll = getPowerSet(specsAttr)
      // 4.生成路径字典
      specialAll.forEach(itm => {
        // ①将子级由数组形式=》字符串形式
        const key = itm.join('&')
        // ②判断是否有重复key值
        if (pathMap[key]) {
          pathMap[key].push(sku.id)
        } else {
          pathMap[key] = [sku.id]
        }
      })
    }
  })
  console.log(pathMap)
  return pathMap
}

// 4.初始化选中状态
// 初始化选中状态
const initSelected = (goods, skuId) => {
  // ①找到对应的sku组合
  const initSku = goods.skus.find(sku => sku.id === skuId)
  if (initSku) {
    goods.specs.forEach((spec, i) => {
      const value = initSku.specs[i].valueName
      spec.values.forEach(val => {
        // ②遍历每行属性，找到组合中的每个规格
        const valItem = val.find(val => val.name === value)
        // ③将其selected设为true
        valItem.selected = true
      })
    })
  }
}

// 2.获取当前选中规格集合数组
const getcurrentArr = (specs) => {
  const currentSelect = []
  specs.forEach(item => {
    const selectVal = item.values.find(its => its.selected)
    currentSelect.push(selectVal ? selectVal.name : undefined)
  })
  console.log(currentSelect)
  return currentSelect
}
// 3.更新按钮对禁用状态
const updateStatus = (specs, pathMap) => {
  // ①获取所有按钮状态
  const currentArr = getcurrentArr(specs)
  specs.forEach((item, index) => {
    item.values.forEach(obj => {
      // ②判断按钮是否被选中，选中则无需判断
      if (obj.name === currentArr[index]) return false
      // ③未选中，将其追加在按钮列表的对应位置
      currentArr[index] = obj.name
      // ④过滤无效的undefined值
      const key = currentArr.filter(it => it).join('&')
      // ⑤不再路径地图中，设置禁用状态
      obj.disabled = !pathMap[key]
    })
  })
}

export default {
  name: 'GoodsSku',
  props: {
    goods: {
      type: Object,
      default: () => {}
    },
    skuId: {
      type: String,
      default: ''
    }
  },
  setup (props, { emit }) {
    // console.log(props.goods.specs)
    // 获取路径地图
    const pathMap = getpathMap(props.goods.skus, props.skuId)
    // 初始化选中状态
    initSelected(props.goods)
    // ①初始化时，判断按钮选中状态
    updateStatus(props.goods.specs, pathMap)
    const changeItem = (item, obj) => {
      // 如果是禁用状态不作为
      if (obj.disabled) return false
      if (obj.selected) {
        obj.selected = !obj.selected
      } else {
        // eslint-disable-next-line no-return-assign
        item.values.forEach(val => val.selected = false)
        obj.selected = !obj.selected
      }
      // ②点击按钮时，判断按钮选中状态
      updateStatus(props.goods.specs, pathMap)
      // ③点击按钮，将按钮信息同步传递给父组件
      // ③.1.先判断是否为完整数据
      const valueLength = getcurrentArr(props.goods.specs).filter(it => it)
      if (props.goods.specs.length === valueLength.length) {
        // console.log(valueLength.join('&'))
        // ③.2.在路径地图中，找到对应数据
        const skuId = pathMap[valueLength.join('&')]
        // console.log(skuId)
        // ③.3.将其对应信息遍历取出
        const sku = props.goods.skus.find(obj => obj.id === skuId[0])
        console.log(sku.specs)
        // 将对应信息作为对象传递给父组件
        emit('change', {
          skuId: sku.id,
          price: sku.price,
          oldPrice: sku.oldPrice,
          inventory: sku.inventory,
          specsText: sku.specs.reduce((a, b) => `${a} ${b.name}:${b.valueName}`, '').trim()
        })
        console.log(sku.specs.reduce((a, b) => `${a} ${b.name}:${b.valueName}`, '').trim())
      } else {
        // 2.2.不为完整数组，传递空对象
        emit('change', {})
      }
    }
    return { changeItem }
  }
}
</script>
<style scoped lang="less">
.sku-state-mixin () {
  border: 1px solid #e4e4e4;
  margin-right: 10px;
  cursor: pointer;
  &.selected {
    border-color: @xtxColor;
  }
  &.disabled {
    opacity: 0.6;
    border-style: dashed;
    cursor: not-allowed;
  }
}
.goods-sku {
  padding-left: 10px;
  padding-top: 20px;
  dl {
    display: flex;
    padding-bottom: 20px;
    align-items: center;
    dt {
      width: 50px;
      color: #999;
    }
    dd {
      flex: 1;
      color: #666;
      > img {
        width: 50px;
        height: 50px;
        .sku-state-mixin ();
      }
      > span {
        display: inline-block;
        height: 30px;
        line-height: 28px;
        padding: 0 20px;
        .sku-state-mixin ();
      }
    }
  }
}
</style>
