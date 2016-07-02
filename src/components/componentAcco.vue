<template>
  <div class="panel panel-default">
     <div class="panel-heading">
     <h1>已完成任务</h1>
     </div>
     <div class="panel-body">
       <ul class="list">
          <li v-for='isdone in doneList' class="list-item">{{isdone.startTime}} - {{isdone.endTime}} {{isdone.thing}}</li>
       </ul>
       <input type = 'button' class='btn btn-primary' value = '下载记录' @click='download'/>
    </div>
</div>
</template>
<script>
export default {
  props: ['adone'],
  data: function () {
    return {
      doneList: JSON.parse(window.localStorage.getItem('doneList')) || []
    }
  },
  watch: {
    'adone': {
      handler: function (val, oldVal) {
        if (val.thing) {
          var x = {}
          for (var index in val) {
            x[index] = val[index]
          }
          var today = (new Date().getMonth() + 1) + '月' + new Date().getDate() + '日'
          x.startTime = today + x.startTime
          x.endTime = x.endTime
          this.doneList.push(x)
          val.thing = ''
          window.localStorage.setItem('doneList', JSON.stringify(this.doneList))
        }
      },
      deep: true
    }
  },
  methods: {
    download () {
      var aLink = document.createElement('a')
      var items = JSON.parse(window.localStorage.getItem('doneList'))
      var content = '开始时间,结束时间,完成任务\n'
      var len = items.length
      for (let i = 0; i < len; i++) {
        content += items[i].startTime + ',' + items[i].endTime + ',' + items[i].thing + '\n'
      }
      this.doneList = []
      window.localStorage.removeItem('doneList')
      var blob = new window.Blob(['\uFEFF' + content])
      // var evt = document.createEvent("HTMLEvents")
      aLink.download = '番茄土豆完成任务记录.csv'
      aLink.href = window.URL.createObjectURL(blob)
      aLink.click()
    }
  }
}
</script>
<style>
.list{
  padding:0;
  list-style:none;
}
.list-item{
  padding:10px 0;
  border-bottom: 1px solid #ccc;
}
.pane-body{
  overflow-y: scroll;
}
</style>
